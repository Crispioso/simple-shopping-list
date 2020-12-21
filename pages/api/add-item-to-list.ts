import getDb from '../../firebase/db'
// import admin from 'firebase-admin'
import getFirebaseAdmin from '../../firebase/admin'

export default async function addItemToList(req, res) {
  if (req.method !== 'PUT') {
    res.status(404).send('Unrecognised endpoint')
    return
  }
  console.log(req.body)
  const { listId, item } = req.body
  const db = await getDb()
  const admin = await getFirebaseAdmin()
  await db
    .collection('lists')
    .doc(listId)
    .update({
      listItems: admin.firestore.FieldValue.arrayUnion(item),
    })

  res.status(200).end(JSON.stringify({}))
}
