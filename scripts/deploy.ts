import { ethers } from 'hardhat'
import * as dotenv from 'dotenv';

dotenv.config();

async function main() {
    const ProductFactoryFactory = await ethers.getContractFactory("ProductFactory");
    const productFactory = await ProductFactoryFactory.deploy();
    await productFactory.deployed();
    console.log(`Contract deployed at address: ${productFactory.address}`)
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
})