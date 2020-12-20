import admin from 'firebase-admin'

async function getFirebaseAdmin() {
  if (!admin.apps.length) {
    const { FIREBASE_CREDENTIALS_JSON } = process.env
    await admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(FIREBASE_CREDENTIALS_JSON)),
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    })
  }
  return admin
}

export default getFirebaseAdmin
