import './App.css'
import { Routes, Route } from 'react-router-dom'
import Authorization from './pages/Authorization'
import { Toaster } from 'react-hot-toast'
import Profile from './pages/Profile'
import Main from './pages/Main'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/auth" element={<Authorization />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <Toaster position="top-right" />
    </>
  )
}

export default App
