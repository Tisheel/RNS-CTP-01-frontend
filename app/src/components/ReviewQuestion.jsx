import React from 'react'

const ReviewQuestion = ({ question, questionIndex }) => {
    return (
        <div className='flex justify-between px-10 py-5'>
            <div>
                <div className='font-bold'>
                    <div className='flex items-center'>
                        <span># {questionIndex + 1}</span>
                        {
                            question?.question?.level === 1 && <span className='bg-green-500 p-1 rounded-lg text-xs mx-2'>Easy</span>
                        }
                        {
                            question?.question?.level === 2 && <span className='bg-orange-500 p-1 rounded-lg text-xs mx-2'>Medium</span>
                        }
                        {
                            question?.question?.level === 3 && <span className='bg-red-500 p-1 rounded-lg text-xs mx-2'>Hard</span>
                        }
                    </div>
                    <p>
                        {question?.question?.question}
                    </p>
                </div>
                <ol className='my-5'>
                    {
                        question?.question?.options.map((option, index) => {
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
                                Marks Alloted:
                            </th>
                            <td className='p-1'>
                                {
                                    question?.question?.answer.toString() === question?.answer.toString() ?
                                        <span>{question?.question?.value}</span>
                                        :
                                        <span>0</span>
                                }
                            </td>
                        </tr>
                        <tr>
                            <th className='p-1'>
                                Correct Option:
                            </th>
                            <td className='p-1 flex gap-2'>
                                {
                                    question?.question?.answer.map(option => {
                                        return <span key={option}>{option + 1}</span>
                                    })
                                }
                            </td>
                        </tr>
                        <tr>
                            <th className='p-1'>
                                Your Option:
                            </th>
                            <td className='p-1'>
                                {
                                    <span>{question?.answer.map(ans => ans + 1)}</span>
                                }
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div >
    )
}

export default ReviewQuestion