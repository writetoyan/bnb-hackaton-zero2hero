import LayoutWebsite from "../components/LayoutWebsite";
import styles from '../styles/website.module.css'


export default function Website() {
  return(
    <div className={styles.website}>
      <h1>Empower e-commerce with the blockchain technology to have more transparancy, security </h1>
      <h3>We are targeting group buying business model. Companies can offer product sells on discount if a treshold is obtained or buyers can group together to offer to buy a product from a target company.</h3>
      IMAGE
      3 or 6 Icon for our power
      How it works
      step by step
      Partner
      Faq
      Form
      Deal with us
      Footer
    </div>
  );

}
Website.getLayout = function getLayout(page) {
  return (
    <LayoutWebsite>
      {page}
    </LayoutWebsite>
  )
}