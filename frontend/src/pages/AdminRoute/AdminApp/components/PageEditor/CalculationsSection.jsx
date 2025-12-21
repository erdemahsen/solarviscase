import React from "react";
import styles from "../../AdminApp.module.css";

function CalculationsSection({ calculations, onCalcChange, onAddCalc, onRemoveCalc }) {
    return (
        <>
            <h3>Calculations</h3>

            {calculations.map((calc) => (
                <div className={styles.ioRow} key={calc._uuid}>
                    <input
                        value={calc.output_name}
                        onChange={(e) => onCalcChange(calc._uuid, 'output_name', e.target.value)}
                        placeholder="Output Name"
                    />
                    <span>=</span>
                    <input
                        value={calc.formula}
                        onChange={(e) => onCalcChange(calc._uuid, 'formula', e.target.value)}
                        placeholder="Formula (e.g. X + Y)"
                        style={{ flex: 1 }}
                    />
                    <input
                        value={calc.unit || ""}
                        onChange={(e) => onCalcChange(calc._uuid, 'unit', e.target.value)}
                        placeholder="Unit (e.g. $)"
                        style={{ width: '120px' }}
                    />
                    <button className="button actionButton smallButton" onClick={() => onRemoveCalc(calc._uuid)}>×</button>
                </div>
            ))}
            <button onClick={onAddCalc} className="button smallButton">+ Add Calculation</button>
        </>
    );
}

export default CalculationsSection;
