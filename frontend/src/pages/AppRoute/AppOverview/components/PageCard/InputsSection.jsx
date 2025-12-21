import styles from '../../AppOverview.module.css';

function InputsSection({ inputs, formData, handleInputChange }) {
    if (!inputs) return null;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {inputs.map((input) => (
                <div key={input.variable_name} className={styles.inputGroup}>
                    <label>{input.placeholder}</label>
                    <input
                        className={styles.input}
                        value={formData[input.variable_name] || ''}
                        onChange={(e) => handleInputChange(input.variable_name, e.target.value)}
                        placeholder={`Enter ${input.variable_name}...`}
                    />
                </div>
            ))}
        </div>
    );
}

export default InputsSection;
