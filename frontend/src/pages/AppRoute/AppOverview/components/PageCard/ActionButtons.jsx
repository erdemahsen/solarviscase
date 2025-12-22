import styles from '../../AppOverview.module.css';

function ActionButtons({ prevPage, nextPage, isFirstPage ,isResultPage }) {
    console.log
    return (
        <div className={styles.actions}>
            <button
                className="button actionButton"
                onClick={prevPage}
                disabled={!prevPage}
                style={{ visibility: isFirstPage ? 'hidden' : 'visible' }}
            >
                Previous
            </button>
            <button
                className="button"
                onClick={nextPage}
                style={{ visibility: isResultPage ? 'hidden' : 'visible' }}
            >
                Next
            </button>
        </div>
    );
}

export default ActionButtons;
