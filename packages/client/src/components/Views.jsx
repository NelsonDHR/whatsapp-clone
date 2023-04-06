import { Routes, Route } from 'react-router-dom'
import LogIn from './access/LogIn'
import SignUp from './access/SignUp'

const Views = () => {
  return (
    <Routes>
      <Route path="/" element={<LogIn />} />
      <Route path="*" element={<LogIn />} />
      <Route path="/log-in" element={<LogIn />} />
      <Route path="/sign-up" element={<SignUp />} />
    </Routes>
  )
}

export default Views