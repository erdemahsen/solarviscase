import React from "react";
import styles from "../AdminApp.module.css";

function AdminHeader({ appName, onSave, isDirty, onBack }) {
    return (
        <div className={styles.adminHeader}>
            <button className={styles.button} onClick={onBack}>← Back</button>
            <h2>Editing: {appName}</h2>
            <button
                className={`${styles.button} ${styles.actionButton}`}
                onClick={onSave}
                disabled={!isDirty}
                style={{ opacity: isDirty ? 1 : 0.5 }}
            >
                Save
            </button>
        </div>
    );
}

export default AdminHeader;
