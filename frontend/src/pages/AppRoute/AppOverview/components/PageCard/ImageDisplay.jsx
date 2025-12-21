import testImage from '../../../../../assets/test-image.jpg';
import styles from '../../AppOverview.module.css';

function ImageDisplay({ imageConfig }) {
    return (
        <div className={styles.imageContainer}>
            <img
                src={testImage}
                alt={imageConfig.title}
                className={styles.image}
            />
        </div>
    );
}

export default ImageDisplay;
