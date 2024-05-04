import React, { useContext, useEffect, useState } from 'react'
import { RiLoader4Line } from "react-icons/ri"
import ModalContext from '../context/ModalContext'
import axios from 'axios'
import { TEST_START } from '../api/test'
import AuthContext from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const Passkey = ({ testId }) => {

    const [passKey, setPassKey] = useState('')

    const navigate = useNavigate()

    const { close } = useContext(ModalContext)
    const { authToken } = useContext(AuthContext)

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)


    const startTest = async () => {

        setLoading(true)
        setError(null)

        try {

            const { data } = await axios.post(TEST_START + `/${testId}`, { passKey }, {
                headers: {
                    token: authToken
                }
            })

            const questions = []

            for (let question of data?.test?.questions) {

                questions.push({ question, answer: [] })

            }

            localStorage.setItem('questions', JSON.stringify(questions))
            localStorage.setItem('testToken', data?.token)

            delete data?.test['questions']
            delete data?.test['passKey']

            localStorage.setItem('test', JSON.stringify(data?.test))

            navigate('/tests/' + testId)

        } catch (error) {

            if (error)
                toast.error(error?.response?.data?.message || error.message)

            setError(error)

        } finally {

            setLoading(false)

        }

    }

    return (
        <div className='p-5 gap-5 flex flex-col'>
            <div className='flex justify-between items-center'>
                <span>Enter Passkey</span>
            </div>
            <form className='gap-5 flex flex-col' onSubmit={async (e) => {
                e.preventDefault()
                await startTest({ passKey })
                close()
            }}>
                <input className='w-full bg-slate-50 outline-none p-2 rounded-lg border border-slate-500' type='text' placeholder='123456' value={passKey} onChange={(e) => setPassKey(e.target.value)} required />
                <button className='bg-blue-900 text-white shadow w-full py-2 rounded-lg border border-slate-500 flex items-center justify-center'>
                    {
                        loading ?
                            <RiLoader4Line className='font-extrabold animate-spin' size={25} />
                            :
                            <span>Enter</span>
                    }
                </button>
            </form>
        </div>
    )
}

export default Passkey