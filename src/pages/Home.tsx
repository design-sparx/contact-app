import React from 'react'
import { Button } from '@mantine/core'
import { useDispatch, useSelector } from 'react-redux'
import { logoutInitiate } from '../redux/actions'
// import { useNavigate } from 'react-router-dom'

const Home = (): JSX.Element => {
  const { currentUser } = useSelector((state: any) => state.user)
  const dispatch = useDispatch()
  // const navigate = useNavigate()

  const handleAuth = (): void => {
    if (Boolean(currentUser)) {
      dispatch(logoutInitiate() as any)
      // navigate('/login')
    }
  }

  return (
    <div>
      <h1>welcome to our app</h1>
      <Button onClick={handleAuth}>
        logout
      </Button>
    </div>
  )
}

export default Home
