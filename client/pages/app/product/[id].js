import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Card, CardContent, Grid, TextField, Typography,Button } from '@mui/material';
import Layout from '../../../components/Layout';
import { useRouter } from 'next/router';
import * as productJson from '../../utils/Product.json';
import * as factoryJson from '../../utils/ProductFactory.json';

export default function ProductDetails() {

    const [factoryContract, setFactoryContract] = useState();
    const [productContract, setProductContract] = useState();
    const [amount, setAmount] = useState();
    const router = useRouter();
    const { id } = router.query;
    let signer;
    let provider;

    // Getting the instance of the Product contract
    useEffect(() => {
        const initProductContract = async () => {
            const factoryABI = factoryJson.abi;
            const factoryAddress = "0x63840a264045f5F87eC18dB64353990D67b225c7";
            provider = new ethers.providers.Web3Provider(ethereum);
            signer = provider.getSigner();
            setFactoryContract(new ethers.Contract(
                factoryAddress,
                factoryABI,
                signer
            ));
        }
        initProductContract();
    }, [])

    const handleAmount = (event) => {
        setAmount(event.target.value)
    }

    const participate = async () => {
        try {
            const productABI = productJson.abi;
            const productAddress = await factoryContract.products(id);
            setProductContract(new ethers.Contract(
                productAddress,
                productABI,
                signer
            ))
            const info = await productContract.productInfo();
            const price = Number(ethers.utils.formatEther((info.discountedPrice).toString()));
            const priceToPay = (amount * price).toString();
            const participateTx = await productContract.participate(amount, {value: ethers.utils.parseEther(priceToPay) });
            console.log(participateTx);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        
        <div style={{ 'margin-left' : '220px', 'margin-top' : '115px', 'margin-right' : '20px'}}>
        <Grid item sx={12} container spacing={4} justifyContent = "center">  
            <Grid item sx={4}>
                <Card sx={{marginTop: 8, background: '#F2BC07'}}>
                    <CardContent sx={{textAlign: 'center' }}>
                        <Typography sx={{marginLeft: 30, marginRight: 30, marginTop: 5, fontWeight: 'bold', fontSize: 24}}> Participate in the group buy </Typography>
                    </CardContent >
                    <CardContent sx={{textAlign: 'center' }}>
                        <TextField sx={{margin: 2}} label="Amount of Product to buy" variant="outlined" value={amount} onChange={handleAmount}/>
                        <Button onClick={participate} size='large' variant="contained" sx={{color: "#F2BC07", ":hover": {bgcolor: 'black'}, background: 'black', marginTop: 2, marginBottom: 3, padding: 2, marginLeft: 3}}>Participate</Button>
                    </CardContent>
                    {/* <CardContent sx={{textAlign: 'center'}}>
                        <Button variant='contained' size='large' onClick={createProduct} sx={{background: '#F2BC07', ":hover": {bgcolor: "#F2BC07"}, color: 'black', margin: 3, marginTop: 4, marginBottom: 8, width: '400px', height: '60px', fontSize: '20px'}} >Create Product</Button>
                    </CardContent> */}

                </Card>     
            </Grid> 
        </Grid>
    </div>
    )
}
ProductDetails.getLayout = function getLayout(page) {
    return (
      <Layout>
        {page}
      </Layout>
    )
}