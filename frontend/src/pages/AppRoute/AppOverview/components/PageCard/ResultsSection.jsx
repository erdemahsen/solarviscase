import styles from '../../AppOverview.module.css';

function ResultsSection({ calculations, results, loading }) {
    if (!calculations || calculations.length === 0) return null;

    return (
        <div className={styles.resultsArea}>
            <h4 style={{ marginTop: 0, marginBottom: '10px' }}>Calculations</h4>
            {loading ? (
                <div style={{ fontStyle: 'italic'}}>Calculating results...</div>
            ) : (
                calculations.map((calcDef) => {
                    const match = results?.find(r => r.key === calcDef.output_name);
                    if (!match) return null;

                    return (
                        <div key={calcDef.output_name} className={styles.resultItem}>

                            {match.value === "Error" ? 
                                <span>There was an error calculating {calcDef.output_name}</span>: 
                                <>
                                <span>{calcDef.output_name}:</span>
                                <span style={{ fontWeight: 'bold' }}>
                                    {match.value} {calcDef.unit}
                                </span>
                                </>   
                            }
                            
                        </div>
                    );
                })
            )}
        </div>
    );
}

export default ResultsSection;
