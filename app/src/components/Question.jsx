import React from 'react'

const Question = ({ question, answer, setAnswer }) => {

    const handleOption = () => {
        setAnswer([Number(document.querySelector('input[name=option]:checked').value)])
    }

    return (
        <div>
            <div>
                <p>
                    {question?.question}
                </p>
            </div>
            <ol className='p-5'>
                {
                    question?.options.map((option, index) => {
                        return <li key={index}>
                            <div className='flex items-center gap-2 my-2'>
                                <input className='cursor-pointer' type='radio' name='option' value={index} checked={answer?.includes(index)} onChange={handleOption} />
                                <p>{option}</p>
                            </div>
                        </li>
                    })
                }
            </ol>
        </div>
    )
}

export default Question