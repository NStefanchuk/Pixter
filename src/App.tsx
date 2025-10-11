import './App.css'
import Authorization from './pages/Authorization'
import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <>
      <Authorization />
      <Toaster position="top-right" />
    </>
  )
}

export default App
