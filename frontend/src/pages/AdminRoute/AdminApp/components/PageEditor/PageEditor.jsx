import { usePageEditor } from '../../hooks/usePageEditor';
import styles from "../../AdminApp.module.css";
import PageSettings from "./PageSettings";
import InputsSection from "./InputsSection";
import CalculationsSection from "./CalculationsSection";

function PageEditor({ page, onUpdatePage, onDeletePage }) {
  const {
    handleMainFieldChange,
    handleInputChange,
    addInput,
    removeInput,
    handleCalcChange,
    addCalc,
    removeCalc
  } = usePageEditor(page, onUpdatePage);

  if (!page) {
    return (
      <div className={styles.pageEditor} style={{ display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}>
        <p>There are no pages. Add a page.</p>
      </div>
    );
  }

  // --- RENDER ---
  return (
    <div className={styles.pageEditor}>

      <PageSettings
        page={page}
        onChange={handleMainFieldChange}
      />

      <hr />

      <InputsSection
        inputs={page.inputs}
        onInputChange={handleInputChange}
        onAddInput={addInput}
        onRemoveInput={removeInput}
      />

      <hr />

      <CalculationsSection
        calculations={page.calculations}
        onCalcChange={handleCalcChange}
        onAddCalc={addCalc}
        onRemoveCalc={removeCalc}
      />

      <div style={{ marginTop: '20px', borderTop: '1px solid #ddd', paddingTop: '10px' }}>
        <button
          className={`${styles.button} ${styles.actionButton}`}
          onClick={() => {
            if (window.confirm("Are you sure you want to delete this page?")) {
              onDeletePage(page._uuid);
            }
          }}
        >
          Delete Page
        </button>
      </div>

    </div>
  );
}

export default PageEditor;