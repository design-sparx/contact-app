import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Navigate, RouteProps, useLocation } from 'react-router-dom'
import LoadingToRedirect from './LoadingToRedirect'

interface ProtectedRoutesProps extends RouteProps {
  children?: React.ReactNode
}

const ProtectedRoutes = ({ children }: ProtectedRoutesProps): any => {
  const { currentUser } = useSelector((state: any) => state.user)
  const { pathname } = useLocation()
  const [requestedLocation, setRequestedLocation] = useState<string | null>(null)
  if (!Boolean(currentUser)) {
    if (pathname !== requestedLocation) {
      setRequestedLocation(pathname)
    }

    return <LoadingToRedirect/>
  }

  if ((requestedLocation != null) && pathname !== requestedLocation) {
    setRequestedLocation(null)
    return <Navigate to={requestedLocation}/>
  }

  return <>{children}</>
}

export default ProtectedRoutes
