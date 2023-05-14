import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import * as dotenv from 'dotenv';
import { Contract } from 'ethers';
import { expect } from 'chai';

dotenv.config();

const productName = ethers.utils.formatBytes32String("request test");
const requestedPrice = 12;
const marketPrice = 15;
const quantityTreshold = 2000;
const endDate = 5000;

describe("PreProduct contract", () => {

    let requester: SignerWithAddress;
    let company: SignerWithAddress;
    let productFactory: Contract; 
    let requestPreProduct: any;
    let preProduct: Contract;

    beforeEach(async () => {
        [ requester, company ] = await ethers.getSigners();
        const ProductFactoryFactory = await ethers.getContractFactory('ProductFactory')
        productFactory = await ProductFactoryFactory.deploy();
        await productFactory.deployed();
        requestPreProduct = await productFactory.requestCreateProduct(company.address, productName, requestedPrice);
        await requestPreProduct.wait();
        const preProductFactory = await ethers.getContractFactory('PreProduct');
        const preProductAddress = await productFactory.preProducts(0);
        preProduct = preProductFactory.attach(preProductAddress);
    })

    it('Should emit an event when a preProduct is created', async () => {
        expect(requestPreProduct).to.emit(productFactory, 'NewPreProductRequested').withArgs(company.address, productName, requestedPrice);
    })
    it("Should update the number of potential buyer", async () => {
        const expressInterestTx = await preProduct.expressInterest();
        await expressInterestTx.wait();
        expect(await preProduct.getNumberOfPotentialBuyer()).to.be.eq(1);
    })
    it('Should create a new Product contract when the company accept the demand', async () => {
        const acceptTx = await preProduct.connect(company).acceptCreateProductOffer(marketPrice, quantityTreshold, endDate);
        await acceptTx.wait();
        expect(await productFactory.products(0)).to.exist;
    })
    it('Should emit an event when the company accept the demand', async () => {
        await expect(preProduct.connect(company).acceptCreateProductOffer(marketPrice, quantityTreshold, endDate))
            .to.emit(preProduct, "ProductOfferCreationAccepted")
            .withArgs(company.address, productName, quantityTreshold);

    })

})