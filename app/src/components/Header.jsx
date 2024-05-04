import React, { useContext, useReducer } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { GoArrowRight } from "react-icons/go"
import AuthContext from '../context/AuthContext'
import axios from 'axios'
import { STUDENT_LOGOUT } from '../api/student'
import toast from 'react-hot-toast'
import { apiReducer, initialState } from '../reducers/apiReducer'

const Header = () => {

    const { authToken, setAuthToken } = useContext(AuthContext)

    const [{ loading, data, error }, dispatch] = useReducer(apiReducer, initialState)

    const navigate = useNavigate()

    const links = [
        {
            title: 'Me',
            route: '/'
        },
        {
            title: 'Tests',
            route: '/tests'
        },
        {
            title: 'History',
            route: '/history'
        },
        {
            title: 'Ask',
            route: '/ask'
        }
    ]

    const logout = async () => {

        dispatch({ type: 'FETCH_START' })

        try {

            await axios.post(STUDENT_LOGOUT, {}, {
                headers: {
                    token: authToken
                }
            })

            dispatch({ type: 'FETCH_SUCCESS' })

            setAuthToken(null)
            sessionStorage.removeItem('AuthToken')
            navigate('/login')
            toast.success('Logged Out')

        } catch (error) {

            toast.error(error?.response?.data?.message || error.message)

            dispatch({ type: 'FETCH_FAIL', payload: error })

        }

    }

    return (
        <div className='flex flex-row justify-between items-center p-2'>
            <span className='text-black font-extrabold text-4xl'>College Test Portal</span>
            <div>
                <ul className='flex gap-10 font-extrabold text-base'>
                    {
                        links?.map((item) => {
                            return <li key={item.title}>
                                <Link to={item.route}>{item.title}</Link>
                            </li>
                        })
                    }
                </ul>
            </div>
            <button className='flex items-center gap-1 text-red-600 font-extrabold' onClick={logout}>
                {
                    loading ? <span>Loading...</span> : <>logout < GoArrowRight /></>
                }
            </button>
        </div>
    )
}

export default Header