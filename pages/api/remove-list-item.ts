import getDb from '../../firebase/db'
import admin from 'firebase-admin'

export default async function editListItemRef(req, res) {
  if (req.method !== 'DELETE') {
    res.status(404).send('Unrecognised endpoint')
    return
  }
  const { listItemId, listId } = req.body
  const db = await getDb()
  await db
    .collection('lists')
    .doc(listId)
    .update({
      [`listItemsMap.${listItemId}`]: admin.firestore.FieldValue.delete(),
    })
  res.status(200).end(JSON.stringify({}))
}
