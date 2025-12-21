import React from "react";
import styles from "../../AdminApp.module.css";

function InputsSection({ inputs, onInputChange, onAddInput, onRemoveInput }) {
    return (
        <>
            <h3>Input Variables</h3>
            {inputs.length === 0 && <p>No inputs in this page.</p>}

            {inputs.map((input) => (
                <div key={input._uuid} style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
                    <input
                        value={input.variable_name}
                        onChange={(e) => onInputChange(input._uuid, 'variable_name', e.target.value)}
                        placeholder="Variable Name (e.g. X)"
                    />
                    <input
                        value={input.placeholder || ""}
                        onChange={(e) => onInputChange(input._uuid, 'placeholder', e.target.value)}
                        placeholder="Variable Placeholder"
                        style={{ flex: 1 }}
                    />
                    <button className={`${styles.button} ${styles.actionButton} ${styles.smallButton}`} onClick={() => onRemoveInput(input._uuid)}>×</button>
                </div>
            ))}
            <button onClick={onAddInput} className={`${styles.button} ${styles.smallButton}`}>+ Add Input Variable</button>
        </>
    );
}

export default InputsSection;
