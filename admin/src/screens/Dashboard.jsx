import React, { useContext, useEffect, useReducer, useState } from 'react';
import Header from '../components/Header'
import { today } from '../utils/dateUtils';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { GET_TESTS, TEST_GET_OVERVIEW } from '../api/test';
import { RiLoader4Line } from 'react-icons/ri';
import AdminWelcome from '../components/AdminWelcome';
import { apiReducer, initialState } from '../reducers/apiReducer';

const Dashboard = () => {

    const [date, setDate] = useState(today())

    const { authToken } = useContext(AuthContext)

    const [{ loading, error, data }, dispatch] = useReducer(apiReducer, initialState)

    const fetchTests = async () => {

        dispatch({ type: 'FETCH_START' })

        try {

            const { data } = await axios.get(GET_TESTS + `?date=${date}`,
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
            <div className='flex flex-col p-10 gap-10'>
                <AdminWelcome />
                <div>
                    <div className='flex justify-between items-center'>
                        <span className='text-black text-2xl font-extrabold'>Recent Activity</span>
                        <input type='date' className='bg-transparent outline-none cursor-pointer font-bold' value={date} onChange={(e) => setDate(e.target.value)} />
                    </div>
                    {
                        loading ? <div className='flex items-center justify-center mt-40'>
                            <RiLoader4Line className='font-extrabold animate-spin' size={25} />
                            <span className='text-black text-2xl'>Loading...</span>
                        </div>
                            :
                            error ? <div className='flex items-center justify-center mt-40'>
                                <span className='font-mono font-bold'>Error: {error?.response?.data?.message || error.message}</span>
                            </div>
                                :
                                <table className='bg-white text-left w-full mt-2'>
                                    <thead>
                                        <tr>
                                            <th className='p-2 border-2'>#</th>
                                            <th className='p-2 border-2'>Title</th>
                                            <th className='p-2 border-2'>Passkey</th>
                                            <th className='p-2 border-2'>Subject</th>
                                            <th className='p-2 border-2'>Start Time</th>
                                            <th className='p-2 border-2'>End Time</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            data?.map(test => {
                                                return <tr key={test._id}>
                                                    <td className='p-2 border-2'>{test._id}</td>
                                                    <td className='p-2 border-2'>{test.title}</td>
                                                    <td className='p-2 font-bold border-2'>{test.passKey}</td>
                                                    <td className='p-2 border-2'>{test.subject[0].subjectCode}</td>
                                                    <td className='p-2 border-2'>{new Date(test.startTime).toLocaleString()}</td>
                                                    <td className='p-2 border-2'>{new Date(test.endTime).toLocaleString()}</td>
                                                </tr>
                                            })
                                        }
                                    </tbody>
                                </table>


                    }
                </div>
            </div>
        </>
    )
}

export default Dashboard