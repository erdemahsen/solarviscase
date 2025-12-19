

function InputPageCard({ currentPage, prevPage, nextPage, formData, handleInputChange }) {

    return (
        <>
            <div className="card">
                <h1>{`Input ${currentPage.id}`}</h1>
                <h2>{currentPage.title}</h2>
                <h3>{currentPage.description}</h3>
                {currentPage.image_url && <img src={currentPage.image_url} alt={currentPage.title} style={{ maxWidth: '100%' }} />}
                {currentPage.inputs.map((input) => (
                    <div key={input.variable_name}>
                        <label>{input.placeholder}</label>
                        <input
                            type={input.input_type} // type is important boss
                            // 3. Read the specific value from the big object, default to empty string
                            value={formData[input.variable_name] || ''}
                            // 4. Call the parent's handler
                            onChange={(e) => handleInputChange(input.variable_name, e.target.value)}
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
