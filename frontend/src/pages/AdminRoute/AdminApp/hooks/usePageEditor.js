import { v4 as uuidv4 } from 'uuid';

export const usePageEditor = (page, onUpdatePage) => {

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

    return {
        handleMainFieldChange,
        handleInputChange,
        addInput,
        removeInput,
        handleCalcChange,
        addCalc,
        removeCalc
    };
};
