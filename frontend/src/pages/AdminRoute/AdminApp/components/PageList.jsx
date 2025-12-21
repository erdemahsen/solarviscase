import React from "react";
import PageCard from "./PageCard";
import styles from "../AdminApp.module.css";

function PageList({ pages, activePageUuid, onSelectPage, onAddPage, onDeletePage }) {
    return (
        <div className={styles.pageList}>
            {pages.map((page) => (
                <PageCard
                    key={page._uuid}
                    page={page}
                    isActive={page._uuid === activePageUuid}
                    onClick={() => onSelectPage(page._uuid)}
                    onDelete={() => onDeletePage(page._uuid)}
                />
            ))}

            <PageCard onClick={onAddPage}>
                + Add Page
            </PageCard>
        </div>
    );
}

export default PageList;
