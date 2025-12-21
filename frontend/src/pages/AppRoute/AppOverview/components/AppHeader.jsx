import React from "react";
import styles from "../AppOverview.module.css";

function AppHeader({ title, currentPage, totalPages, onBack }) {
    // Calculate progress percentage
    const progress = totalPages > 0 ? (currentPage / totalPages) * 100 : 0;

    return (


        <div className={styles.headerContainer}>
            <div className={styles.headerContainerUpper}>
                <button className="button" onClick={onBack}>← Back to menu</button>

                <div>
                    Page {currentPage} of {totalPages}
                </div>

                <h2>{title}</h2>
            </div>

            <div className={styles.progressContainer}>
                <div
                    className={styles.progressBar}
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
}

export default AppHeader;
