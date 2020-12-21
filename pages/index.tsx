import { format } from 'date-fns'
import Link from 'next/link'

import 'firebase/auth'
import getDb from '../firebase/db'
import { ShoppingList } from '../components/ShoppingList/types'
import checkAuth from '../utils/checkAuth'

type Props = {
  lists: Array<ShoppingList>
}

export default function Index({ lists }: Props) {
  return (
    <>
      <h1>Shopping lists</h1>
      <ul>
        {lists.map((list) => {
          console.log(list)
          return (
            <li key={list.id}>
              <Link href={`/lists/${list.id}`}>
                <a>{format(new Date(list.createdOn), 'eeee eo MMMM')} list</a>
              </Link>
            </li>
          )
        })}
      </ul>
    </>
  )
}

export async function getServerSideProps(context) {
  if (!checkAuth(context)) {
    return { props: {} }
  }
  const db = await getDb()
  const lists: Array<ShoppingList> = []
  await db
    .collection('lists')
    .get()
    // Create a map of all items that we've used to make fetching them more efficient later
    .then(async (querySnapshot) => {
      const itemsMap = {}
      const reqs = []
      querySnapshot.forEach((doc) => {
        doc.data().listItems.forEach((item) => {
          reqs.push(db.collection('items').doc(item.itemId).get())
          // reqs.push(item.item.get())
        })
      })
      const rsp = await Promise.all(reqs)
      rsp.forEach((item) => {
        const itemData = item.data()
        itemsMap[item.id] = {
          label: itemData.label,
          addedOn: itemData.added_on.toDate().toISOString(),
        }
      })
      return Promise.resolve({ querySnapshot, itemsMap })
    })
    // Go through all of our lists and build up a more friendly data structure
    .then(({ querySnapshot, itemsMap }) => {
      console.log(itemsMap)
      querySnapshot.forEach((doc) => {
        const docData = doc.data()
        const data = {
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
          items: Object.keys(docData.listItemsMap).map((listItemId) => {
            const item = docData.listItemsMap[listItemId]
            return {
              ...itemsMap[item.itemId],
              completed: item.completed,
              quantity: item.quantity,
            }
          }),
        }
        lists.push(data)
      })
    })
    .then()
    .catch((error) => {
      console.error('Firebase query failed', error)
    })

  return { props: { lists } }
}
