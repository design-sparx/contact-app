import React, { useEffect } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { MantineProvider } from '@mantine/core'
import { HomePage, LoginPage, RegisterPage } from './pages'
import ProtectedRoutes from './components/ProtectedRoutes'
import { useDispatch } from 'react-redux'
import { auth } from './firebase'
import { setUser } from './redux/actions'

const App = (): JSX.Element => {
  const dispatch = useDispatch()

  useEffect(() => {
    auth.onAuthStateChanged(authUser => {
      if (authUser != null) {
        dispatch(setUser(authUser))
      } else {
        dispatch(setUser(null))
      }
    })
  }, [dispatch])

  return (
    <BrowserRouter>
      <MantineProvider withNormalizeCSS withGlobalStyles>
        <Routes>
          <Route path="/" element={<ProtectedRoutes><HomePage/></ProtectedRoutes>}/>
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/register" element={<RegisterPage/>}/>
        </Routes>
      </MantineProvider>
    </BrowserRouter>
  )
}

export default App
