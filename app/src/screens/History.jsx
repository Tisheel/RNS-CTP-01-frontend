import React, { useContext, useEffect, useReducer, useState } from 'react'
import Header from '../components/Header'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { ANSWERS_GET } from '../api/test'
import AuthContext from '../context/AuthContext'
import { RiLoader4Line } from "react-icons/ri"
import { apiReducer, initialState } from '../reducers/apiReducer'

const History = () => {

    const { authToken } = useContext(AuthContext)

    const [{ loading, data, error }, dispatch] = useReducer(apiReducer, initialState)

    const fetchAnswers = async () => {

        dispatch({ type: 'FETCH_START' })

        try {

            const { data } = await axios.post(ANSWERS_GET,
                {
                    // filters
                },
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

        fetchAnswers()

    }, [])

    return (
        <>
            <Header />
            <div className='p-10'>
                <div className='flex justify-between items-center'>
                    <span className='text-black font-extrabold text-3xl'>#Attempted Test's</span>
                    <input className='outline-none shadow rounded-lg p-2 w-80' type='text' placeholder='search' />
                </div>
                {
                    loading && <div className='flex items-center justify-center mt-40'>
                        <RiLoader4Line className='font-extrabold animate-spin' size={25} />
                        <span className='text-black text-2xl'>Loading...</span>
                    </div>
                }
                {
                    data && <div className='flex justify-center'>
                        <table className='text-left bg-white mt-5 w-full'>
                            <tbody>
                                <tr>
                                    <th className='p-2 border-2'>
                                        #
                                    </th>
                                    <th className='p-2 border-2'>
                                        Professor
                                    </th>
                                    <th className='p-2 border-2'>
                                        Title
                                    </th>
                                    <th className='p-2 border-2'>
                                        Subject
                                    </th>
                                    <th className='p-2 border-2'>
                                        Marks Scored
                                    </th>
                                    <th className='p-2 border-2'>
                                        Total Marks
                                    </th>
                                    <th className='p-2 border-2'>
                                        Percentile
                                    </th>
                                </tr>
                                {
                                    data?.map(answer => {
                                        return <tr key={answer?._id}>
                                            <td className='p-2 border-2 underline hover:text-blue-600'>
                                                <Link to={`/history/${answer?._id}`}>{answer?._id}</Link>
                                            </td>
                                            <td className='p-2 border-2'>
                                                {answer?.test[0]?.professor[0]?.email}
                                            </td>
                                            <td className='p-2 border-2'>
                                                {answer.test[0]?.title}
                                            </td>
                                            <td className='p-2 border-2'>
                                                {answer?.test[0]?.subject[0]?.subjectCode}
                                            </td>
                                            <td className='p-2 border-2'>
                                                {answer?.result?.score}
                                            </td>
                                            <td className='p-2 border-2'>
                                                {answer?.result?.maxMarks}
                                            </td>
                                            <td className='p-2 border-2'>
                                                {(answer?.result?.score / answer?.result?.maxMarks) * 100}%
                                            </td>
                                        </tr>
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                }
                {
                    error && <div className='flex items-center justify-center mt-40'>
                        <span className='font-mono font-bold'>Error: {error?.response?.data?.message}</span>
                    </div>
                }
            </div>
        </>
    )
}

export default History