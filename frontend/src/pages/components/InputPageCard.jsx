import { useState } from 'react'
import ButtonApp from './ButtonApp'

function InputPageCard({currentPage, prevPage, nextPage }) {


  return (
    <>
        <div className='app-page'>
            <h1>{`Input ${currentPage.id}`}</h1>
            <h1>{currentPage.title}</h1>
            <h3>{currentPage.description}</h3>
            <ButtonApp onClick={prevPage} type="prev"></ButtonApp>
            <ButtonApp onClick={nextPage} type="next"></ButtonApp>
            
        </div>
    </>
  )
}

export default InputPageCard
