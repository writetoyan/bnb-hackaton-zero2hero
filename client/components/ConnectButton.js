import { ethers } from 'ethers';
import { useState } from 'react';
import { Button } from '@mui/material';


export default function ConnectButton() {

    const [ isConnected, setIsConnected ] = useState(false);
    const [ signer, setSigner ] = useState();

     const connect = async () => {
        if (typeof window.ethereum !== undefined) {
            try {
                await ethereum.request({ method: "eth_requestAccounts" })
                setIsConnected(true);
                let connectButton = document.getElementById('connectButton');
                connectButton.innerHTML = 'Wallet connected!';
                let connectedProvider = new ethers.providers.Web3Provider(window.ethereum);
                setSigner(connectedProvider.getSigner());
                let accounts = await connectedProvider.send("eth_requestAccounts", []);
                let account = accounts[0];
                console.log("account ==>" + account);
            } catch (error) {
                console.error(error);
            } 
        } else {
            setIsConnected(false);
        }
    }

    return (
        <Button id='connectButton' variant='contained' onClick={connect}> Connect </Button>
    )
}