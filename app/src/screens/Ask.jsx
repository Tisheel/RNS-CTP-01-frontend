import React from 'react'
import Header from '../components/Header'
import { IoIosSend } from "react-icons/io"

const Ask = () => {
    return (
        <div>
            <Header />
            <div className='flex justify-center mt-10'>
                <div className='flex flex-col gap-5'>
                    <span className='text-black font-extrabold text-3xl'>Submit your Query!!!</span>
                    <textarea className='outline-none w-96 h-52 p-1' placeholder='Type the issue in detail...' />
                    <div className='flex gap-2'>
                        <select className='bg-white p-2 w-full cursor-pointer'>
                            <option default>collegetestportal@gmail.com</option>
                            <option>bhavanishankar@gmail.com</option>
                            <option>sudhamani@gmail.com</option>
                            <option>suresha@gmail.com</option>
                        </select>
                        <button className='bg-blue-900 text-white font-bold rounded-lg px-2 flex items-center'><IoIosSend size={25} /></button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Ask