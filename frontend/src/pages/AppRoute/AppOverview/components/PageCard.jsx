import styles from '../AppOverview.module.css';

function PageCard({ pageConfig, results, formData, handleInputChange, prevPage, nextPage, isResultPage }) {

    return (
        <div className={styles.cardContainer}>
            <div className={styles.header}>
                <h2 className={styles.title}>{pageConfig.title}</h2>
                <p className={styles.description}>{pageConfig.description}</p>
            </div>

            {pageConfig.image_url &&
                <div className={styles.imageContainer}>
                    <img
                        src={pageConfig.image_url}
                        alt={pageConfig.title}
                        className={styles.image}
                    />
                </div>
            }

            {/* --- INPUTS SECTION --- */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {pageConfig.inputs && pageConfig.inputs.map((input) => (
                    <div key={input.variable_name} className={styles.inputGroup}>
                        <label className={styles.label}>{input.placeholder}</label>
                        <input
                            className={styles.input}
                            value={formData[input.variable_name] || ''}
                            onChange={(e) => handleInputChange(input.variable_name, e.target.value)}
                            placeholder={`Enter ${input.variable_name}...`}
                        />
                    </div>
                ))}
            </div>

            {/* --- RESULTS SECTION --- */}
            {pageConfig.calculations && pageConfig.calculations.length > 0 && (
                <div className={styles.resultsArea}>
                    <h4 style={{ marginTop: 0, marginBottom: '10px' }}>Calculations</h4>
                    {pageConfig.calculations.map((calcDef) => {
                        const match = results?.find(r => r.key === calcDef.output_name);
                        if (!match) return null;

                        return (
                            <div key={calcDef.output_name} className={styles.resultItem}>
                                <span>{calcDef.output_name}:</span>
                                <span style={{ fontWeight: 'bold', color: 'var(--color-secondary)' }}>
                                    {match.value} {calcDef.unit}
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}

            <div className={styles.actions}>
                <button
                    className="button actionButton"
                    onClick={prevPage}
                    disabled={!prevPage}
                    style={{ visibility: prevPage ? 'visible' : 'hidden' }} // Hide if no prev action
                >
                    Back
                </button>
                <button
                    className="button"
                    onClick={nextPage}
                >
                    {isResultPage ? "Finish" : "Next"}
                </button>
            </div>
        </div>
    )
}

export default PageCard