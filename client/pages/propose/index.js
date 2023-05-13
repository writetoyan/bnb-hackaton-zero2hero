import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import * as factoryJson from '../utils/ProductFactory.json';
import ProposeCreate from '../../components/propose/propose-create';
import ProposeTables from '../../components/propose/propose-tables';

export default function Propose() {

    const [factoryContract, setFactoryContract] = useState();


    let provider;
   
    //sepolia 0x1B4933dc0803388F28852875C1b678d476BE598E
    // bnb 0xa8CE401802A01568a93dc68a6E0040118cC274b0
    useEffect(() => {
        const initContract = async () => {
            const { ethereum } = window;
            if (ethereum) {
                try {
                    const factoryAddress = "0x1B4933dc0803388F28852875C1b678d476BE598E";
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

    // setPastEvents(prevArray => [...prevArray, event])

  

    // factoryContract.on("NewPreProductRequested", (company, productName, queryPrice) => {
    //     let info = {
    //         company: company,
    //         productName: productName,
    //         queryPrice: ethers.utils.formatEther(queryPrice)
    //     }
    //     console.log(JSON.stringify(info))
    // })

    return (
        <>
            <ProposeCreate factoryContract={factoryContract} />
            <ProposeTables factoryContract={factoryContract} />
            
        </>


    )
}