import { useState } from 'react';
import { ethers } from 'ethers';
import { Card, CardContent, Grid, TextField, Typography,Button } from '@mui/material';

export default function ProposeCreate({factoryContract}) {

    const [companyAddress, setCompanyAddress] = useState();
    const [productName, setProductName] = useState("");
    const [queryPrice, setQueryPrice] = useState();

    const handleCompanyAddress = event => {
        setCompanyAddress(event.target.value)
    }
    const handleProductName = event => {
        setProductName(event.target.value)
    }
    const handleQueryPrice = event => {
        setQueryPrice(event.target.value)
    }

    const proposeHandle = async () => {
        const proposeTx = await factoryContract.requestCreateProduct(companyAddress, ethers.utils.formatBytes32String(productName), ethers.utils.parseEther(queryPrice));
        console.log(proposeTx);
        setCompanyAddress("");
        setProductName("");
        setQueryPrice("");
    }
    const getPreProductAddress = async () => {
        const proposeTx = await factoryContract.preProducts(0);
        console.log(proposeTx)
    }

    return (
        <Grid item sx={12} container spacing={4} justifyContent = "center">  
        <Grid item sx={4}>
            <Card sx={{margin: 8}}>
                <CardContent sx={{textAlign: 'center' }}>
                    <Typography sx={{margin: 3, fontWeight: 'bold', fontSize: 24}}> Propose to your favorite company to create a Product for a group buy</Typography>
                    <Typography sx={{fontStyle: 'italic'}}> Group all the interest for a product at a given price and convince them to sell it at that price </Typography>
                </CardContent>
                <CardContent sx={{mx: 4}}>
                    <TextField sx={{margin: 2}} label="Company Wallet Address" variant="outlined" value={companyAddress} onChange={handleCompanyAddress}/>
                    <TextField sx={{margin: 2}} label="Product Name" variant="outlined" value={productName} onChange={handleProductName}/>
                    <TextField sx={{margin: 2}} label="Query Price" variant="outlined" value={queryPrice} onChange={handleQueryPrice}/>
                    <Button sx={{marginTop: 3, marginLeft: 2}} variant='outlined' size="large" onClick={proposeHandle}>Propose</Button>
                </CardContent>
            </Card>      
        </Grid> 
    </Grid>
    )
}