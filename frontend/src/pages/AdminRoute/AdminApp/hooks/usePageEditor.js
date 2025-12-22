import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import appService from '../../../../services/appService';

export const usePageEditor = (page, onUpdatePage) => {
    const [uploading, setUploading] = useState(false);

    // --- HANDLERS FOR PAGE FIELDS ---
    const handleMainFieldChange = (e) => {
        onUpdatePage({ ...page, [e.target.name]: e.target.value });
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const res = await appService.uploadImage(file);
            // res.data.url is now "static/uploads/..."
            onUpdatePage({ ...page, image_url: res.data.url });
        } catch (err) {
            console.error("Upload failed", err);
            alert("Failed to upload image.");
        } finally {
            setUploading(false);
        }
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
            variable_name: "",
            placeholder: "",
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
            output_name: "",
            formula: "",
            unit: ""
        };
        onUpdatePage({ ...page, calculations: [...page.calculations, newCalc] });
    };

    const removeCalc = (calcUuid) => {
        const newCalcs = page.calculations.filter((c) => c._uuid !== calcUuid);
        onUpdatePage({ ...page, calculations: newCalcs });
    };

    return {
        handleMainFieldChange,
        handleImageUpload,
        uploading,
        handleInputChange,
        addInput,
        removeInput,
        handleCalcChange,
        addCalc,
        removeCalc
    };
};
