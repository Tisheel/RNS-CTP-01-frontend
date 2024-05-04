import React, { useContext, useEffect, useReducer } from 'react'
import Headrer from '../components/Header'
import ReviewQuestion from '../components/ReviewQuestion'
import AuthContext from '../context/AuthContext'
import { ANSWER_GET_DETAIL } from '../api/test'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { RiLoader4Line } from 'react-icons/ri'
import { apiReducer, initialState } from '../reducers/apiReducer'

const Answer = () => {

    const { authToken } = useContext(AuthContext)

    const { id } = useParams()

    const [{ loading, data, error }, dispatch] = useReducer(apiReducer, initialState)

    const fetchAnswer = async () => {

        dispatch({ type: 'FETCH_START' })

        try {

            const { data } = await axios.post(ANSWER_GET_DETAIL + '/' + id,
                {
                    // filters
                },
                {
                    headers: {
                        token: authToken
                    }
                })

            dispatch({ type: 'FETCH_SUCCESS', payload: data[0] })

        } catch (error) {

            dispatch({ type: 'FETCH_FAIL', payload: error })

        }

    }

    useEffect(() => {

        fetchAnswer()

    }, [])

    return (
        <div>
            <Headrer />
            <div className='p-10'>
                {
                    loading && <div className='flex items-center justify-center mt-40'>
                        <RiLoader4Line className='font-extrabold animate-spin' size={25} />
                        <span className='text-black text-2xl'>Loading...</span>
                    </div>
                }
                {
                    data && <div className='flex flex-col gap-5'>
                        <table className='bg-white rounded-md p-5 text-left w-full'>
                            <thead>
                                <tr>
                                    <th className='p-2 border-2'>Test</th>
                                    <th className='p-2 border-2'>Professor</th>
                                    <th className='p-2 border-2'>Subject</th>
                                    <th className='p-2 border-2'>Result</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className='p-2 border-2'>
                                        <table>
                                            <tbody>
                                                <tr>
                                                    <th className='p-2'>Title</th>
                                                    <td className='p-2'>{data?.test[0]?.title}</td>
                                                </tr>
                                                <tr>
                                                    <th className='p-2'>Scheduled At</th>
                                                    <td className='p-2'>{new Date(data?.test[0]?.startTime).toLocaleString()}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                    <td className='p-2 border-2'>
                                        <table>
                                            <tbody>
                                                <tr>
                                                    <td className='p-2'>{data?.test[0]?.professor[0]?.name}</td>
                                                </tr>
                                                <tr>
                                                    <td className='p-2'>{data?.test[0]?.professor[0]?.email}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                    <td className='p-2 border-2'>
                                        <table>
                                            <tbody>
                                                <tr>
                                                    <td className='p-2'>{data?.test[0]?.subject[0]?.subjectName}</td>
                                                </tr>
                                                <tr>
                                                    <td className='p-2'>{data?.test[0]?.subject[0]?.subjectCode}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                    <td className='p-2 border-2'>
                                        <table>
                                            <tbody>
                                                <tr>
                                                    <th>Score</th>
                                                    <td className='p-2'>{data?.result?.score}</td>
                                                </tr>
                                                <tr>
                                                    <th>Max Score</th>
                                                    <td className='p-2'>{data?.result?.maxMarks}</td>
                                                </tr>
                                                <tr>
                                                    <th>Percentile</th>
                                                    <td className='p-2'>{(data?.result?.score / data?.result?.maxMarks) * 100}%</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div className='bg-white rounded-md'>
                            {
                                data?.questions?.map((question, index) => {
                                    return <ReviewQuestion question={question} questionIndex={index} key={question?._id} />
                                })
                            }
                        </div>
                    </div>
                }
                {
                    error && <div className='flex items-center justify-center mt-40'>
                        <span className='font-mono font-bold'>Error: {error?.response?.data?.message || error.message}</span>
                    </div>
                }
            </div>
        </div>
    )
}

export default Answer