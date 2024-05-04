import React, { useContext, useEffect, useReducer } from 'react'
import { apiReducer, initialState } from '../reducers/apiReducer'
import AuthContext from '../context/AuthContext'
import { ADMIN_INFO } from '../api/admin'
import axios from 'axios'
import toast from 'react-hot-toast'

const AdminWelcome = () => {

    const { authToken } = useContext(AuthContext)

    const [{ loading, error, data }, dispatch] = useReducer(apiReducer, initialState)

    const fetchAdmin = async () => {

        dispatch({ type: 'FETCH_START' })

        try {

            const { data } = await axios.get(ADMIN_INFO,
                {
                    headers: {
                        token: authToken
                    }
                })

            dispatch({ type: 'FETCH_SUCCESS', payload: data[0] })

        } catch (error) {

            toast.error(error?.response?.data?.message || error.message)

            dispatch({ type: 'FETCH_FAIL', payload: error })

        }

    }

    useEffect(() => {

        fetchAdmin()

    }, [])

    return (
        <div className='flex justify-between'>
            <div>
                <span className='text-black text-5xl font-extrabold'>Hi there,</span>
                <span className='text-black text-4xl font-thin'> {data?.name}</span>
            </div>
            <div className='flex flex-col'>
                <span className='text-black font-base'>{data?.email}</span>
                <span className='text-black font-base'>{data?.subject[0]?.subjectCode}</span>
            </div>
        </div>
    )
}

export default AdminWelcome