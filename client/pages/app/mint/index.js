import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Card, CardContent, Grid, TextField, Typography,Button } from '@mui/material';
import Layout from '../../../components/Layout';
import * as soulboundJson from '../../utils/DealChainSoul.json'
import * as factoryJson from '../../utils/ProductFactory.json';


export default function MintSoul() {

    const [name, setName] = useState();
    const [deliveryAddress, setDeliveryAddress] = useState("");
    const [soulboundContract, setSoulboundContract] = useState();
    const [factoryContract, setFactoryContract] = useState();
    
    let provider;

    // Textfield handlers
    const handleName = event => {
        setName(event.target.value)
    }
    const handleDeliveryAddress = event => {
        setDeliveryAddress(event.target.value)
    }

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
    
    const mintSoul = async () => {
        try {
            provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const soulboundABI = soulboundJson.abi;
            const soulboundAddress = await factoryContract.dealChainSoul();
            setSoulboundContract(new ethers.Contract(
                soulboundAddress,
                soulboundABI,
                signer
            ))
            const mintTx = await soulboundContract.mint(name, deliveryAddress);
            console.log(mintTx)
            setName(""),
            setDeliveryAddress("")
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
                            <Typography sx={{margin: 3, fontWeight: 'bold', fontSize: 24}}> Mint your soulbound token</Typography>
                            <Typography sx={{fontStyle: 'italic'}}> Each address can only mint one and it is not transferable </Typography>
                        </CardContent >
                        <CardContent sx={{textAlign: 'center' }}>
                            <TextField sx={{margin: 2}} label="Name" variant="outlined" value={name} onChange={handleName}/>
                            <TextField sx={{margin: 2}} label="Delivery Address" variant="outlined" value={deliveryAddress} onChange={handleDeliveryAddress}/>
                        </CardContent>
                        <CardContent sx={{textAlign: 'center'}}>
                            <Button variant='contained' size='large' onClick={mintSoul} sx={{background: '#F2BC07', ":hover": {bgcolor: "#F2BC07"}, color: 'black', margin: 3, marginTop: 4, marginBottom: 8, width: '400px', height: '60px', fontSize: '20px'}} >MINT DealChain Soul</Button>
                        </CardContent>

                    </Card>     
                </Grid> 
            </Grid>
        </div>
    )
}
MintSoul.getLayout = function getLayout(page) {
    return (
      <Layout>
        {page}
      </Layout>
    )
  }