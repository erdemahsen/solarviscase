import { useParams, useNavigate } from 'react-router-dom';
import PageCard from './components/PageCard/PageCard';
import AppHeader from './components/AppHeader';
import { useAppOverview } from './hooks/useAppOverview';
import styles from './AppOverview.module.css';

function AppOverview() {
    const { appId } = useParams();
    const navigate = useNavigate();
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

            <AppHeader
                title={appConfig.app_name}
                currentPage={currentPageIndex + 1}
                totalPages={appConfig.pages.length}
                onBack={() => navigate('/app/')}
            />

            <PageCard
                pageConfig={currentPageConfig}
                results={backendResults}
                formData={formData}
                handleInputChange={handleInputChange}
                prevPage={prevPage}
                nextPage={nextPage}
                loading={loading}
                isResultPage={isResultPage}
            />
        </div>
    )
}

export default AppOverview