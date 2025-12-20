import React from "react";

function PageCard({ page, isActive, onClick, children }) {
    return (
        <div
            onClick={onClick}
            style={{
                padding: "8px",
                backgroundColor: isActive ? "#e0e0e0" : "transparent",
                fontWeight: isActive ? "bold" : "normal",
                cursor: "pointer",
                marginBottom: 5,
                borderRadius: "4px",
                border: "1px solid #eee",
                aspectRatio: "1 / 1",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                minWidth: "80px", // Ensure square doesn't get too small
            }}
        >
            {children || page?.title}
        </div>
    );
}

export default PageCard;
