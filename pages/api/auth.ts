import { serialize } from 'cookie'
import getFirebaseAdmin from '../../firebase/admin'

export default async function auth(req, res) {
  const admin = await getFirebaseAdmin()
  // Expire in 5 days
  const expiresIn = 60 * 60 * 24 * 5 * 1000
  if (req.method === 'POST') {
    var idToken = req.body.token

    try {
      const cookie = await admin
        .auth()
        .createSessionCookie(idToken, { expiresIn })

      if (cookie == null) {
        res.status(401).send('Invalid authentication')
        return
      }

      const options = {
        maxAge: expiresIn,
        httpOnly: true,
        secure: process.env.NEXT_PUBLIC_SECURE_COOKIE === 'true',
        path: '/',
      }
      res.setHeader('Set-Cookie', serialize('user', cookie, options))
      res
        .status(200)
        .end(JSON.stringify({ response: 'Successfully logged in' }))
    } catch (error) {
      console.error('Failed to log in', error)
      res.status(401).send('Login failed')
    }
  }
}
