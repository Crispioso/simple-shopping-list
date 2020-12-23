import { format } from 'date-fns'
import Link from 'next/link'

import 'firebase/auth'
import getDb from '../firebase/db'
import checkAuth from '../utils/checkAuth'

type ShoppingList = {
  id: string
  completedOn: string
  createdOn: string
  archivedOn: string
}

type Props = {
  lists: Array<ShoppingList>
}

export default function Index({ lists }: Props) {
  return (
    <>
      <h1>Shopping lists</h1>
      <ul>
        {lists.map((list) => {
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
    // Go through all of our lists and build up a more friendly data structure
    .then((querySnapshot) => {
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
        }
        lists.push(data)
      })
    })
    .catch((error) => {
      console.error('Firebase query failed', error)
    })

  return { props: { lists } }
}
