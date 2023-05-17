import styles from '../../styles/Home.module.css'
import SoulboundBanner from '../../components/SoulboundBanner'
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Product from '../../components/Product';
import BannerCategory from '../../components/BannerCategory';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import * as factoryJson from '../utils/ProductFactory.json';
import Layout from '../../components/Layout';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function Home() {

  const [factoryContract, setFactoryContract] = useState();
  const [productCreated, setProductCreated] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  let provider;

  useEffect(() => {
    const initContract = async () => {
      const { ethereum } = window;
      if (ethereum) {
        try {
          const factoryAddress = "0xc4664AfCd61582b8F36Fe4932473B25F3d3264bc";
          const factoryABI = factoryJson.abi;
          provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          setFactoryContract(new ethers.Contract(
            factoryAddress,
            factoryABI,
            signer
          ));
        } catch (error) {
          console.error(error)
        }
      }
    }
    initContract();
  }, [])

  const getProductCreated = async () => {
    let filter = await factoryContract.filters.NewProductCreated();
    let events = await factoryContract.queryFilter(filter);
    events.forEach((event) => {
      setProductCreated(prevArray => [...prevArray, event.args])
      console.log(productCreated)
    });
  }

  const handleTrendingSales = async () => {
    getProductCreated();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 8000)
  } 

  return (
    <div style={{ 'margin-left' : '220px', 'margin-top' : '115px', 'margin-right' : '20px'}}>
      <SoulboundBanner />
      
      <div className={styles.trendingSaleList}>
        <div>
        <h1 className={styles.h1} >Trending Sales</h1>
        <Button onClick={handleTrendingSales} disabled={isLoading} sx={{background: '#F2BC07', ":hover": {bgcolor: "#F2BC07"}, color: 'black', marginBottom: 3, marginLeft: 2}} variant='outlined' size="large">
           {isLoading ? <CircularProgress /> : 'REVEAL OFFERS'}
        </Button>

        </div>
        <div className={styles.trendingSales}>
          <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            {productCreated.map((product, index) => (
              <Grid item xs={6} key={index}>
                <Product 
                  factoryContract={factoryContract}
                  company={product.company} 
                  name={ethers.utils.parseBytes32String(product.name)} 
                  price={ethers.utils.formatEther(product.price)}
                  index={index}
                />
              </Grid>
            ))}
          </Grid>
        </div>
      </div>
      <div className={styles.categoryList}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={6}>
            <BannerCategory />
          </Grid>
          <Grid item xs={6}>
            <BannerCategory />
          </Grid>
        </Grid>
      </div>
      <div className={styles.newestSaleList}>
        <h1 className={styles.h1}>Newest Sales</h1>
        <div className={styles.trendingSales}>
          <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          </Grid>
        </div>
      </div>
    </div>
  )
}
Home.getLayout = function getLayout(page) {
  return (
    <Layout>
      {page}
    </Layout>
  )
}
