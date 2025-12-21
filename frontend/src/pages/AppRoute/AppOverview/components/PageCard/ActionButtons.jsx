import styles from '../../AppOverview.module.css';

function ActionButtons({ prevPage, nextPage, isResultPage }) {
    return (
        <div className={styles.actions}>
            <button
                className="button actionButton"
                onClick={prevPage}
                disabled={!prevPage}
                style={{ visibility: prevPage ? 'visible' : 'hidden' }}
            >
                Back
            </button>
            <button
                className="button"
                onClick={nextPage}
            >
                {isResultPage ? "Finish" : "Next"}
            </button>
        </div>
    );
}

export default ActionButtons;
