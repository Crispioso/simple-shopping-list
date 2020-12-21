import getDb from '../../firebase/db'
import firebase from 'firebase'

export default async function toggleListItem(req, res) {
  if (req.method !== 'PUT') {
    res.status(404).send('Unrecognised endpoint')
    return
  }
  const { listId, listItemId, completed } = req.body
  const db = await getDb()
  await db
    .collection('lists')
    .doc(listId)
    .update({
      [`listItemsMap.${listItemId}.completed`]: completed,
    })
  res.status(200).end(JSON.stringify({}))
}
