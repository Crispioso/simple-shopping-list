import getDb from '../../firebase/db'
export default async function addItemToList(req, res) {
  if (req.method !== 'PUT') {
    res.status(404).send('Unrecognised endpoint')
    return
  }
  console.log(req.body)
  const { listId, item } = req.body
  const db = await getDb()
  await db
    .collection('lists')
    .doc(listId)
    .update({
      [`listItemsMap.${item.id}`]: {
        itemId: item.itemId,
        completed: item.completed,
        quantity: item.quantity,
        addedOn: new Date(),
      },
    })

  res.status(200).end(JSON.stringify({}))
}
