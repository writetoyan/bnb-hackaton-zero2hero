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
    let provider;
    let signer;

    // Getting the instance of the Product contract
    useEffect(() => {
        const initProductContract = async () => {
            const factoryABI = factoryJson.abi;
            const factoryAddress = "0xc4664AfCd61582b8F36Fe4932473B25F3d3264bc";
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
            provider = new ethers.providers.Web3Provider(ethereum);
            signer = provider.getSigner();
            const productAddress = await factoryContract.products(id);
            setProductContract(new ethers.Contract(
                productAddress,
                productABI,
                signer
            ))
            const info = await productContract.productInfo();
            const price = Number(ethers.utils.formatEther((info.discountedPrice).toString()));
            const priceToPay = (amount * price).toString();
            const participateTx = await productContract.participate(amount, {value: ethers.utils.parseEther(priceToPay)});
            console.log(participateTx);
        } catch (error) {
            console.log(error);
        }
    }

    const conform = async () => {
        try {
            const productABI = productJson.abi;
            provider = new ethers.providers.Web3Provider(ethereum);
            signer = provider.getSigner();
            const productAddress = await factoryContract.products(id);
            setProductContract(new ethers.Contract(
                productAddress,
                productABI,
                signer
            ))
            const conformTx = await productContract.evaluateProduct(true);
            console.log(conformTx);
        } catch (error) {
            console.log(error);
        }
    }

    const nonConform = async () => {
        try {
            const productABI = productJson.abi;
            provider = new ethers.providers.Web3Provider(ethereum);
            signer = provider.getSigner();
            const productAddress = await factoryContract.products(id);
            setProductContract(new ethers.Contract(
                productAddress,
                productABI,
                signer
            ))
            const conformTx = await productContract.evaluateProduct(false, {value: ethers.utils.parseEther("0.1")});
            console.log(conformTx);
        } catch (error) {
            console.log(error);
        }
    }

    const withdraw = async () => {
        try {
            const productABI = productJson.abi;
            provider = new ethers.providers.Web3Provider(ethereum);
            signer = provider.getSigner();
            const productAddress = await factoryContract.products(id);
            setProductContract(new ethers.Contract(
                productAddress,
                productABI,
                signer
            ))
            const withdrawTx = await productContract.withdrawProductOfSells();
            console.log(withdrawTx);
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
        <div style={{ 'margin-left' : '220px', 'margin-top' : '115px', 'margin-right' : '20px', 'margin-bottom': '20px'}}>
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
                    </Card>     
                </Grid> 
            </Grid>
         </div>
         <div style={{ 'margin-left' : '220px', 'margin-top' : '20px', 'margin-right' : '20px', 'margin-bottom': '50px'}}>
            <Grid item sx={12} container spacing={4} justifyContent = "center">  
                <Grid item sx={4}>
                    <Card sx={{marginTop: 8, background: '#F2BC07'}}>
                        <CardContent sx={{textAlign: 'center' }}>
                            <Typography sx={{marginLeft: 30, marginRight: 30, marginTop: 5, marginBottom: 3, fontWeight: 'bold', fontSize: 24}}> Evaluate the product you bought </Typography>
                            <Typography sx={{fontStyle: 'italic'}}> Evaluation starts 14 days after the sells end </Typography>
                            <Typography sx={{fontStyle: 'italic'}}> If the product is not arrived or is not conform. Make it know! The money will be locked on the contract</Typography>
                        </CardContent >
                        <CardContent sx={{textAlign: 'center' }}>
                            <Button onClick={conform} size='large' variant="contained" sx={{color: "#F2BC07", ":hover": {bgcolor: 'black'}, background: 'black', marginBottom: 4, padding: 2, marginLeft: 3}}>CONFORM</Button>
                            <Button onClick={nonConform} size='large' variant="contained" sx={{color: "#F2BC07", ":hover": {bgcolor: 'black'}, background: 'black', marginBottom: 4, padding: 2, marginLeft: 12}}>NOT CONFORM</Button>
                            <Typography sx={{fontStyle: 'italic'}}> To prevent abuse, you will need to lock 0.1 BNB to vote for non conformity</Typography>
                            <Typography sx={{fontStyle: 'italic'}}> To encourage people to vote for conformity if the product is conform</Typography>
                            <Typography sx={{fontStyle: 'italic'}}> If the conform vote wins, they will share between them, the amount locked from people who voted non conform</Typography>
                        </CardContent>
                    </Card>     
                </Grid> 
            </Grid>
         </div>
         <div style={{ 'margin-left' : '220px', 'margin-top' : '20px', 'margin-right' : '20px', 'margin-bottom': '50px'}}>
            <Grid item sx={12} container spacing={4} justifyContent = "center">  
                <Grid item sx={4}>
                    <Card sx={{marginTop: 8, background: '#F2BC07'}}>
                        <CardContent sx={{textAlign: 'center' }}>
                            <Typography sx={{marginLeft: 30, marginRight: 30, marginTop: 5, marginBottom: 3, fontWeight: 'bold', fontSize: 24}}> Withdraw product of sells - only the company can withdraw</Typography>
                            <Typography sx={{fontStyle: 'italic'}}> The fund can be withdrawn after the evaluation period - 14 days</Typography>
                            <Typography sx={{fontStyle: 'italic'}}> The company will be able to withdraw funds only if there is less thant 30% of people who evaluated non conform </Typography>
                        </CardContent >
                        <CardContent sx={{textAlign: 'center' }}>
                            <Button onClick={withdraw} size='large' variant="contained" sx={{color: "#F2BC07", ":hover": {bgcolor: 'black'}, background: 'black', marginBottom: 4, padding: 2, marginLeft: 3}}>WITHDRAW FUNDS</Button>
                        </CardContent>
                    </Card>     
                </Grid> 
            </Grid>
         </div>
         </>
    )
}
ProductDetails.getLayout = function getLayout(page) {
    return (
      <Layout>
        {page}
      </Layout>
    )
}