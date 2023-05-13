import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import BannerCoupon from '../components/BannerCoupon'
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Product from '../components/Product';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function Home() {
  return (
    <div style={{ 'margin-left' : '200px', 'margin-top' : '30px'}}>
      <BannerCoupon />
      <h1 className={styles.h1}>Trending Sales</h1>
      <div className={styles.trendingSales}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={6}>
            <Product />
          </Grid>
          <Grid item xs={6}>
            <Product />
          </Grid>
          <Grid item xs={6}>
            <Product />
          </Grid>
          <Grid item xs={6}>
            <Product />
          </Grid>
        </Grid>
      </div>
    </div>
  )
}
