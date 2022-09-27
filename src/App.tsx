import React, { useEffect } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { MantineProvider } from '@mantine/core'
import { AboutPage, AddEditPage, HomePage, LoginPage, RegisterPage } from './pages'
import ProtectedRoutes from './components/ProtectedRoutes'
import { useDispatch } from 'react-redux'
import { auth } from './firebase'
import { setUser } from './redux/actions'
import AppHeader from './components/AppHeader'
import { AppHeaderLinks } from './mocks/AppHeaderLinks'

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
        <AppHeader links={AppHeaderLinks.links}/>
        <Routes>
          <Route path="/" element={<ProtectedRoutes><HomePage/></ProtectedRoutes>}/>
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/register" element={<RegisterPage/>}/>
          <Route path="/addContact" element={<ProtectedRoutes><AddEditPage/></ProtectedRoutes>}/>
          <Route path="/about" element={<AboutPage/>}/>
        </Routes>
      </MantineProvider>
    </BrowserRouter>
  )
}

export default App
