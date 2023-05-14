import styles from '../styles/footer.module.css'


export default function Footer() {
  return (
    <div className={styles.footer}>
      <div className={styles.content}>
        <div className={styles.container}>
          <div className={styles.footer__label}>
            <h2 className={styles.footer__title}>DEALCHAIN</h2>
            <span className={styles.footer__subtitle}>Empower e-commerce 
            with the blockchain technology to have more transparancy, 
            security and efficiency when buying online</span>
          </div>
        </div>
        <p className={styles.footer__copy}>© Copyright All rights reserved · 2023</p>
      </div>
    </div>
  );
}