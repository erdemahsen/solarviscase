import React from "react";

function CreateAppButton({ onCreate }) {
    return (
        <button
            onClick={onCreate}
            style={{
                marginBottom: "16px",
                padding: "8px 12px",
                cursor: "pointer",
            }}
        >
            ➕ Create New App
        </button>
    );
}

export default CreateAppButton;
