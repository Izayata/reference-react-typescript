import { Login } from '../../components/page/Login/Login'

export function LoginPage(
  { onLogin } : { onLogin: () => void }
) {
  return (
    <Login onLogin={onLogin} />
  )
}
