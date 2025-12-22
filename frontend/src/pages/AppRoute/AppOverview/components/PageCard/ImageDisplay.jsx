import styles from '../../AppOverview.module.css';

function ImageDisplay({ imageConfig }) {
    // if there is no image do not render this, so that cardContainer can flex  
    return (
        <>
            {imageConfig.image_url &&
                <div className={styles.imageContainer}>
                    <img
                        src={`${import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8001/"}/${imageConfig.image_url.replace(/^\//, '')}`}
                        alt={imageConfig.title}
                        className={styles.image}
                    />
                </div>
            }
        </>

    );
}

export default ImageDisplay;
