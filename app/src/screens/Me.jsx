import React, { useContext, useEffect, useReducer } from 'react'
import Header from '../components/Header'
import { STUDENT_INFO } from '../api/student'
import AuthContext from '../context/AuthContext'
import { RiLoader4Line } from "react-icons/ri"
import axios from 'axios'
import { apiReducer, initialState } from '../reducers/apiReducer'

const Dashboard = () => {

    const { authToken } = useContext(AuthContext)

    const [{ loading, data, error }, dispatch] = useReducer(apiReducer, initialState)

    const fetchStudent = async () => {

        dispatch({ type: 'FETCH_START' })

        try {

            const { data } = await axios.get(STUDENT_INFO, {
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

        fetchStudent()

    }, [])

    return (
        <>
            <Header />
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
                        <div className='flex flex-col p-10 gap-10'>
                            <div className='flex flex-col'>
                                <span className='text-black text-5xl font-extrabold'>Hi there,</span>
                                <span className='text-black text-2xl font-extrabold'>{data?.name}</span>
                            </div>
                            <div className='flex gap-10'>
                                <table className='bg-white text-left shadow rounded-lg'>
                                    <tbody>
                                        <tr>
                                            <th className='p-2'>USN</th>
                                            <td className='p-2'>{data?.usn}</td>
                                        </tr>
                                        <tr>
                                            <th className='p-2'>Email</th>
                                            <td className='p-2'>{data?.email}</td>
                                        </tr>
                                        <tr>
                                            <th className='p-2'>Phone</th>
                                            <td className='p-2'>{data?.phone}</td>
                                        </tr>
                                        <tr>
                                            <th className='p-2'>Branch</th>
                                            <td className='p-2'>{data?.branch}</td>
                                        </tr>
                                        <tr>
                                            <th className='p-2'>Semister</th>
                                            <td className='p-2'>{data?.sem}</td>
                                        </tr>
                                        <tr>
                                            <th className='p-2'>Section</th>
                                            <td className='p-2'>{data?.section}</td>
                                        </tr>
                                        <tr>
                                            <th className='p-2'>Subjects</th>
                                            <td className='p-2'>
                                                <table>
                                                    <tbody>
                                                        {
                                                            data?.subjects?.map((subject, index) => {
                                                                return <tr key={index}>
                                                                    <td className='py-1'>{subject?.subjectCode}</td>
                                                                </tr>
                                                            })
                                                        }
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div id='me_details_graph'>
                                    <span># Recent activity</span>
                                </div>
                            </div>
                        </div>
            }
        </>
    )
}

export default Dashboard