import { Grid } from '@mui/material';
import styles from '../styles/product.module.css'
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import Button from '@mui/material/Button';

export default function Product({contract}) {

  return (
    <div>
      <a href="">
        <Grid container className={styles.product}>
          <Grid item >
            <img src='/assets/product.png' className={styles.productImg} />
          </Grid>
          <Grid item styles={{ 'margin-left': '5px' }} >
            <h1 className={styles.productName}>Sale 1</h1>
            <div className={styles.createdBy}>By 0x****</div>
            <div className={styles.category}>Tech</div>
            <div className={styles.price}>$0.1</div>
            <div className={styles.saleQuantity}>15 Sales</div>
          </Grid>
        </Grid>
      </a>
    </div>
  );
}