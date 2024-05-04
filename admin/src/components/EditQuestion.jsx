import React, { useContext, useEffect, useReducer, useState } from 'react'
import { RiLoader4Line } from 'react-icons/ri'
import { apiReducer, initialState } from '../reducers/apiReducer'
import axios from 'axios'
import { EDIT_QUESTION } from '../api/questionBank'
import AuthContext from '../context/AuthContext'
import ModalContext from '../context/ModalContext'
import toast from 'react-hot-toast'

const EditQuestion = ({ question }) => {

    const [updatedQuestion, setUpdatedQuestion] = useState(question)
    const [options, setOptions] = useState(question?.options)
    const [answer, setAnswer] = useState(question?.answer)

    const handleOptionsChange = (index, e) => {
        const updatedOptions = [...options]
        updatedOptions[index] = e.target.value
        setOptions(updatedOptions)
    }

    const [{ loading, data, error }, dispatch] = useReducer(apiReducer, initialState)

    const { authToken } = useContext(AuthContext)
    const { close } = useContext(ModalContext)

    const handleAnswerChange = (index, e) => {
        if (e.target.checked) {
            const updatedAnswer = [...answer]
            updatedAnswer.push(index)
            setAnswer(updatedAnswer)
        } else {
            const updatedAnswer = []
            for (let i of answer) {
                if (i !== index)
                    updatedAnswer.push(i)
            }
            setAnswer(updatedAnswer)
        }
    }

    const updateQuestion = async (e) => {

        e.preventDefault()

        dispatch({ type: 'FETCH_START' })

        try {

            const body = { ...updatedQuestion, options, answer }
            delete body["_id"]
            delete body["subject"]

            await axios.patch(EDIT_QUESTION + `/${question._id}`,
                body,
                {
                    headers: {
                        token: authToken
                    }
                }
            )

            dispatch({ type: 'FETCH_SUCCESS', payload: data })

            toast.success('Question Updated')

            close()

        } catch (error) {

            dispatch({ type: 'FETCH_FAIL', payload: error })

            toast.error(error?.response?.data?.message || error.message)

        }

    }

    return (
        <div className='flex justify-center mt-5'>
            <div className='flex flex-col gap-5'>
                <form className='flex flex-col gap-5'>
                    <div className='flex items-center gap-2'>
                        <label>Module: </label>
                        <input type='number' value={updatedQuestion?.module} className='outline-none border-2' name='module' onChange={(e) => setUpdatedQuestion({ ...updatedQuestion, [e.target.name]: Number(e.target.value) })} />
                    </div>
                    <div className='flex items-center gap-2'>
                        <label>Difficulty: </label>
                        <div className='flex items-center gap-2'>
                            <input type='radio' checked={updatedQuestion?.level === 1} name='level' value={1} onChange={(e) => setUpdatedQuestion({ ...updatedQuestion, [e.target.name]: Number(e.target.value) })} />
                            <label>Easy</label>
                            <input type='radio' checked={updatedQuestion?.level === 2} name='level' value={2} onChange={(e) => setUpdatedQuestion({ ...updatedQuestion, [e.target.name]: Number(e.target.value) })} />
                            <label>Medium</label>
                            <input type='radio' checked={updatedQuestion?.level === 3} name='level' value={3} onChange={(e) => setUpdatedQuestion({ ...updatedQuestion, [e.target.name]: Number(e.target.value) })} />
                            <label>Hard</label>
                        </div>
                    </div>
                    <div className='flex items-center gap-2'>
                        <label>Value: </label>
                        <input type='number' value={updatedQuestion?.value} className='outline-none border-2' name='value' onChange={(e) => setUpdatedQuestion({ ...updatedQuestion, [e.target.name]: Number(e.target.value) })} />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label>Question: </label>
                        <textarea
                            className='outline-none border-2'
                            value={updatedQuestion?.question}
                            name='question'
                            placeholder='Enter Question here - '
                            onChange={(e) => setUpdatedQuestion({ ...updatedQuestion, [e.target.name]: e.target.value })}
                        />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label>Options: </label>
                        <div className='flex flex-col gap-2'>
                            {
                                options.map((option, index) => {
                                    return <div className='flex items-center gap-2' key={index}>
                                        <input type='checkbox' value={index} name='answer' checked={answer.includes(index)} onChange={(e) => handleAnswerChange(index, e)} />
                                        <textarea
                                            className='outline-none border-2'
                                            value={option}
                                            name='options'
                                            placeholder='Enter Option here - '
                                            onChange={(e) => handleOptionsChange(index, e)} />
                                    </div>
                                })
                            }
                        </div>
                    </div>

                    <button className='rounded-md bg-blue-900 p-1 text-white flex items-center justify-center' onClick={updateQuestion}>
                        {
                            loading ?
                                <RiLoader4Line className='font-extrabold animate-spin' size={25} />
                                :
                                <span>Edit</span>
                        }
                    </button>
                </form>
            </div>
        </div>
    )
}

export default EditQuestion