import styles from '../styles/soulboundBanner.module.css'
import Button from '@mui/material/Button'

export default function SoulboundBanner() {
  return (
   <div className={styles.bannerCoupon}>
      <div className={styles.wrapperText}>
        <p className={styles.p}>Get your soulbound token and use it through different social dApps</p>
        <p className={styles.p2}>Enter your info once, updated it if needed and build your reputation</p>
        <Button href="app/mint" size="large" variant="contained" sx={{background: '#F2BC07', ":hover": {bgcolor: "#F2BC07"}, color: 'black', margin: 5}}>Mint your DealChain Soul </Button>
      </div>
   </div>
  );
}