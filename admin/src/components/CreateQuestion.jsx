import React, { useCallback, useContext, useReducer, useRef, useState } from 'react'
import { apiReducer, initialState } from '../reducers/apiReducer'
import axios from 'axios'
import { ADD_QUESTION } from '../api/questionBank'
import AuthContext from '../context/AuthContext'
import toast from 'react-hot-toast'
import { RiLoader4Line } from 'react-icons/ri'
import ModalContext from '../context/ModalContext'

const CreateQuestion = () => {

    const { authToken } = useContext(AuthContext)
    const { close } = useContext(ModalContext)

    const [{ loading, data, error }, dispatch] = useReducer(apiReducer, initialState)

    const createQuestion = async (e) => {

        dispatch({ type: 'FETCH_START' })

        try {

            e.preventDefault()

            const answer = []
            const options = []

            e.target.answer.forEach((x) => x.checked && answer.push(Number(x.value)))
            e.target.options.forEach((x) => options.push(x.value))

            await axios.post(ADD_QUESTION,
                {
                    module: Number(e.target.module.value),
                    level: Number(e.target.level.value),
                    value: Number(e.target.elements.value.value),
                    question: e.target.question.value,
                    options,
                    answer
                },
                {
                    headers: {
                        token: authToken
                    }
                }
            )

            dispatch({ type: 'FETCH_SUCCESS', payload: data })

            toast.success('Question Created Successfully')

            close()

        } catch (error) {

            dispatch({ type: 'FETCH_FAIL', payload: error })

            toast.error(error?.response?.data?.message || error.message)

        }

    }

    return (
        <div className='flex justify-center mt-5'>
            <div className='flex flex-col gap-5'>
                <form className='flex flex-col gap-5' onSubmit={createQuestion}>
                    <div className='flex items-center gap-2'>
                        <label>Module: </label>
                        <input type='number' className='outline-none border-2' name='module' />
                    </div>
                    <div className='flex items-center gap-2'>
                        <label>Difficulty: </label>
                        <div className='flex items-center gap-2'>
                            <input type='radio' name='level' value='1' />
                            <label>Easy</label>
                            <input type='radio' name='level' value='2' />
                            <label>Medium</label>
                            <input type='radio' name='level' value='3' />
                            <label>Hard</label>
                        </div>
                    </div>
                    <div className='flex items-center gap-2'>
                        <label>Value: </label>
                        <input type='number' className='outline-none border-2' name='value' />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label>Question: </label>
                        <textarea
                            className='outline-none border-2'
                            name='question'
                            placeholder='Enter Question here - '
                        />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label>Options: </label>
                        <div className='flex flex-col gap-2'>
                            <div className='flex items-center gap-2'>
                                <input type='checkbox' value={0} name='answer' />
                                <textarea
                                    className='outline-none border-2'
                                    name='options'
                                    placeholder='Enter Option here - ' />
                            </div>
                            <div className='flex items-center gap-2'>
                                <input type='checkbox' value={1} name='answer' />
                                <textarea
                                    className='outline-none border-2'
                                    name='options'
                                    placeholder='Enter Option here - ' />
                            </div>
                            <div className='flex items-center gap-2'>
                                <input type='checkbox' value={2} name='answer' />
                                <textarea
                                    className='outline-none border-2'
                                    name='options'
                                    placeholder='Enter Option here - ' />
                            </div>
                            <div className='flex items-center gap-2'>
                                <input type='checkbox' value={3} name='answer' />
                                <textarea
                                    className='outline-none border-2'
                                    name='options'
                                    placeholder='Enter Option here - ' />
                            </div>
                        </div>
                    </div>

                    <button className='rounded-md bg-blue-900 p-1 text-white'>
                        {
                            loading ?
                                <RiLoader4Line className='font-extrabold animate-spin' size={25} />
                                :
                                <span>Add</span>
                        }
                    </button>
                </form>
            </div>
        </div>
    )
}

export default CreateQuestion