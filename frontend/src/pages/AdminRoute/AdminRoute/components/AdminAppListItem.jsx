import React from "react";

function AdminAppListItem({ app, onDelete, onClick }) {
    return (
        <div
            style={{
                border: "1px solid #ccc",
                padding: "12px",
                marginBottom: "8px",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
            }}
            onClick={() => onClick(app.id)}
        >
            <div>
                <h3>{app.app_name}</h3>
                <p>id: {app.id}</p>
                <p>num of pages: {app.pages.length}</p>
            </div>

            {/* 🗑️ Delete */}
            <button
                onClick={(e) => onDelete(e, app.id)}
                style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "18px",
                }}
                title="Delete app"
            >
                🗑️
            </button>
        </div>
    );
}

export default AdminAppListItem;
