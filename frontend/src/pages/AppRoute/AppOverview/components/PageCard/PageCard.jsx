import styles from '../../AppOverview.module.css';
import ImageDisplay from './ImageDisplay';
import InputsSection from './InputsSection';
import ResultsSection from './ResultsSection';
import ActionButtons from './ActionButtons';

function PageCard({ pageConfig, results, formData, handleInputChange, prevPage, nextPage, isResultPage, loading }) {
    const isFirstPage = pageConfig.order_index === 0


    return (
        <div className={styles.pageContentWrapper}>
            <ImageDisplay imageConfig={pageConfig} />

            <div className={styles.cardContainer}>
                <div className={styles.header}>
                    <h2 className={styles.title}>{pageConfig.title}</h2>
                    <p className={styles.description}>{pageConfig.description}</p>
                </div>

                <InputsSection
                    inputs={pageConfig.inputs}
                    formData={formData}
                    handleInputChange={handleInputChange}
                />

                <ResultsSection
                    calculations={pageConfig.calculations}
                    results={results}
                    loading={loading}
                />

                <ActionButtons
                    prevPage={prevPage}
                    nextPage={nextPage}
                    isFirstPage={isFirstPage}
                    isResultPage={isResultPage}
                />
            </div>
        </div>
    )
}

export default PageCard