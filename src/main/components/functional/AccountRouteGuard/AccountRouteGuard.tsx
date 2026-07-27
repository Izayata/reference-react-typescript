import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export function AccountRouteGuard({ isAuthenticated, children }: { isAuthenticated: boolean, children: React.ReactNode }) {
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
    }
  }, [isAuthenticated, navigate])

  if (!isAuthenticated) {
    return null
  }

  return (
    <>
      {children}
    </>
  )
}
