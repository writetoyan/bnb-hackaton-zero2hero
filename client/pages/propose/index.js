import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import * as factoryJson from '../utils/ProductFactory.json';
import ProposeCreate from '../../components/propose/propose-create';
import ProposeTables from '../../components/propose/propose-tables';

export default function Propose() {

    const [factoryContract, setFactoryContract] = useState();

    let provider;
    let signer;

    useEffect(() => {
        const initContract = async () => {
            const { ethereum } = window;
            if (ethereum) {
                try {
                    const factoryAddress = "0x5FFf9c7cBe4476B1981D54B90AfaB3d94DA6Ae05";
                    const factoryABI = factoryJson.abi;
                    provider = new ethers.providers.Web3Provider(ethereum);
                    signer = provider.getSigner();
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

    return (
        <>
            <ProposeCreate factoryContract={factoryContract} />
            <ProposeTables factoryContract={factoryContract} />
        </>
    )
}