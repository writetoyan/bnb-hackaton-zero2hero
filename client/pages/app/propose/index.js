import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import * as factoryJson from '../../utils/ProductFactory.json';
import ProposeCreate from '../../../components/propose/propose-create';
import ProposeTables from '../../../components/propose/propose-tables';
import Layout from '../../../components/Layout';

export default function Propose() {

    const [factoryContract, setFactoryContract] = useState();

    let provider;
    let signer;

    useEffect(() => {
        const initContract = async () => {
            const { ethereum } = window;
            if (ethereum) {
                try {
                    const factoryAddress = "0x63840a264045f5F87eC18dB64353990D67b225c7";
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
Propose.getLayout = function getLayout(page) {
    return (
      <Layout>
        {page}
      </Layout>
    )
  }