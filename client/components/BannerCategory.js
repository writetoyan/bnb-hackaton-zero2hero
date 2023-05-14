import styles from '../styles/bannerCategory.module.css'

export default function BannerCategory() {
  return (
   <div className={styles.bannerCategory}>
      <div className={styles.wrapperText}>
        <p className={styles.p}>Discover some great offers . Get up to 15% off for Welcome !!</p>
      </div>
   </div>
  );
}