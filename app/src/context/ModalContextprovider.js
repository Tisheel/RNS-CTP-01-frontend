import { useState } from 'react'
import ModalContext from './ModalContext'

const ModalContextProvider = ({ children }) => {

    const [show, setShow] = useState(false)
    const [component, setComponent] = useState(null)

    const open = (component) => {
        setShow(true)
        setComponent(component)
    }

    const close = () => {
        setShow(false)
        setComponent(null)
    }

    return (
        <ModalContext.Provider value={{ component, show, open, close }}>
            {children}
        </ModalContext.Provider>
    )
}

export default ModalContextProvider