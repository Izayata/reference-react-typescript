import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function AccountRouteGuard({ isAuthenticated, children }: { isAuthenticated: boolean, children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
    }
  }, [isAuthenticated, navigate])

  return (
    <>
      {children}
    </>
  )
}
