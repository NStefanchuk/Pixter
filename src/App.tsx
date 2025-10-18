import './App.css'
import { Routes, Route, useLocation } from 'react-router-dom'
import Authorization from './pages/Authorization'
import { Toaster } from 'react-hot-toast'
import Profile from './pages/Profile'
import Main from './pages/Main'
import Header from './components/Header'
import Welcome from './pages/Welcome'

function App() {
  const location = useLocation()
  const hideHeader = location.pathname === '/' || location.pathname === '/auth'
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
