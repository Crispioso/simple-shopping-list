import getDb from '../../firebase/db'

export default async function editListItemQuantity(req, res) {
  if (req.method !== 'PUT') {
    res.status(404).send('Unrecognised endpoint')
    return
  }
  const { listId, listItemId, quantity } = req.body
  const db = await getDb()
  await db
    .collection('lists')
    .doc(listId)
    .update({
      [`listItemsMap.${listItemId}.quantity`]: quantity,
    })
  res.status(200).end(JSON.stringify({}))
}
