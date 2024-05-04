import React, { useContext, useReducer, useState } from 'react'
import logo from '../assets/rnsit_logo.svg'
import { Link, useNavigate } from 'react-router-dom'
import { STUDENT_LOGIN } from '../api/student'
import toast from 'react-hot-toast'
import AuthContext from '../context/AuthContext'
import { RiLoader4Line } from "react-icons/ri"
import axios from 'axios'
import { apiReducer, initialState } from '../reducers/apiReducer'

const Login = () => {

    const navigate = useNavigate()

    const { setAuthToken } = useContext(AuthContext)

    const [usn, setUsn] = useState('')
    const [password, setPassword] = useState('')

    const [{ loading, data, error }, dispatch] = useReducer(apiReducer, initialState)

    const loginStudent = async () => {

        dispatch({ type: 'FETCH_START' })

        try {

            const { data } = await axios.post(STUDENT_LOGIN, {
                usn,
                password
            })

            dispatch({ type: 'FETCH_SUCCESS' })

            setAuthToken(data?.token)
            sessionStorage.setItem('AuthToken', data?.token)
            toast.success('Logged in successfully.')

            const testToken = localStorage.getItem('testToken')
            const test = JSON.parse(localStorage.getItem('test'))
            const questions = JSON.parse(localStorage.getItem('questions'))

            const currTime = new Date().getTime()

            if (testToken && test && questions && new Date(test?.startTime).getTime() <= currTime && new Date(test?.endTime).getTime() >= currTime) {
                navigate('/tests/' + test?._id)
            } else {
                localStorage.removeItem('testToken')
                localStorage.removeItem('test')
                localStorage.removeItem('questions')

                navigate('/')
            }

        } catch (error) {

            toast.error(error?.response?.data?.message || error.message)

            dispatch({ type: 'FETCH_FAIL', payload: error })

        }

    }

    const handleLogin = async (e) => {
        e.preventDefault()
        await loginStudent()
    }

    return (
        <div className='p-2'>
            <span className='text-black font-extrabold text-4xl'>College Test Portal</span>
            <div className='flex flex-col justify-center items-center mt-24'>
                <div className='bg-white shadow rounded-xl flex flex-col p-5 gap-10'>
                    <div className='flex items-center font-extrabold text-xl text-black'>
                        <img src={logo} alt='rnsit' className='w-32' />
                        <span>Login</span>
                    </div>
                    <form className='flex flex-col justify-center items-center font-extrabold min-w-80 gap-5' onSubmit={handleLogin}>
                        <input className='w-full bg-slate-50 outline-none p-2 rounded-lg border border-slate-500' type='text' placeholder='1RN22CS170' value={usn} onChange={(e) => setUsn(e.target.value.toUpperCase())} required />
                        <input className='w-full bg-slate-50 outline-none p-2 rounded-lg border border-slate-500' type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} required />
                        <button className='bg-blue-900 text-white shadow w-full py-2 rounded-lg border border-slate-500 flex items-center justify-center' >
                            {
                                loading ?
                                    <RiLoader4Line className='font-extrabold animate-spin' size={25} />
                                    :
                                    <span>Login</span>
                            }
                        </button>
                    </form>
                    <Link id='forgot_password' to='/forgot-password'>forgot password?</Link>
                </div>
            </div>
        </div>
    )
}

export default Login