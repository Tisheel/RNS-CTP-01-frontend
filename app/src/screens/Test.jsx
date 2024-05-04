import React, { useContext, useEffect, useState } from 'react'
import Question from '../components/Question'
import { useNavigate } from 'react-router'
import axios from 'axios'
import { TEST_FINISH } from '../api/test'
import { RiLoader4Line } from 'react-icons/ri'
import toast from 'react-hot-toast'
import ModalContext from '../context/ModalContext'
import TestConformationPrompt from '../components/TestConformationPrompt'

const Test = () => {

    const navigate = useNavigate()

    const { open, close } = useContext(ModalContext)

    const [testToken, setTestToken] = useState(localStorage.getItem('testToken'))
    const [questions, setQuestions] = useState(localStorage.getItem('questions') && JSON.parse(localStorage.getItem('questions')))
    const [test, setTest] = useState(localStorage.getItem('test') && JSON.parse(localStorage.getItem('test')))

    const [questionIndex, setQuestionIndex] = useState(0)
    const [answer, setAnswer] = useState(null)
    const [question, setQuestion] = useState(null)

    const [time, setTime] = useState(new Date(test?.endTime).getTime() - new Date().getTime())

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!testToken && !questions && !test) {
            return navigate('/')
        }
        setAnswer(questions[questionIndex]?.answer)
        setQuestion(questions[questionIndex]?.question)
    }, [])

    useEffect(() => {
        const interval = setInterval(() => {
            setTime((time) => {
                if (time > 0) {
                    return time - 1000
                } else {
                    submitAnswer()
                    clearInterval(interval)
                    return 0
                }
            })
        }, 1000)
    }, [])

    useEffect(() => {
        if (question)
            setQuestion(questions[questionIndex]?.question)
        if (answer)
            setAnswer(questions[questionIndex]?.answer)
    }, [questionIndex])

    const nextQuestion = () => {
        if (questionIndex < questions.length - 1)
            setQuestionIndex(questionIndex + 1)
    }

    const prevQuestion = () => {
        if (questionIndex > 0)
            setQuestionIndex(questionIndex - 1)
    }

    const handleAnswer = (options) => {

        for (let q of questions) {

            if (q.question._id === questions[questionIndex]?.question._id) {

                q.answer = options

            }

        }

        localStorage.setItem('questions', JSON.stringify(questions))
        setQuestions([...questions])
    }

    const submitAnswer = async () => {

        setLoading(true)
        setError(null)

        try {

            const submit = await axios.post(TEST_FINISH, { questions }, {
                headers: {
                    token: testToken
                }
            })

            localStorage.removeItem('questions')
            localStorage.removeItem('testToken')
            localStorage.removeItem('test')

            navigate('/history')

        } catch (error) {

            toast.error(error?.response?.data?.message || error.message)

            setError(error)

        } finally {

            setLoading(false)

        }

    }

    return (
        <div className='p-5'>
            <div className='flex items-center justify-between font-thin text-2xl'>
                <div>
                    <span className='font-bold'># {test?.title}</span>
                    <p>{test?.subject[0]?.subjectCode}</p>
                </div>
                <span>{Math.floor(time / 3600000) % 24}:{Math.floor(time / 60000) % 60}:{Math.floor(time / 1000) % 60}</span>
            </div>
            <div className='flex items-center justify-around mt-24 m-5 gap-10'>
                <div className='flex flex-col bg-white shadow rounded-md w-full'>
                    <div className='p-10'>
                        <span className='text-lg font-bold'># {questionIndex + 1}</span>
                        <Question question={question} answer={answer} setAnswer={setAnswer} />
                    </div>
                    <div className='flex justify-between mx-10 mb-5'>
                        <button
                            className={`bg-blue-900 text-white py-1 px-5 rounded ${!(questionIndex > 0) && 'bg-gray-500'}`}
                            onClick={prevQuestion}>Back</button>
                        <div className='flex gap-5'>
                            <button
                                className={`bg-blue-900 text-white py-1 px-5 rounded`} onClick={() => handleAnswer(answer)}>Submit</button>
                            <button
                                className={`bg-blue-900 text-white py-1 px-5 rounded ${!(questionIndex < questions?.length - 1) && 'bg-gray-500'}`}
                                onClick={nextQuestion}>Next</button>
                        </div>
                    </div>
                </div>
                <div>
                    <div className='flex flex-col bg-white shadow p-5 rounded-md w-64 gap-6'>
                        <div>
                            <span className='text-lg font-bold'># Test Overview</span>
                        </div>
                        <div className='flex flex-wrap'>
                            {
                                questions?.map((question, index) => {
                                    return <button
                                        className={`rounded-full border-2 w-8 h-8 m-2 ${question?.answer.length !== 0 && 'bg-green-600 text-white'} ${index === questionIndex && 'outline-dashed outline-offset-1 outline-blue-900'}`}
                                        key={index}
                                        onClick={() => setQuestionIndex(index)}>{index + 1}</button>
                                })
                            }
                        </div>
                        <button className='bg-blue-900 text-white rounded py-1 flex justify-center items-center' onClick={() => {
                            open(<TestConformationPrompt submitAnswer={submitAnswer} close={close} />)
                        }}>
                            {
                                loading ?
                                    <RiLoader4Line className='font-extrabold animate-spin' size={25} />
                                    :
                                    <span>Finish</span>
                            }
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Test