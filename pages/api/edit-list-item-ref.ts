import getDb from '../../firebase/db'

export default async function editListItemRef(req, res) {
  if (req.method !== 'PUT') {
    res.status(404).send('Unrecognised endpoint')
    return
  }
  const { listId, listItemId, itemId } = req.body
  const db = await getDb()
  await db
    .collection('lists')
    .doc(listId)
    .update({
      [`listItemsMap.${listItemId}.itemId`]: itemId,
    })
  res.status(200).end(JSON.stringify({}))
}
