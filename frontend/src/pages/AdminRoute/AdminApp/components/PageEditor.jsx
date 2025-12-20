import { v4 as uuidv4 } from 'uuid';

function PageEditor({ page, onUpdate }) {
  
  // --- HANDLERS FOR PAGE FIELDS ---
  const handleMainFieldChange = (e) => {
    onUpdate({ ...page, [e.target.name]: e.target.value });
  };

  // --- HANDLERS FOR INPUTS ---
  const handleInputChange = (inputUuid, field, value) => {
    const newInputs = page.inputs.map((input) =>
      input._uuid === inputUuid ? { ...input, [field]: value } : input
    );
    onUpdate({ ...page, inputs: newInputs });
  };

  const addInput = () => {
    const newInput = {
      _uuid: uuidv4(), // Generate Frontend ID
      // No database ID yet
      variable_name: "New_Var",
      placeholder: "Enter value...",
      input_type: "number"
    };
    onUpdate({ ...page, inputs: [...page.inputs, newInput] });
  };

  const removeInput = (inputUuid) => {
    const newInputs = page.inputs.filter((i) => i._uuid !== inputUuid);
    onUpdate({ ...page, inputs: newInputs });
  };

  // --- HANDLERS FOR CALCULATIONS ---
  const handleCalcChange = (calcUuid, field, value) => {
    const newCalcs = page.calculations.map((calc) =>
      calc._uuid === calcUuid ? { ...calc, [field]: value } : calc
    );
    onUpdate({ ...page, calculations: newCalcs });
  };

  const addCalc = () => {
    const newCalc = {
      _uuid: uuidv4(),
      output_name: "Result_A",
      formula: "X * 2",
      unit: "$"
    };
    onUpdate({ ...page, calculations: [...page.calculations, newCalc] });
  };

  const removeCalc = (calcUuid) => {
    const newCalcs = page.calculations.filter((c) => c._uuid !== calcUuid);
    onUpdate({ ...page, calculations: newCalcs });
  };

  // --- RENDER ---
  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      
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
      {page.inputs.length === 0 && <p style={{color: '#888'}}>No inputs yet.</p>}
      
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
          <select 
            value={input.input_type}
            onChange={(e) => handleInputChange(input._uuid, 'input_type', e.target.value)}
          >
            <option value="number">Number</option>
            <option value="slider">Slider</option>
          </select>
          <button onClick={() => removeInput(input._uuid)} style={{ color: 'red' }}>×</button>
        </div>
      ))}
      <button onClick={addInput} style={{ marginTop: 5 }}>+ Add Input</button>

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
      <button onClick={addCalc} style={{ marginTop: 5 }}>+ Add Calculation</button>

    </div>
  );
}

export default PageEditor;