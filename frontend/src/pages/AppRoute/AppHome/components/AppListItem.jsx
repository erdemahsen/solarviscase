import React from "react";
import styles from "../AppHome.module.css";

function AppListItem({ app, onClick }) {
    return (
        <div
            className={styles.appListItem}
            onClick={() => onClick(app.id)}
        >
            <div>
                <h3>{app.app_name}</h3>
                <p>num of pages: {app.pages.length}</p>
            </div>

        </div>
    );
}

export default AppListItem;
