import { parseCookies } from 'nookies'
import verifyCookie from './verifyCookie'

function serverSideRedirect({ res }) {
  if (res == null) {
    return
  }
  res.writeHead(302, { Location: '/login' })
  res.end()
}

export default async function checkAuth(context): Promise<boolean> {
  const cookies = parseCookies(context)
  if (cookies.user == null) {
    serverSideRedirect(context)
    return false
  }

  const authentication = await verifyCookie(cookies.user)
  if (!authentication.authenticated) {
    serverSideRedirect(context)
    return false
  }
  return true
}
