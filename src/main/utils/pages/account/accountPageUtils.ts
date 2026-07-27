export async function fetchAuthenticatedUserDetails() {
  const res = await fetch('/v1/account/me', {
    credentials: 'include'
  })
  if (!res.ok) throw new Error('Felhasználó adatok lekérése sikertelen! Győződjön meg, hogy be van jelentkezve!')
  return res.json()
}
