import React from "react";

function AdminHeader({ appName, onSave, isDirty, onBack }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
            <button onClick={onBack}>← Back</button>
            <h2>Editing: {appName}</h2>
            <button
                onClick={onSave}
                disabled={!isDirty}
                style={{ backgroundColor: isDirty ? 'blue' : 'grey', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: isDirty ? 'pointer' : 'default' }}
            >
                Save Changes
            </button>
        </div>
    );
}

export default AdminHeader;
