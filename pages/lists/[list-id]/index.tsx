import { ShoppingList as ShoppingListT } from '../../../components/ShoppingList/types'
import ShoppingList from '../../../components/ShoppingList'
import { ListItem as ListItemT } from '../../../components/ListItem/types'
import getDb from '../../../firebase/db'
import checkAuth from '../../../utils/checkAuth'

type Props = {
  list: ShoppingListT
  previousItems: Array<{ id: string; addedOn: string; label: string }>
}

export default function ShoppingListPage({ list, previousItems }: Props) {
  return (
    <>
      <h1>Shopping list</h1>
      <ShoppingList list={list} previousItems={previousItems} />
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

  const itemsMap = new Map()
  const itemsCollection = db.collection('items')
  const itemsQuery = await itemsCollection.get()
  const previousItems = []
  itemsQuery.forEach((item) => {
    const formattedData = {
      label: item.data().label,
      addedOn: item.data().added_on.toDate().toISOString(),
    }
    itemsMap.set(item.id, formattedData)
    previousItems.push({ id: item.id, ...formattedData })
  })
  console.log(docData.listItemsMap)
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
    items: Object.keys(docData.listItemsMap).map((id) => {
      const listItem = docData.listItemsMap[id]
      return {
        id,
        label: itemsMap.get(listItem.itemId).label,
        addedOn: itemsMap.get(listItem.itemId).addedOn,
        completed: listItem.completed,
        quantity: listItem.quantity,
      }
    }),
  }

  return { props: { list, previousItems } }
}
