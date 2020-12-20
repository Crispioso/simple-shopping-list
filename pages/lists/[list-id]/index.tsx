import { ShoppingList as ShoppingListT } from '../../../components/ShoppingList/types'
import ShoppingList from '../../../components/ShoppingList'
import getDb from '../../../firebase/db'
import checkAuth from '../../../utils/checkAuth'

type Props = {
  list: ShoppingListT
}

export default function ShoppingListPage({ list }: Props) {
  return (
    <>
      <h1>Shopping list</h1>
      <ShoppingList list={list} />
    </>
  )
}

export async function getServerSideProps(context) {
  if (!checkAuth(context)) {
    return { props: {} }
  }

  const { req } = context
  const listId = req.url.replace('/lists/', '')
  const db = await getDb()
  const doc = await db.collection('lists').doc(listId).get()
  const docData = doc.data()

  const itemsMap = {}
  docData.listItems.forEach((item) => {
    const itemId = item.item.id
    if (itemsMap[itemId] in itemsMap) {
      return
    }
    itemsMap[itemId] = undefined
  })
  const requests = Object.keys(itemsMap).map((itemId) =>
    db.collection('items').doc(itemId).get(),
  )
  const itemDocs = await Promise.all(requests)
  itemDocs.forEach((itemDoc) => {
    itemsMap[itemDoc.id] = {
      label: itemDoc.data().label,
      addedOn: itemDoc.data().added_on.toDate().toISOString(),
    }
  })
  const list: ShoppingListT = {
    id: doc.id,
    createdOn: docData.createdOn.toDate().toISOString(),
    archivedOn:
      docData.archivedOn != null
        ? docData.archivedOn.toDate().toISOString()
        : null,
    completedOn:
      docData.completedOn != null
        ? docData.completedOn.toDate().toISOString()
        : null,
    items: docData.listItems.map((listItem) => ({
      ...itemsMap[listItem.item.id],
      id: listItem.id,
      completed: listItem.completed,
      quantity: listItem.quantity,
    })),
  }

  return { props: { list } }
}
