import React, { useContext } from 'react'
import { DELETE_QUESTION } from '../api/questionBank'
import toast from 'react-hot-toast'
import AuthContext from '../context/AuthContext'
import axios from 'axios'
import ModalContext from '../context/ModalContext'
import EditQuestion from './EditQuestion'

const QuestionCard = ({ question }) => {

    const { authToken } = useContext(AuthContext)

    const { open } = useContext(ModalContext)

    const deleteQuestion = async (questionId) => {

        toast.promise(axios.delete(DELETE_QUESTION + `/${questionId}`,
            {
                headers: {
                    token: authToken
                }
            }),
            {
                loading: 'loading...',
                success: <b>Question Deleted</b>,
                error: (error) => error?.response?.data?.message || error.message,
            }
        )

    }

    const handleDelete = (_id) => {
        const response = window.confirm('Are you sure you want to delete the question?')
        if (response)
            deleteQuestion(_id)
    }

    return (
        <div className='flex justify-between px-10 py-5 bg-white border'>
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
                                Subject:
                            </th>
                            <td className='p-1'>
                                {
                                    question?.subject[0].subjectCode
                                }
                            </td>
                        </tr>
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
                        <tr>
                            <th className='p-1'>
                                Answer:
                            </th>
                            <td className='p-1'>
                                {JSON.stringify(question?.answer)}
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div className='flex gap-5'>
                    <button className='bg-blue-900 text-white px-4 py-1 rounded-md' onClick={() => open(<EditQuestion question={question} />)}>Edit</button>
                    <button className='bg-red-600 text-white px-4 py-1 rounded-md' onClick={() => handleDelete(question._id)}>Delete</button>
                </div>
            </div>
        </div >
    )
}

export default QuestionCard