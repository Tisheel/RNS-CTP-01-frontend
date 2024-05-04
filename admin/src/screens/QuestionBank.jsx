import React, { useContext, useReducer } from 'react'
import { useEffect } from 'react'
import Header from '../components/Header'
import axios from 'axios'
import { GET_QUESTIONS } from '../api/questionBank'
import { apiReducer, initialState } from '../reducers/apiReducer'
import { RiLoader4Line } from 'react-icons/ri'
import AuthContext from '../context/AuthContext'
import ModalContext from '../context/ModalContext'
import CreateQuestion from '../components/CreateQuestion'
import QuestionCard from '../components/QuestionCard'

const QuestionBank = () => {

    const [{ loading, error, data }, dispatch] = useReducer(apiReducer, initialState)

    const { authToken } = useContext(AuthContext)
    const { open } = useContext(ModalContext)

    const fetchQuestions = async () => {

        dispatch({ type: 'FETCH_START' })

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

            dispatch({ type: 'FETCH_SUCCESS', payload: data })

        } catch (error) {

            dispatch({ type: 'FETCH_FAIL', payload: error })

        }
    }


    useEffect(() => {

        fetchQuestions()

    }, [])

    return (
        <>
            <Header />
            <div className='p-5'>
                <div className='flex flex-col gap-5'>
                    <div className='flex justify-between items-center'>
                        <span className='text-black font-extrabold text-3xl'>Question Bank</span>
                        <div className='flex text-center p-5'>
                            Subject -
                            <select>
                                <option selected>~Select~</option>
                                <option>DSA</option>
                                <option>CSE</option>
                            </select>
                        </div>
                        <div className='flex text-center p-5'>
                            Module -
                            <select>
                                <option selected>~Select~</option>
                                <option>1</option>
                                <option>2</option>
                            </select>
                        </div>
                        <div className='flex text-center p-5'>
                            Value -
                            <select>
                                <option selected>~Select~</option>
                                <option>1</option>
                                <option>2</option>
                            </select>
                        </div>
                        <div className='flex text-center p-5'>
                            Difficulty -
                            <select>
                                <option selected>~Select~</option>
                                <option>1</option>
                                <option>2</option>
                            </select>
                        </div>
                        <button className='bg-blue-900 text-white p-1 rounded-md' onClick={() => open(<CreateQuestion />)}>Add Question</button>
                    </div>
                    <div className='flex flex-col justify-center'>
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
                                    data && data.map(item => {
                                        return <QuestionCard question={item} />
                                    })
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default QuestionBank