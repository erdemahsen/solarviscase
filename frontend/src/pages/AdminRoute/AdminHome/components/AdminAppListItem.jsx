import React from "react";
import styles from "../AdminHome.module.css";

function AdminAppListItem({ app, onDelete, onClick, onNavigationClick }) {
    return (
        <div
            className={styles.appListItem}
            onClick={() => onClick(app.id)}
        >
            <div>
                <h3>{app.app_name}</h3>
                <p onClick={(e) => { e.stopPropagation(); onNavigationClick(app.id); }} style={{ cursor: "pointer", textDecoration: "underline" }}>Page preview: /app/{app.id}</p>
                <p>num of pages: {app.pages.length}</p>
            </div>

            <button
                onClick={(e) => onDelete(e, app.id)}
                className="button actionButton"
                title="Delete app"
            >
                X
            </button>
        </div>
    );
}

export default AdminAppListItem;
