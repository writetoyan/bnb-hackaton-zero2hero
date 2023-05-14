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
          <ul className={styles.footer__links}>
            <li>
              <a href="" className={styles.footer__link}>Link1</a>
            </li>
            <li>
              <a href="" className={styles.footer__link}>Link2</a>
            </li>
            <li>
              <a href="" className={styles.footer__link}>Link3</a>
            </li>
          </ul>
          <div class={styles.footer__socials}>
            <a href="" className={styles.footer__social}>
              {/* <i class="uil uil-github-alt social__icon"></i> */}
            </a>
            <a href="" className={styles.footer__social}>
              {/* <i class="fa-brands fa-codepen"></i> */}
            </a>
            <a href="" className={styles.footer__social}>
              {/* <i class="uil uil-instagram"></i> */}
            </a>
            <a href="" className={styles.footer__social}>
              {/* <i class="uil uil-linkedin-alt"></i> */}
            </a>
          </div>
        </div>
        <p className={styles.footer__copy}>© Copyright All rights reserved · 2023</p>
      </div>
    </div>
  );
}