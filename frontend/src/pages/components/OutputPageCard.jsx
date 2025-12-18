import { useState } from 'react'
import ButtonApp from './ButtonApp'

function OutputPageCard({outputPage, prevPage, nextPage, calculations}) {


  return (
    <>
        <div className='app-page'>
            <h1>Output Page</h1>
            <h1>{outputPage.title}</h1>
            <h3>{outputPage.description}</h3>
            <ButtonApp onClick={prevPage} type="prev"></ButtonApp>
            <ButtonApp onClick={nextPage} type="next"></ButtonApp>

            {calculations.map((c, index) => {

              return <h3 key={index}>Formula {index}: {c.formula}</h3>

            })}
            
        </div>
    </>
  )
}

export default OutputPageCard
