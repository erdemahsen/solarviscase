import React, { useState } from "react";
import appService from "../../../../../services/appService";

function PageSettings({ page, onChange, onImageUpload, uploading }) {

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

            <div style={{ marginBottom: 15 }}>
                <label>Page Image:</label>
                <br />
                {page.image_url && (
                    <img
                        src={page.image_url}
                        alt="Preview"
                        style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px', marginBottom: '5px' }}
                    />
                )}
                <div>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={onImageUpload}
                        disabled={uploading}
                    />
                    {uploading && <span>Uploading...</span>}
                </div>
                <small style={{ color: '#666' }}>Upload an image to display on this page.</small>
            </div>
        </>
    );
}

export default PageSettings;
