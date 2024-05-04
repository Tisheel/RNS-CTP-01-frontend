import React, { useContext } from 'react'
import ModalContext from '../context/ModalContext'
import { IoClose } from 'react-icons/io5'

const Modal = () => {

    const { show, component, close } = useContext(ModalContext)

    if (!show) return

    return (
        <div className='absolute bg-white shadow-2xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-5'>
            <IoClose className='cursor-pointer' onClick={() => {
                close()
            }} />
            {component}
        </div>
    )
}

export default Modal