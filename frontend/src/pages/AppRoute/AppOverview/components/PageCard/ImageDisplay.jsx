import styles from '../../AppOverview.module.css';

function ImageDisplay({ imageConfig }) {
    // if there is no image do not render this, so that cardContainer can flex  
    return (
        <>
        {imageConfig.image_url &&
            <div className={styles.imageContainer}>
                <img
                    src={imageConfig.image_url}
                    alt={imageConfig.title}
                    className={styles.image}
                />
            </div>   
        }
        </>
    
    );
}

export default ImageDisplay;
