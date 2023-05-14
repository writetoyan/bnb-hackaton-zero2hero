import LayoutWebsite from "../components/LayoutWebsite";
import styles from '../styles/website.module.css'
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import SecurityIcon from '@mui/icons-material/Security';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import TravelExploreOutlinedIcon from '@mui/icons-material/TravelExploreOutlined';
import Input from '@mui/joy/Input';
import FormControl from '@mui/joy/FormControl';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function Website() {
  return(
    <div className={styles.website}>
      <img src='/assets/website-logo.png' className={styles.productImg1} />
      <h1 className={styles.h1}>Empower e-commerce with the blockchain technology to have more transparency and security </h1>
      <p className={styles.subtitle}>
        We are targeting group buying business model. Companies can offer product sells on discount if a treshold is obtained or buyers can group together to offer to buy a product from a target company.<br/>
      <Button variant="contained" href="/app" align="center" style={{
        'background': '#F2BC07', 'color': '#0C0E12', "margin":"30px 0" }}>Launch APP</Button>
      </p>
      <img src='/assets/website.png' className={styles.productImg} />
      <h2 className={styles.h2s} > 
        Companies can offer product sells on discount
      </h2>
      <p>
        Buyers can group together to offer to buy a product from a company
      </p>
      <Grid className={styles.iconGrid} container spacing={1} columns={16}>
        <Grid item xs={4}>
          <TravelExploreOutlinedIcon className={styles.icon} />
          <h3>Transparency</h3>
           You can track your buy, follow where your money is.
        </Grid>
        <Grid item xs={4}>
          <SecurityIcon className={styles.icon} />
          <h3>Security</h3>
          Secure on the Blockchain. Money management with  our robust smartcontract
        </Grid>
        <Grid item xs={4}>
          <SettingsSuggestIcon className={styles.icon} />
          <h3>Efficiency</h3>
          No more credit card fees. Buy or sell fast.
        </Grid>
        <Grid item xs={4}>
          <CheckCircleOutlineRoundedIcon className={styles.icon} />
          <h3>Conformity</h3>
          No more surprise, the product is legit with all the conformity. 
        </Grid>
      </Grid>
      <img src='/assets/how-it-works.png' className={styles.productImg3} />
  
      <div className={styles.dealsInfo}>
        <Grid className={styles.newsletter} container spacing={1} columns={16}
          alignItems="center"
          justifyContent="center">
          <Grid item xs={8}>
            <h1 className={styles.h2} >
              Deal with us
            </h1>
            Join our newsletter to get top deals before anyone else.
          </Grid>
          <Grid item xs={8}>
            <Grid container xs={16}>
              <Grid item xs={6}>
              <Input
                placeholder="Your email"
                className={styles.input}
              >
              </Input>
              </Grid >
              <Grid item xs={6} alignItems="left">
                <Button
                  style={{ 'background': '#0C0E12', 'color': '#F2BC07' }}
                  variant="solid"
                  color="primary"
                  type="submit"
                  sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                >
                  Subscribe
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
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