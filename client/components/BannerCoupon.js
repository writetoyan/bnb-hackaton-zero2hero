import styles from '../styles/bannerCoupon.module.css'

export default function BannerCoupon() {
  return (
   <div className={styles.bannerCoupon}>
      <div className={styles.wrapperText}>
        <p className={styles.p}>Discover some great offers . Get up to 15% off for Welcome !!</p>
        <a href="" className={styles.btn}>
          Get Coupon
        </a>
      </div>
   </div>
  );
}