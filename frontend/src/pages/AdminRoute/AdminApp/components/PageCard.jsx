import React from "react";
import styles from "../AdminApp.module.css";

function PageCard({ page, isActive, onClick, children }) {
    return (
        <div
            onClick={onClick}
            className={`${styles.pageCard} ${isActive ? styles.pageCardActive : ''}`}
        >
            {children || page?.title}

        </div>
    );
}

export default PageCard;
