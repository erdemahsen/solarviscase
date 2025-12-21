import { useParams } from 'react-router-dom';
import PageCard from './components/PageCard';
import { useAppOverview } from './hooks/useAppOverview';
import styles from './AppOverview.module.css';

function AppOverview() {
    const { appId } = useParams();
    const {
        appConfig,
        loading,
        currentPageIndex,
        formData,
        backendResults,
        handleInputChange,
        prevPage,
        nextPage
    } = useAppOverview(appId);

    if (!appConfig) {
        return <p>Loading the app configuration...</p>
    }

    const currentPageConfig = appConfig.pages[currentPageIndex];
    const isResultPage = appConfig.pages.length === currentPageIndex + 1;

    return (
        <div className={styles.appOverviewContainer}>
            {loading && <div className={styles.loadingOverlay}>Calculating...</div>}

            <PageCard
                pageConfig={currentPageConfig}
                results={backendResults}
                formData={formData}
                handleInputChange={handleInputChange}
                prevPage={prevPage}
                nextPage={nextPage}
                isResultPage={isResultPage}
            />

            {/* Debug/Overview Button */}
            <button
                className="button actionButton"
                onClick={() => console.log("backend results are : ", backendResults)}
            >
                See backend results array
            </button>
        </div>
    )
}

export default AppOverview