import React, { useContext, useEffect, useReducer , useState } from 'react'
import Header from '../components/Header'
import axios from 'axios'
import { GET_TESTS, GET_TEST_REPORT } from '../api/test'
import { apiReducer, initialState } from '../reducers/apiReducer'
import AuthContext from '../context/AuthContext'
import { RiLoader4Line, RiDownload2Line } from 'react-icons/ri'
import { Link } from 'react-router-dom'
import exportFromJSON from 'export-from-json'

const Tests = () => {

    const [{ loading, error, data }, dispatch] = useReducer(apiReducer, initialState)
    const { authToken } = useContext(AuthContext)

    const fetchTests = async () => {

        dispatch({ type: 'FETCH_START' })

        try {

            const { data } = await axios.get(GET_TESTS,
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

    const getTestReport = async(testId) => {
        try {
            const { data } = await axios.get(GET_TEST_REPORT + testId,
                {
                    headers: {
                        token: authToken
                    }
                })
            const filename = "test"+testId
            const exportType = exportFromJSON.types.csv
            const formattedData = Array.isArray(data) ? data : [data];
            
            exportFromJSON({ data: formattedData, filename, exportType });
        }
        catch(error){
            console.log(error)
        }
    }


    useEffect(() => {

        fetchTests()

    }, [])

    return (
        <div>
            <Header />
            <div className='m-5 flex flex-col'>
                <div>
                    <span className='font-extrabold text-3xl'>Tests</span>
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
                            data && <table className='bg-white w-full mt-5 text-left'>
                                <thead>
                                    <tr>
                                        <th className='p-2 border-2'>id</th>
                                        <th className='p-2 border-2'>title</th>
                                        <th className='p-2 border-2'>subject</th>
                                        <th className='p-2 border-2'>passkey</th>
                                        <th className='p-2 border-2'>start time</th>
                                        <th className='p-2 border-2'>end time</th>
                                        <th className='p-2 border-2'>created at</th>
                                        <th className='p-2 border-2'>report</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        data.map(item => {
                                            return <tr key={item?._id}>
                                                <td className='p-2 border-2 underline text-blue-900'>
                                                    <Link to={`/tests/${item?._id}`}>
                                                        {item?._id}
                                                    </Link>
                                                </td>
                                                <td className='p-2 border-2'>{item?.title}</td>
                                                <td className='p-2 border-2'>{item?.subject[0]?.subjectCode}</td>
                                                <td className='p-2 border-2'>{item?.passKey}</td>
                                                <td className='p-2 border-2'>{new Date(item?.startTime).toLocaleString()}</td>
                                                <td className='p-2 border-2'>{new Date(item?.endTime).toLocaleString()}</td>
                                                <td className='p-2 border-2'>{new Date(item?.createdAt).toLocaleString()}</td>
                                                <td className='p-2 border-2' onClick={()=>getTestReport(item?._id)}>{<RiDownload2Line />}</td>
                                            </tr>
                                        })
                                    }
                                </tbody>
                            </table>
                }
            </div>
        </div>
    )
}

export default Tests