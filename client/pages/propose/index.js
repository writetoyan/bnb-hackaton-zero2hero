import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import * as factoryJson from '../utils/ProductFactory.json';

export default function () {

    const [ factoryAddress, setFactoryAddress ] = useState();

    let provider;

    useEffect(() => {
        const initContract = async () => {
            const { ethereum } = window;
            if (ethereum) {
                try {
                    const factoryAddress = "0xa8CE401802A01568a93dc68a6E0040118cC274b0";
                    const factoryABI = factoryJson.abi;
                    provider = new ethers.providers.Web3Provider(ethereum);
                    const signer = provider.getSigner();
                    setFactoryAddress(new ethers.Contract(
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

    const proposeHandle = async () => {
        const proposeTx = await factoryAddress.requestCreateProduct("", "test", 10);
        console.log(proposeTx)
    }
    const getPreProductAddress = async () => {
        const proposeTx = await factoryAddress.preProducts(0);
        console.log(proposeTx)
    }

    return (
        <div>
            Propose pages!
            <button onClick={proposeHandle}>Propose a product</button>
            <button onClick={getPreProductAddress}>Get address</button>

        </div>
    )
}