import * as React from 'react'
import signIn from '../../utils/auth'
import { useRouter } from 'next/router'

export default function Login() {
  const { replace } = useRouter()
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  async function handleSubmit(event) {
    event.preventDefault()
    try {
      await signIn(email, password)
      replace('/')
    } catch (error) {
      console.error('Failed to sign in', error)
    }
  }
  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email"></label>
      <input
        type="text"
        name="email"
        id="email"
        onChange={(event) => setEmail(event.currentTarget.value)}
      />
      <label htmlFor="password"></label>
      <input
        type="password"
        onChange={(event) => setPassword(event.currentTarget.value)}
      />
      <button type="submit">Login</button>
    </form>
  )
}
