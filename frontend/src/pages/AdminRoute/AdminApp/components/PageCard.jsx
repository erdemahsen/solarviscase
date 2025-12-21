import React from "react";

function PageCard({ page, isActive, onClick, onDelete, children }) {
    return (
        <div
            onClick={onClick}
            style={{
                position: "relative",
                padding: "8px",
                backgroundColor: isActive ? "#e0e0e0" : "transparent",
                fontWeight: isActive ? "bold" : "normal",
                cursor: "pointer",
                marginBottom: 5,
                borderRadius: "4px",
                border: "1px solid #eee",
                // aspectRatio: "1 / 1", // Removed to enforce fixed pixel size
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                width: "80px", // Fixed width
                height: "80px", // Fixed height
                flexShrink: 0, // Prevent shrinking in flex container
                boxSizing: "border-box", // Include padding/border in size
                overflow: "hidden", // Prevent content from overflowing
                fontSize: "12px", // Ensure text fits better
            }}
        >
            {children || page?.title}

            {!children && onDelete && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm("Delete this page?")) {
                            onDelete();
                        }
                    }}
                    style={{
                        position: "absolute",
                        top: "2px",
                        right: "2px",
                        background: "red",
                        color: "white",
                        border: "none",
                        borderRadius: "50%",
                        width: "16px",
                        height: "16px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "10px",
                        cursor: "pointer",
                        lineHeight: 1,
                        zIndex: 10
                    }}
                >
                    x
                </button>
            )}
        </div>
    );
}

export default PageCard;
