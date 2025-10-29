import './App.css'
import { Routes, Route, useLocation } from 'react-router-dom'
import Authorization from './pages/Authorization.mui'
import { Toaster } from 'react-hot-toast'
import Profile from './pages/Profile.mui'
import Main from './pages/Main.mui'
import Header from './components/Header.mui'
import Welcome from './pages/Welcome.mui'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { fetchUserData } from './slices/user/userApi'

function App() {
  const location = useLocation()
  const hideHeader = location.pathname === '/' || location.pathname === '/auth'
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchUserData() as any)
  }, [])

  return (
    <>
      {!hideHeader && <Header />}
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/feed" element={<Main />} />
        <Route path="/auth" element={<Authorization />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <Toaster position="top-right" />
    </>
  )
}

export default App
