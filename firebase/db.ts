import getFirebaseAdmin from './admin'

let db

async function getDb() {
  if (db != null) {
    return db
  }
  const admin = await getFirebaseAdmin()
  db = admin.firestore()
  return db
}

export default getDb
