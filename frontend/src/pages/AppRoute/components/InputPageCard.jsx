import { useState } from 'react'

function InputPageCard({currentPage, prevPage, nextPage, formData, handleInputChange }) {

  return (
    <>
        <div className="card">
            <h1>{`Input ${currentPage.id}`}</h1>
            <h2>{currentPage.title}</h2>
            <h3>{currentPage.description}</h3>
            {currentPage.inputs.map((input) => (
                <div key={input.name}>
                    <label>{input.placeholder}</label>
                    <input 
                        type={input.type} // type is important boss
                        // 3. Read the specific value from the big object, default to empty string
                        value={formData[input.name] || ''} 
                        // 4. Call the parent's handler
                        onChange={(e) => handleInputChange(input.name, e.target.value)}
                    />
                </div>
            ))}
            <button onClick={prevPage}>Back</button>
            <button onClick={nextPage}>Next</button>
        </div>
    </>
  )
}

export default InputPageCard
