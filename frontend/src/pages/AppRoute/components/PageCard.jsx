function PageCard({ pageConfig, results, formData, handleInputChange, prevPage, nextPage, isResultPage }) {

    return (
        <div className="card">
            <h1>{isResultPage ? pageConfig.title : `Input ${pageConfig.id}`}</h1>
            {!isResultPage && <h2>{pageConfig.title}</h2>}
            <h3>{pageConfig.description}</h3>

            {pageConfig.image_url &&
                <img
                    src={pageConfig.image_url}
                    alt={pageConfig.title}
                    style={{ maxWidth: '100%' }}
                />
            }

            {/* --- INPUTS SECTION --- */}
            {pageConfig.inputs && pageConfig.inputs.map((input) => (
                <div key={input.variable_name} style={{ marginBottom: '10px' }}>
                    <label style={{display: 'block'}}>{input.placeholder}</label>
                    <input
                        type={input.input_type}
                        value={formData[input.variable_name] || ''}
                        onChange={(e) => handleInputChange(input.variable_name, e.target.value)}
                    />
                </div>
            ))}

            <hr />

            {/* --- RESULTS SECTION (UPDATED) --- */}
            {/* 1. We check if this page actually has calculation definitions */}
            {pageConfig.calculations && pageConfig.calculations.length > 0 && (
                <div className="results-area">
                    <h4>Calculations:</h4>
                    {/* 2. Loop through the CONFIG, not the results */}
                    {pageConfig.calculations.map((calcDef) => {
                        
                        // 3. Find the matching result in the global results array
                        // We match `output_name` from config to `key` from backend
                        const match = results?.find(r => r.key === calcDef.output_name);

                        // 4. If result doesn't exist yet (calculating...), show placeholder or nothing
                        if (!match) return null; 

                        return (
                            <div key={calcDef.output_name} style={{ color: 'blue', fontWeight: 'bold' }}>
                                {/* Use the label from config, and value from result */}
                                {calcDef.output_name}: {match.value} {calcDef.unit}
                            </div>
                        );
                    })}
                </div>
            )}

            <div className="actions" style={{ marginTop: '20px' }}>
                <button onClick={prevPage} disabled={!prevPage}>Back</button>
                <button onClick={nextPage}>
                    {isResultPage ? "Finish" : "Next"}
                </button>
            </div>
        </div>
    )
}

export default PageCard