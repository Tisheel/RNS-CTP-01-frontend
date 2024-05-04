import React, { useContext } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Dashboard from './screens/Dashboard'
import Login from './screens/Login'
import { Toaster } from 'react-hot-toast'
import AuthContext from './context/AuthContext'
import QuestionBank from './screens/QuestionBank'
import CreateTest from './screens/CreateTest'
import Modal from './components/Modal'
import ManualTest from './components/ManualTest'
import Tests from './screens/Tests'
import DetailedTest from './screens/DetailedTest'

const App = () => {

  const { authToken } = useContext(AuthContext)

  return (
    <>
      <Routes>
        <Route path='/login' element={!authToken ? <Login /> : <Navigate to='/' />} />
        <Route path='/' element={authToken ? <Dashboard /> : <Navigate to='/login' />} />
        <Route path='/question-bank' element={authToken ? <QuestionBank /> : <Navigate to='/login' />} />
        <Route path='/create-test' element={authToken ? <CreateTest /> : <Navigate to='/login' />}>
          <Route index element={<ManualTest />} />
        </Route>
        <Route path='/tests' element={authToken ? <Tests /> : <Navigate to='/login' />} />
        <Route path='/tests/:id' element={authToken ? <DetailedTest /> : <Navigate to='/login' />} />
        <Route path='/question-bank/:id' element={authToken ? <QuestionBank /> : <Navigate to='/login' />} />
      </Routes>
      <Toaster position='bottom-center' />
      <Modal />
    </>
  )
}

export default App