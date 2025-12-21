import React from "react";
import styles from "../../AdminApp.module.css";

function InputsSection({ inputs, onInputChange, onAddInput, onRemoveInput }) {
    return (
        <>
            <h3>User Inputs</h3>
            {inputs.length === 0 && <p>No inputs yet.</p>}

            {inputs.map((input) => (
                <div key={input._uuid} style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
                    <input
                        value={input.variable_name}
                        onChange={(e) => onInputChange(input._uuid, 'variable_name', e.target.value)}
                        placeholder="Var Name (e.g. X)"
                    />
                    <input
                        value={input.placeholder || ""}
                        onChange={(e) => onInputChange(input._uuid, 'placeholder', e.target.value)}
                        placeholder="Placeholder"
                    />
                    <button onClick={() => onRemoveInput(input._uuid)} style={{ color: 'red' }}>×</button>
                </div>
            ))}
            <button onClick={onAddInput} className={styles.button}>+ Add Input</button>
        </>
    );
}

export default InputsSection;
