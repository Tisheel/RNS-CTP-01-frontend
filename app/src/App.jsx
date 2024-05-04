import React, { useContext } from 'react'
import Login from './screens/Login'
import { Route, Routes, Navigate } from 'react-router-dom'
import Tests from './screens/Tests'
import Test from './screens/Test'
import Me from './screens/Me'
import History from './screens/History'
import ReviewTest from './screens/ReviewTest'
import { Toaster } from 'react-hot-toast'
import AuthContext from './context/AuthContext'
import Ask from './screens/Ask'
import Modal from './components/Modal'


const App = () => {

  const { authToken } = useContext(AuthContext)

  return (
    <>
      <Routes>
        <Route path='/' element={authToken ? <Me /> : <Navigate to='/login' />} />
        <Route path='/tests' element={authToken ? <Tests /> : <Navigate to='/login' />} />
        <Route path='/tests/:id' element={authToken ? <Test /> : <Navigate to='/login' />} />
        <Route path='/history' element={authToken ? <History /> : <Navigate to='/login' />} />
        <Route path='/history/:id' element={authToken ? <ReviewTest /> : <Navigate to='/login' />} />
        <Route path='/ask' element={authToken ? <Ask /> : <Navigate to='/login' />} />
        <Route path='/login' element={<Login />} />
      </Routes>
      <Toaster position='bottom-center' />
      <Modal />
    </>
  )
}

export default App