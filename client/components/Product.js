import { Grid, TextField } from '@mui/material';
import styles from '../styles/product.module.css'
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import Button from '@mui/material/Button';
import * as productJson from '../pages/utils/Product.json'
import Link from 'next/link'

export default function Product({factoryContract, company, name, price, index}) {

  const [productContract, setProductContract] = useState();
  const [quantitySold, setQuantitySold] = useState();
  const [showDetail, setShowDetail] = useState(false);
  const [treshold, setTreshold] = useState();
  const [amount, setAmount] = useState();

 const handleAmount = event => {
  event.preventDefault();
  setAmount(event.target.value)
 }

 // To show the amount sold and the treshold
 const updateInfo = async (e) => {
  e.preventDefault();
  setShowDetail(true)
   try {
     getContract(index);
     setQuantitySold((await productContract.quantitySold()).toString());
     const struct = await productContract.productInfo();
     setTreshold((ethers.utils.formatEther((struct.quantityTreshold).toString())));
   } catch (error) {
     console.error(error);
   }
 } 

 //Get an instance of the product contract
  const getContract = async (index) => {
    try {
    const productABI = productJson.abi;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const productAddress = await factoryContract.products(index);
    setProductContract(new ethers.Contract(
      productAddress,
      productABI,
      signer
    ));
    } catch (error) {
    console.log(error);
    }
  }

  // To participate in the group buy
  const participate = async () => {

    // try {
    //   getContract(index);
    //   await productContract.participate(1, {value: ethers.utils.parseEther(price)});
    // } catch (error) {
    //   console.error(error);
    // }
  }


  return (
    <div>
      <a href="">
        <Grid container className={styles.product}>
          <Grid item >
            <img src='/assets/product.png' className={styles.productImg} />
          </Grid>
          <Grid item styles={{ 'margin-left': '5px' }} >
            <h1 className={styles.productName}>{name}</h1>
            <div className={styles.createdBy}>By {company}</div>
            <div className={styles.price}>Discounted price: {price} BNB</div>
            <Button onClick={updateInfo}>Update details of the sells</Button>
            {showDetail ? 
              <>
                <div className={styles.saleQuantity}>Quantity sold: {quantitySold}</div>
                <div className={styles.saleQuantity}>Quantity treshold: {treshold}</div>
              </>
              : <div></div>}
          </Grid>
          <Link href={`/app/product/${index}`}> 
            <Button onClick={participate}>Participate in the sell</Button>
          
          </Link>
        </Grid>
      </a>
    </div>
  );
}