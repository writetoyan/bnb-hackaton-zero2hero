import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import * as dotenv from 'dotenv';
import { Contract } from 'ethers';
import { expect } from 'chai';
import { time } from "@nomicfoundation/hardhat-network-helpers";

dotenv.config();

const NAME = "Product Test";
const MARKET_PRICE = 10;
const DISCOUNTED_PRICE = 7;
const QUANTITY_TRESHOLD = 200;
const DURATION = 100
const QUANTITY_TO_BUY = 10;
const AMOUNT_TO_LOCK_FOR_VOTING_NO_CONFORM = ethers.utils.parseEther("0.1")

describe("Product Contract", function () {

    let deployer: SignerWithAddress;
    let hacker: SignerWithAddress;
    let productFactory: Contract;
    let timestamp: number;
    let product: Contract;

    beforeEach(async () => {

        //Deploying the Product Factory contract
        [ deployer, hacker ] = await ethers.getSigners();
        const block = await ethers.provider.getBlock('latest');
        timestamp = block.timestamp;
        const ProductFactoryFactory = await ethers.getContractFactory("ProductFactory");
        productFactory = await ProductFactoryFactory.deploy();
        await productFactory.deployed();

        //Creating a new Product contract from the factory
        const createProductTx = await productFactory.createProduct(deployer.address, NAME, MARKET_PRICE, DISCOUNTED_PRICE, QUANTITY_TRESHOLD, timestamp + DURATION); 
        await createProductTx.wait();

        //Getting an instance of the newly created Product contract
        const ProductFactory = await ethers.getContractFactory("Product");
        const productContractAddress = await productFactory.products(0);
        product = ProductFactory.attach(productContractAddress);

    })
    it("Should set the owner of the contract to the sender", async () => {
        expect(await product.owner()).to.be.eq(deployer.address);
    })
    it("Should emit an event when a new contract Porduct is created", async () => {
        const newProduct = await productFactory.createProduct(deployer.address, NAME, MARKET_PRICE, DISCOUNTED_PRICE, QUANTITY_TRESHOLD, timestamp + DURATION)
        expect(newProduct).to.emit(productFactory, "NewProductCreated").withArgs(newProduct.address, NAME)
    })
    it("Should set the struct ProductInfo for the product", async () => {
        const productInfo = await product.productInfo();
        expect(productInfo.name, productInfo.marketPrice).to.be.eq(NAME, MARKET_PRICE.toString());
        expect(productInfo.discountedPrice, productInfo.quantityTreshold).to.be.eq(DISCOUNTED_PRICE, QUANTITY_TRESHOLD.toString())
        expect(productInfo.endDate).to.be.eq(timestamp + DURATION)
    })

    describe("Participate", function () {

        it("Should revert if the time offer is over", async () => {
            await time.increase(DURATION);
            await expect(product.participate(QUANTITY_TO_BUY, {value: QUANTITY_TO_BUY * DISCOUNTED_PRICE})).to.be.revertedWithCustomError(product, "OfferEnded")
        })
        it("Should revert if the amout paid is less than the price", async () => {
            await expect(product.participate(QUANTITY_TO_BUY, {value: QUANTITY_TO_BUY * DISCOUNTED_PRICE - 1})).to.be.revertedWithCustomError(product, "AmountSentTooLow")
        })
        it("Should emit an event when a participant participate in the group buy", async () => {
            await expect(product.participate(QUANTITY_TO_BUY, {value: QUANTITY_TO_BUY * DISCOUNTED_PRICE}))
                .to.emit(product, "ParticipateGroupBuy")
                .withArgs(deployer.address, QUANTITY_TO_BUY)
        })
        it("Should update the quantitySold state variable by the quantity bought", async () => {
            const quantitySold = await product.quantitySold();
            const participateTx = await product.participate(QUANTITY_TO_BUY, {value: QUANTITY_TO_BUY * DISCOUNTED_PRICE});
            await participateTx.wait();
            expect(await product.quantitySold()).to.eq(quantitySold.add(QUANTITY_TO_BUY));
        })
    })

    describe("Evaluate product", function () {

        beforeEach(async () => {

            //Simulating a buy before evaluate the product
            const participateTx = await product.participate(QUANTITY_TO_BUY, {value: QUANTITY_TO_BUY * DISCOUNTED_PRICE});
            await participateTx.wait();

        })

        describe("Delay requirement", function () {
            it("Should revert if the delay after the sell is closed is not passed", async () => {
                await expect(product.evaluateProduct(true)).to.be.revertedWithCustomError(product, "WaitForEvaluationPeriodDelay")
            });      
        })

        describe("Vote requirements", function () {

            let productConformity;

            beforeEach(async () => {
                //Simulating the time passing for evaluation to open
                const timeToIncrease = DURATION + 14*24*60*60;
                await time.increase(timeToIncrease)
            })

            it("Should revert if the person did not participated in the sell", async () => {
                await expect(product.connect(hacker).evaluateProduct(true)).to.be.revertedWithCustomError(product, "YouDidNotParticipatedInThatOffer")
            });
            it("Should emit an event when someone vote for conform", async () => {
                await expect(product.evaluateProduct(true)).to.emit(product, "EvaluateConform").withArgs(deployer.address, QUANTITY_TO_BUY)
            })
            it("Should emit an event when someone vote for no conform", async () => {
                await expect(product.evaluateProduct(false, {value: AMOUNT_TO_LOCK_FOR_VOTING_NO_CONFORM})).to.emit(product, "EvaluateNoConform").withArgs(deployer.address, QUANTITY_TO_BUY)
            })
            it("Should update the number of vote for conformity", async () => {
                productConformity = await product.productConformity();
                const numberOfVoteForConformityBefore = productConformity.conform;
                const evaluateProductTx = await product.evaluateProduct(true);
                await evaluateProductTx.wait();
                productConformity = await product.productConformity();
                const numberOfVoteForConformityAfter = productConformity.conform;
                expect(numberOfVoteForConformityAfter).to.be.eq(numberOfVoteForConformityBefore.add(QUANTITY_TO_BUY));
            })
            it("Should revert if there is no amount send to lock for challenging product conformity", async () => {
                await expect(product.evaluateProduct(false)).to.be.revertedWithCustomError(product, 'ThereIsAMinAmountToLock')
            })
            it("Should update the number of vote for no conformity", async () => {
                productConformity = await product.productConformity();
                const numberOfVoteForNoConformityBefore = productConformity.noConform;
                const evaluateProductTx = await product.evaluateProduct(false, {value: AMOUNT_TO_LOCK_FOR_VOTING_NO_CONFORM});
                await evaluateProductTx.wait();
                productConformity = await product.productConformity();
                const numberOfVoteForNoConformityAfter = productConformity.noConform;
                expect(numberOfVoteForNoConformityAfter).to.be.eq(numberOfVoteForNoConformityBefore.add(QUANTITY_TO_BUY));
            })
        })
    })

    describe("Withdraw product of sells", function () {

        let QUANTITY_TO_BUY_BUYER2 = 5;
        let AMOUNT_TO_LOCK_FOR_VOTING_NO_CONFORM = 0.1;
        let AMOUNT_TO_LOCK = QUANTITY_TO_BUY_BUYER2 * AMOUNT_TO_LOCK_FOR_VOTING_NO_CONFORM;
        let treasury: Contract;

        beforeEach(async () => {
            const participateTx = await product.participate(QUANTITY_TO_BUY, {value: QUANTITY_TO_BUY * DISCOUNTED_PRICE});
            await participateTx.wait();
            const participateTx2 = await product.connect(hacker).participate(5, {value: 5 * DISCOUNTED_PRICE});
            await participateTx2.wait();
            const TreasuryFactory = await ethers.getContractFactory("Treasury");
            const treasuryAddress = await productFactory.treasury();
            treasury = TreasuryFactory.attach(treasuryAddress);
        })

        it("Should revert if not the owner attempt to withdraw", async () => {
            await expect(product.connect(hacker).withdrawProductOfSells()).to.be.revertedWithCustomError(product, "OnlyOwnerCanWithdrawFunds")
        })
        it("Should revert if the evaluation period is not over", async () => {
            await time.increase(DURATION + 14*24*60*60)
            await expect(product.withdrawProductOfSells()).to.be.revertedWithCustomError(product, "EvaluationPeriodNotOver")
        })
        it("Should revert if the number of vote for no conform is > 30%", async () => {
            await time.increase(DURATION + 2*14*24*60*60)
            const evaluateTx = await product.evaluateProduct(true);
            await evaluateTx.wait()
            const evaluateTx2 = await product.evaluateProduct(false, {value: ethers.utils.parseEther(AMOUNT_TO_LOCK.toString())} );
            await evaluateTx2.wait();
            await expect(product.withdrawProductOfSells()).to.be.revertedWithCustomError(product, "ThereIsAProblemWithYourProduct")
        })
        it("Should withdraw the product of the sells to the company", async () => {
            await time.increase(DURATION + 2*14*24*60*60)
            const evaluateTx = await product.evaluateProduct(true);
            await evaluateTx.wait()
            const balanceContractBefore = await ethers.provider.getBalance(product.address);
            const withdrawTx = await product.withdrawProductOfSells();
            await withdrawTx.wait();
            const balanceContractAfter = await ethers.provider.getBalance(product.address);
            expect(balanceContractAfter).to.be.lt(balanceContractBefore);
        })
        it("Should withdraw the platform fees to the platform treasury when the company withdraw his product of the sells", async () => {
            await time.increase(DURATION + 2*14*24*60*60)
            const evaluateTx = await product.evaluateProduct(true);
            await evaluateTx.wait()
            const balanceTreasuryBefore = await ethers.provider.getBalance(treasury.address);
            const withdrawTx = await product.withdrawProductOfSells();
            await withdrawTx.wait();
            const balanceTreasuryAfter = await ethers.provider.getBalance(treasury.address);
            expect(balanceTreasuryAfter).to.be.gt(balanceTreasuryBefore);
        })
        it("Should emit an event when the company withdraw the product of the sell", async () => {
            await time.increase(DURATION + 2*14*24*60*60)
            const evaluateTx = await product.evaluateProduct(true);
            await evaluateTx.wait()
            const withdrawTx = await product.withdrawProductOfSells();
            expect(withdrawTx).to.emit(product, "ProductOfSellsWithdrawn").withArgs(deployer.address, QUANTITY_TO_BUY * DISCOUNTED_PRICE)
        })
    
    })

    describe("Withdraw price for evaluating conform", function () {
        let QUANTITY_TO_BUY_BUYER2 = 1;
        let AMOUNT_TO_LOCK_FOR_VOTING_NO_CONFORM = 0.1;
        let AMOUNT_TO_LOCK = QUANTITY_TO_BUY_BUYER2 * AMOUNT_TO_LOCK_FOR_VOTING_NO_CONFORM;

        beforeEach(async () => {
            const participateTx = await product.participate(QUANTITY_TO_BUY, {value: QUANTITY_TO_BUY * DISCOUNTED_PRICE});
            await participateTx.wait();
            const participateTx2 = await product.connect(hacker).participate(QUANTITY_TO_BUY_BUYER2, {value: QUANTITY_TO_BUY_BUYER2 * DISCOUNTED_PRICE});
            await participateTx2.wait();
        })

        it("Should Withdraw evaluation conform price for participant", async () => {
            await time.increase(DURATION + 14*24*60*60)
            const evaluateTx = await product.evaluateProduct(true);
            await evaluateTx.wait()
            const evaluateTx2 = await product.connect(hacker).evaluateProduct(false, {value: ethers.utils.parseEther(AMOUNT_TO_LOCK.toString())} );
            await evaluateTx2.wait();
            const balanceEvaluateConformBefore = await ethers.provider.getBalance(deployer.address);
            await time.increase(DURATION + 14*24*60*60)
            const withdrawTx = await product.withdrawEvaluationConformPrice();
            await withdrawTx.wait();
            const balanceEvaluateConformAfter = await ethers.provider.getBalance(deployer.address);
            expect(balanceEvaluateConformAfter).to.be.gt(balanceEvaluateConformBefore);
        })
    })

})