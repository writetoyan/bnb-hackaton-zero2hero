import { useState } from 'react';
import { ethers } from 'ethers';
import { Card, CardContent, Grid, TextField, Typography,Button } from '@mui/material';
import * as preProductJson from '../../pages/utils/PreProduct.json';

export default function ProposeCreate({factoryContract}) {

    const [companyAddress, setCompanyAddress] = useState();
    const [productName, setProductName] = useState("");
    const [queryPrice, setQueryPrice] = useState();
    const [marketPrice, setMarketPrice] = useState();
    const [quantityTreshold, setQuantityTreshold] = useState();
    const [endDate, setEndDate] = useState();
    const [id, setId] = useState();
    const [preProductContract, setPreProductContract] = useState();
    const [numberOfPotentialBuyer, setNumberOfPotentialBuyer] = useState();

    // Textfield handlers
    const handleCompanyAddress = event => {
        setCompanyAddress(event.target.value)
    }
    const handleProductName = event => {
        setProductName(event.target.value)
    }
    const handleQueryPrice = event => {
        setQueryPrice(event.target.value)
    }
    const handleId = event => {
        setId(event.target.value)
    }
    const handleMarketPrice = event => {
        setMarketPrice(event.target.value)
    }
    const handleQuantityTreshold = event => {
        setQuantityTreshold(event.target.value)
    }
    const handleEndDate = event => {
        setEndDate(event.target.value)
    }

    // Create a preProduct to show interest to a targeted company
    const proposeHandle = async () => {
        const proposeTx = await factoryContract.requestCreateProduct(companyAddress, ethers.utils.formatBytes32String(productName), ethers.utils.parseEther(queryPrice));
        console.log(proposeTx);
        setCompanyAddress("");
        setProductName("");
        setQueryPrice("");
    }
    
    // Getting the address of the preProduct contract calling the array recording all the contracts deployed on the factory contract 
    // and using the index from the table.
    const getContract = async (index) => {
        try {
        const preProductABI = preProductJson.abi;
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const preProductAddress = await factoryContract.preProducts(index);
        setPreProductContract(new ethers.Contract(
            preProductAddress,
            preProductABI,
            signer
        ));
        } catch (error) {
        console.log(error);
        }
    }

    // Only the company can call this function and create a Product for group buy
    const acceptHandler = async () => {
        try {
            await getContract(id);
            await preProductContract.acceptCreateProductOffer(marketPrice, quantityTreshold, endDate);
            setId("");
            setMarketPrice("");
            setQuantityTreshold("");
            setEndDate("");
        } catch (error) {
            console.error(error);
        } 
    }

    const checkHandler = async () => {
        try {
            await getContract(id);
            setNumberOfPotentialBuyer((await preProductContract.getNumberOfPotentialBuyer()).toString());
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
                        <Typography sx={{margin: 3, fontWeight: 'bold', fontSize: 24}}> Propose to your favorite company to create a Product for a group buy</Typography>
                        <Typography sx={{fontStyle: 'italic'}}> Group all the interest for a product at a given price and convince them to sell it at that price </Typography>
                    </CardContent >
                    <CardContent sx={{textAlign: 'center' }}>
                        <TextField sx={{margin: 2}} label="Company Wallet Address" variant="outlined" value={companyAddress} onChange={handleCompanyAddress}/>
                        <TextField sx={{margin: 2}} label="Product Name" variant="outlined" value={productName} onChange={handleProductName}/>
                        <TextField sx={{margin: 2}} label="Query Price" variant="outlined" value={queryPrice} onChange={handleQueryPrice}/>
                        <Button sx={{background: '#F2BC07', ":hover": {bgcolor: "#F2BC07"}, color: 'black', marginTop: 3, marginLeft: 2}} variant='outlined' size="large" onClick={proposeHandle}>Propose</Button>
                    </CardContent>
                </Card>     
                <Card sx={{background: '#F2BC07'}} >
                    <CardContent sx={{textAlign: 'center' }}>
                        <Typography sx={{margin: 3, fontWeight: 'bold', fontSize: 24}}> Accept to create a Product - Please complete the information below</Typography>
                        <Typography sx={{fontStyle: 'italic'}}> ONLY THE COMPANY DESIGNATED CAN ACCEPT </Typography>
                    </CardContent>
                    <CardContent sx={{mx: 4}}>
                        <TextField sx={{margin: 2}} size='small' label="ID..." variant="filled" value={id} onChange={handleId}/>
                        <TextField sx={{margin: 2}} size='small' label="READ ONLY - N° OF INTEREST" variant="standard" value={numberOfPotentialBuyer} />

                        <Button sx={{background: '#F2BC07', ":hover": {bgcolor: "#F2BC07"}, color: 'black', marginTop: 3, marginLeft: 2}} variant='outlined' onClick={checkHandler}>CHECK INTEREST</Button>
                    </CardContent>
                    <CardContent sx={{mx: 4}}>
                        <TextField sx={{margin: 2}} size='small' label="Original market price" variant="filled" value={marketPrice} onChange={handleMarketPrice}/>
                        <TextField sx={{margin: 2}} size='small' label="Quantity treshold" variant="filled" value={quantityTreshold} onChange={handleQuantityTreshold}/>
                        <TextField sx={{margin: 2}} size='small' label="End date in unix time" variant="filled" value={endDate} onChange={handleEndDate}/>
                        <Button sx={{background: '#F2BC07', ":hover": {bgcolor: "#F2BC07"}, color: 'black', marginTop: 3, marginLeft: 2}} variant='outlined' onClick={acceptHandler}>CREATE</Button>
                    </CardContent>
                </Card>     
            </Grid> 
        </Grid>
    </div>
    )
}