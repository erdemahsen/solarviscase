import { v4 as uuidv4 } from 'uuid';
import styles from "../AdminApp.module.css";

function PageEditor({ page, onUpdatePage, onDeletePage }) {
  if (!page) {
    return (
      <div className={styles.pageEditor} style={{ display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}>
        <p>There are no pages. Add a page.</p>
      </div>
    );
  }

  // --- HANDLERS FOR PAGE FIELDS ---
  const handleMainFieldChange = (e) => {
    onUpdatePage({ ...page, [e.target.name]: e.target.value });
  };

  // --- HANDLERS FOR INPUTS ---
  const handleInputChange = (inputUuid, field, value) => {
    const newInputs = page.inputs.map((input) =>
      input._uuid === inputUuid ? { ...input, [field]: value } : input
    );
    onUpdatePage({ ...page, inputs: newInputs });
  };

  const addInput = () => {
    const newInput = {
      _uuid: uuidv4(), // Generate Frontend ID
      // No database ID yet
      variable_name: "New_Var",
      placeholder: "Enter value...",
    };
    onUpdatePage({ ...page, inputs: [...page.inputs, newInput] });
  };

  const removeInput = (inputUuid) => {
    const newInputs = page.inputs.filter((i) => i._uuid !== inputUuid);
    onUpdatePage({ ...page, inputs: newInputs });
  };

  // --- HANDLERS FOR CALCULATIONS ---
  const handleCalcChange = (calcUuid, field, value) => {
    const newCalcs = page.calculations.map((calc) =>
      calc._uuid === calcUuid ? { ...calc, [field]: value } : calc
    );
    onUpdatePage({ ...page, calculations: newCalcs });
  };

  const addCalc = () => {
    const newCalc = {
      _uuid: uuidv4(),
      output_name: "Result_A",
      formula: "X * 2",
      unit: "$"
    };
    onUpdatePage({ ...page, calculations: [...page.calculations, newCalc] });
  };

  const removeCalc = (calcUuid) => {
    const newCalcs = page.calculations.filter((c) => c._uuid !== calcUuid);
    onUpdatePage({ ...page, calculations: newCalcs });
  };

  // --- RENDER ---
  return (
    <div className={styles.pageEditor}>

      {/* 1. Page Details */}
      <h3>Page Settings</h3>
      <div style={{ marginBottom: 15 }}>
        <label>Page Title:</label>
        <input
          name="title"
          value={page.title}
          onChange={handleMainFieldChange}
          style={{ width: '100%', padding: '5px' }}
        />
      </div>
      <div style={{ marginBottom: 15 }}>
        <label>Description:</label>
        <textarea
          name="description"
          value={page.description || ""}
          onChange={handleMainFieldChange}
          style={{ width: '100%', padding: '5px' }}
        />
      </div>

      <hr />

      {/* 2. Inputs Section */}
      <h3>User Inputs</h3>
      {page.inputs.length === 0 && <p style={{ color: '#888' }}>No inputs yet.</p>}

      {page.inputs.map((input) => (
        <div key={input._uuid} style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
          <input
            value={input.variable_name}
            onChange={(e) => handleInputChange(input._uuid, 'variable_name', e.target.value)}
            placeholder="Var Name (e.g. X)"
          />
          <input
            value={input.placeholder || ""}
            onChange={(e) => handleInputChange(input._uuid, 'placeholder', e.target.value)}
            placeholder="Placeholder"
          />
          <button onClick={() => removeInput(input._uuid)} style={{ color: 'red' }}>×</button>
        </div>
      ))}
      <button onClick={addInput} className={styles.button}>+ Add Input</button>

      <hr />

      {/* 3. Calculations Section */}
      <h3>Calculations</h3>
      <p style={{ fontSize: '0.8em', color: '#666' }}>
        Use variable names from above (e.g., <code>X * 2</code>)
      </p>

      {page.calculations.map((calc) => (
        <div key={calc._uuid} style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
          <input
            value={calc.output_name}
            onChange={(e) => handleCalcChange(calc._uuid, 'output_name', e.target.value)}
            placeholder="Output Name"
          />
          <span>=</span>
          <input
            value={calc.formula}
            onChange={(e) => handleCalcChange(calc._uuid, 'formula', e.target.value)}
            placeholder="Formula (e.g. X + Y)"
            style={{ flex: 1 }}
          />
          <input
            value={calc.unit || ""}
            onChange={(e) => handleCalcChange(calc._uuid, 'unit', e.target.value)}
            placeholder="Unit (e.g. $)"
            style={{ width: '60px' }}
          />
          <button onClick={() => removeCalc(calc._uuid)} style={{ color: 'red' }}>×</button>
        </div>
      ))}
      <div style={{ marginTop: '20px', borderTop: '1px solid #ddd', paddingTop: '10px' }}>
        <button
          className={`${styles.button} ${styles.actionButton}`}
          onClick={() => {
            if (window.confirm("Are you sure you want to delete this page?")) {
              onDeletePage(page._uuid);
            }
          }}
        >
          Delete Page
        </button>
      </div>

    </div>
  );
}

export default PageEditor;