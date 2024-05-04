import React, { useContext, useEffect, useReducer } from 'react'
import Header from '../components/Header'
import axios from 'axios'
import { GET_DETAILED_TEST, GET_TESTS } from '../api/test'
import { apiReducer, initialState } from '../reducers/apiReducer'
import AuthContext from '../context/AuthContext'
import { RiLoader4Line } from 'react-icons/ri'
import { useParams } from 'react-router-dom'
import QuestionCard from '../components/QuestionCard'

const DetailedTest = () => {

    const [{ loading, error, data }, dispatch] = useReducer(apiReducer, initialState)
    const { authToken } = useContext(AuthContext)

    const { id } = useParams()

    const fetchTest = async () => {

        dispatch({ type: 'FETCH_START' })

        try {

            const { data } = await axios.get(GET_DETAILED_TEST + `/${id}`,
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

        fetchTest()

    }, [])

    return (
        <div>
            <Header />
            <div className='p-5'>
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
                            data && <div className='flex flex-col gap-5'>
                                <table className='bg-white w-full mt-5 text-left'>
                                    <thead>
                                        <tr>
                                            <th className='p-2 border-2'>id</th>
                                            <th className='p-2 border-2'>title</th>
                                            <th className='p-2 border-2'>professor</th>
                                            <th className='p-2 border-2'>subject</th>
                                            <th className='p-2 border-2'>passkey</th>
                                            <th className='p-2 border-2'>start time</th>
                                            <th className='p-2 border-2'>end time</th>
                                            <th className='p-2 border-2'>created at</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className='p-2 border-2'>
                                                {data?._id}
                                            </td>
                                            <td className='p-2 border-2'>{data?.title}</td>
                                            <td className='p-2 border-2'>{data?.professor[0]?.name}</td>
                                            <td className='p-2 border-2'>{data?.subject[0]?.subjectCode}</td>
                                            <td className='p-2 border-2'>{data?.passKey}</td>
                                            <td className='p-2 border-2'>{new Date(data?.startTime).toLocaleString()}</td>
                                            <td className='p-2 border-2'>{new Date(data?.endTime).toLocaleString()}</td>
                                            <td className='p-2 border-2'>{new Date(data?.createdAt).toLocaleString()}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div>
                                    {
                                        data?.questions?.map(question => {
                                            return <div className='flex justify-between bg-white border p-5' key={question?._id}>
                                                <div>
                                                    <div className='font-bold'>
                                                        <p>
                                                            #{question?._id}
                                                        </p>
                                                        <p>
                                                            {question?.question}
                                                        </p>
                                                    </div>
                                                    <ol className='my-5'>
                                                        {
                                                            question?.options.map((option, index) => {
                                                                return <li key={index}>
                                                                    <div className='flex gap-2'>
                                                                        <span>{index + 1}.</span>
                                                                        <p>{option}</p>
                                                                    </div>
                                                                </li>
                                                            })
                                                        }
                                                    </ol>
                                                </div>
                                                <div>
                                                    <table className='text-left'>
                                                        <tbody>

                                                            <tr>
                                                                <th className='p-1'>
                                                                    Module:
                                                                </th>
                                                                <td className='p-1'>
                                                                    {
                                                                        <span>{question?.module}</span>
                                                                    }
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <th className='p-1'>
                                                                    level:
                                                                </th>
                                                                <td className='p-1'>
                                                                    {
                                                                        <span>{question?.level}</span>
                                                                    }
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <th className='p-1'>
                                                                    Marks Alloted:
                                                                </th>
                                                                <td className='p-1'>
                                                                    {question?.value}
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        })
                                    }
                                </div>
                            </div>
                }
            </div>
        </div >
    )
}

export default DetailedTest