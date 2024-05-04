import React, { useContext, useEffect, useReducer, useState } from 'react'
import TestCard from '../components/TestCard'
import Header from '../components/Header'
import AuthContext from '../context/AuthContext'
import { TEST_GET } from '../api/test'
import { RiLoader4Line } from "react-icons/ri"
import axios from 'axios'
import { apiReducer, initialState } from '../reducers/apiReducer'
import { today } from '../utils/dateUtils'

const Tests = () => {

    const { authToken } = useContext(AuthContext)

    const [{ loading, error, data }, dispatch] = useReducer(apiReducer, initialState)

    const [date, setDate] = useState(today())

    const fetchTests = async () => {

        dispatch({ type: 'FETCH_START' })

        try {

            const { data } = await axios.get(TEST_GET + `?date=${date}`,
                {
                    headers: {
                        token: authToken
                    }
                })

            dispatch({ type: 'FETCH_SUCCESS', payload: data })

        } catch (error) {

            dispatch({ type: 'FETCH_FAIL', payload: error })

        }

    }

    useEffect(() => {

        fetchTests()

    }, [date])

    return (
        <>
            <Header />
            <div className='p-10'>
                <div className='flex justify-between items-center'>
                    <span className='text-black font-extrabold text-3xl'>#Tests</span>
                    <input type='date' className='bg-transparent outline-none cursor-pointer font-bold' value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
                <div>
                    {
                        loading ?
                            <div className='flex items-center justify-center mt-40'>
                                <RiLoader4Line className='font-extrabold animate-spin' size={25} />
                                <span className='text-black text-2xl'>Loading...</span>
                            </div>
                            :
                            error ?
                                <div className='flex items-center justify-center mt-40'>
                                    <span className='font-mono font-bold'>Error: {error?.response?.data?.message || error.message}</span>
                                </div>
                                :
                                <div className='flex flex-wrap'>
                                    {
                                        data?.map(test => {
                                            return <TestCard test={test} key={test?._id} />
                                        })
                                    }
                                </div>

                    }
                </div>
            </div>
        </>
    )
}

export default Tests