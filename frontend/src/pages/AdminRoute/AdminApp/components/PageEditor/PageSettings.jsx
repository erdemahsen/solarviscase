import React from "react";

function PageSettings({ page, onChange }) {
    return (
        <>
            <h3>Page Settings</h3>
            <div>
                <label>Page Title:</label>
                <input
                    name="title"
                    value={page.title}
                    onChange={onChange}
                    style={{ width: '100%', padding: '5px' }}
                    placeholder="e.g. When was your house built?"
                />
            </div>
            <div style={{ marginBottom: 15 }}>
                <label>Description:</label>
                <textarea
                    name="description"
                    value={page.description || ""}
                    onChange={onChange}
                    style={{ width: '100%', padding: '5px' }}
                    placeholder="e.g. Enter when your house was built"
                />
            </div>
        </>
    );
}

export default PageSettings;
