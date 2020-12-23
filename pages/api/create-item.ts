import getDb from '../../firebase/db'
import firebase from 'firebase'

export default async function createItem(req, res) {
  if (req.method !== 'POST') {
    res.status(404).send('Unrecognised endpoint')
    return
  }
  const { id, label } = req.body
  const added_on = new Date()
  const db = await getDb()
  await db.collection('items').doc(id).set({
    label,
    added_on,
  })
  res.status(200).end(
    JSON.stringify({
      item: { id, label, added_on },
    }),
  )
}
