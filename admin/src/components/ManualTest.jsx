import React, { useContext, useEffect, useReducer, useState } from 'react'
import { apiReducer, initialState } from '../reducers/apiReducer'
import AuthContext from '../context/AuthContext'
import { RiLoader4Line } from 'react-icons/ri'
import { GET_QUESTIONS } from '../api/questionBank'
import axios from 'axios'
import { CREATE_TEST_MANUAL } from '../api/test'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const ManualTest = () => {

    const [selectedQs, setSelectedQs] = useState([])

    const handleQSelection = (id) => {
        if (selectedQs.includes(id)) {
            setSelectedQs(selectedQs.filter(itemId => itemId !== id));
        }
        else {
            setSelectedQs(selectedQs => [...selectedQs, id])
        }
    }

    const [questions, questionDispatch] = useReducer(apiReducer, initialState)
    const [test, testDispatch] = useReducer(apiReducer, initialState)

    const { authToken } = useContext(AuthContext)

    const navigate = useNavigate()

    const fetchQuestions = async () => {

        questionDispatch({ type: 'FETCH_START' })

        try {

            const { data } = await axios.post(GET_QUESTIONS,
                {
                    //...filter
                },
                {
                    headers: {
                        token: authToken
                    }
                })

            questionDispatch({ type: 'FETCH_SUCCESS', payload: data })

        } catch (error) {

            questionDispatch({ type: 'FETCH_FAIL', payload: error })

        }
    }

    const createTestManual = async (e) => {

        e.preventDefault()

        const response = window.confirm('Are you sure you want to create test?')

        if (!response) return

        testDispatch({ type: 'FETCH_START' })

        try {

            const { data } = await axios.post(CREATE_TEST_MANUAL,
                {
                    title: e.target.title.value,
                    startTime: e.target.startTime.value,
                    endTime: e.target.endTime.value,
                    questionIds: selectedQs
                },
                {
                    headers: {
                        token: authToken
                    }
                })

            testDispatch({ type: 'FETCH_SUCCESS', payload: data })

            toast.success('Test Published')

            navigate('/')

        } catch (error) {

            toast.error(error?.response?.data?.message || error.message)

            testDispatch({ type: 'FETCH_FAIL', payload: error })

        }
    }

    useEffect(() => {

        fetchQuestions()

    }, [])

    const dificulttyMap = {
        1: 'Easy',
        2: 'Medium',
        3: 'Hard'
    }

    return (
        <div>
            <div className='flex flex-col gap-5'>
                <span className='font-extrabold text-3xl'>Create Test Manual</span>
                <form className='flex justify-between font-bold' onSubmit={createTestManual}>
                    <div>
                        <label>Title: </label>
                        <input type='text' className='border-2 outline-none' name='title' required />
                    </div>
                    <div>
                        <label>Start Time: </label>
                        <input type='datetime-local' className='border-2 outline-none' name='startTime' required />
                    </div>
                    <div>
                        <label>End Time: </label>
                        <input type='datetime-local' className='border-2 outline-none' name='endTime' required />
                    </div>
                    <div>
                        <label>Questions: </label>
                        <span>{selectedQs.length}</span>
                    </div>
                    <button className='bg-blue-900 p-1 text-white rounded-md'>
                        {
                            test.loading ?
                                <RiLoader4Line className='font-extrabold animate-spin' size={25} />
                                :
                                <span>Publish</span>
                        }
                    </button>
                </form>
            </div>
            <div className='flex justify-center'>
                {
                    questions.loading ? <div className='flex items-center justify-center mt-40'>
                        <RiLoader4Line className='font-extrabold animate-spin' size={25} />
                        <span className='text-black text-2xl'>Loading...</span>
                    </div>
                        :
                        questions.error ? <div className='flex items-center justify-center mt-40'>
                            <span className='font-mono font-bold'>Error: {questions.error?.response?.data?.message || questions.error.message}</span>
                        </div>
                            :
                            questions.data && <table className='bg-white w-full mt-5 text-left'>
                                <tbody>
                                    <tr>
                                        <th className='p-2 border-2'>Subject</th>
                                        <th className='p-2 border-2'>Module</th>
                                        <th className='p-2 border-2'>Question</th>
                                        <th className='p-2 border-2'>Options</th>
                                        <th className='p-2 border-2'>Value</th>
                                        <th className='p-2 border-2'>Difficulty</th>
                                    </tr>
                                    {
                                        questions.data?.map((item) => (
                                            <tr key={item._id}
                                                onClick={() => handleQSelection(item._id)}
                                                className={`${selectedQs.includes(item._id) ? 'bg-blue-100 border-blue-500' : 'bg-white border-black'}`}>
                                                <td className='p-2 border-2'>{item.subject[0].subjectCode}</td>
                                                <td className='p-2 border-2'>{item.module}</td>
                                                <td className='p-2 border-2'>{item.question}</td>
                                                <td className='p-2 border-2'>
                                                    {
                                                        item.options.map((option, index) => {
                                                            return <div key={index}>
                                                                <span>{index + 1}. {option}</span>
                                                            </div>
                                                        })
                                                    }
                                                </td>
                                                <td className='p-2 border-2'>{item.value}</td>
                                                <td className='p-2 border-2'>{dificulttyMap[item.level]}</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                }
            </div>
        </div>
    )
}

export default ManualTest