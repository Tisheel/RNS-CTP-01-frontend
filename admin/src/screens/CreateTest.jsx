import React from 'react';
import Header from '../components/Header';
import { Outlet } from 'react-router-dom';

const CreateTest = () => {

    return (
        <div>
            <Header />
            <div className='flex justify-center p-10'>
                <Outlet />
            </div>
        </div>
    )
}

export default CreateTest