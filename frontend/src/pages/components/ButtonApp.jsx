import { useState } from 'react'

function ButtonApp({onClick, type}){
    return (
        <>
            <button onClick={onClick} >
                {type}
            </button>
        </>
    )
}

export default ButtonApp