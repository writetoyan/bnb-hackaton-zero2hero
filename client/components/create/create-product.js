import { useState } from 'react';
import { ethers } from 'ethers';
import { Card, CardContent, Grid, TextField, Typography,Button } from '@mui/material';
import * as productJson from '../../pages/utils/Product.json';

export default function ProposeCreate({factoryContract}) {

    const [companyAddress, setCompanyAddress] = useState();
    const [productName, setProductName] = useState("");
    const [marketPrice, setMarketPrice] = useState();
    const [discountedPrice, setDiscountedPrice] = useState();
    const [quantityTreshold, setQuantityTreshold] = useState();
    const [endDate, setEndDate] = useState();

    // Textfield handlers
    const handleCompanyAddress = event => {
        setCompanyAddress(event.target.value)
    }
    const handleProductName = event => {
        setProductName(event.target.value)
    }
    const handleMarketPrice = event => {
        setMarketPrice(event.target.value)
    }
    const handleDiscountedPrice = event => {
        setDiscountedPrice(event.target.value)
    }
    const handleQuantityTreshold = event => {
        setQuantityTreshold(event.target.value)
    }
    const handleEndDate = event => {
        setEndDate(event.target.value)
    }
    
    const createProduct = async () => {
        try {
            const createProductTx = await factoryContract.createProduct(
                companyAddress,
                ethers.utils.formatBytes32String(productName),
                ethers.utils.parseEther(marketPrice),
                ethers.utils.parseEther(discountedPrice),
                ethers.utils.parseEther(quantityTreshold),
                endDate
            )
            console.log(createProductTx)
            setCompanyAddress(""),
            setProductName(""),
            setMarketPrice(""),
            setDiscountedPrice(""),
            setQuantityTreshold(""),
            setEndDate("")
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <Grid item sx={12} container spacing={4} justifyContent = "center">  
            <Grid item sx={4}>
                <Card sx={{marginTop: 8}}>
                    <CardContent sx={{textAlign: 'center' }}>
                        <Typography sx={{margin: 3, fontWeight: 'bold', fontSize: 24}}> Create a Product for a group buy</Typography>
                        <Typography sx={{fontStyle: 'italic'}}> Give your requirements and if they are filled, close the deal! </Typography>
                    </CardContent >
                    <CardContent sx={{textAlign: 'center' }}>
                        <TextField sx={{margin: 2}} label="Company Wallet Address" variant="outlined" value={companyAddress} onChange={handleCompanyAddress}/>
                        <TextField sx={{margin: 2}} label="Product Name" variant="outlined" value={productName} onChange={handleProductName}/>
                        <TextField sx={{margin: 2}} label="Original market price" variant="outlined" value={marketPrice} onChange={handleMarketPrice}/>
                        <TextField sx={{margin: 2}} label="Discounted Price" variant="outlined" value={discountedPrice} onChange={handleDiscountedPrice}/>
                        <TextField sx={{margin: 2}} label="Quantity treshold" variant="outlined" value={quantityTreshold} onChange={handleQuantityTreshold}/>
                        <TextField sx={{margin: 2}} label="End date in unix time" variant="outlined" value={endDate} onChange={handleEndDate}/>
                    </CardContent>
                    <CardContent sx={{textAlign: 'center'}}>
                        <Button variant='contained' size='large' onClick={createProduct} sx={{margin: 3, marginTop: 4, marginBottom: 8, width: '400px', height: '60px', fontSize: '20px'}} >Create Product</Button>
                    </CardContent>

                </Card>     
            </Grid> 
        </Grid>
    )
}