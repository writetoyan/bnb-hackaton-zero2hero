import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import * as dotenv from 'dotenv';
import { Contract } from 'ethers';
import { expect } from 'chai';

dotenv.config();

const NAME = "Bob";
const DELIVERY_ADDRESS = "Piccadilly Circus, London";

describe("DealChainSoul", function() {
    
    let user: SignerWithAddress;
    let receiver: SignerWithAddress;
    let dealChainSoul: Contract;

    beforeEach(async () => {
        [ user, receiver ] = await ethers.getSigners();
        const DealChainSoulFactory = await ethers.getContractFactory("DealChainSoul");
        dealChainSoul = await DealChainSoulFactory.deploy();
        await dealChainSoul.deployed();
        const mintTx = await dealChainSoul.mint(NAME, DELIVERY_ADDRESS);
        await mintTx.wait();
    })

    describe("Mint the soulbound token", () => {
        it('Should mint to the minter', async () => {
            expect(await dealChainSoul.ownerOf(0)).to.be.eq(user.address);
        })
        it("Should set the userInfo struct with the right info", async () => {
            const userInfo = await dealChainSoul.getUserInfo(0);
            expect(userInfo.name).to.be.eq(NAME)
            expect(userInfo.deliveryAddress).to.be.eq(DELIVERY_ADDRESS)
        })
        it("Should set the reputation of the user to zero", async () => {
            const userInfo = await dealChainSoul.getUserInfo(0);
            expect(userInfo.reputation).to.be.eq(0);
        })
        it("Should not be able to mint a second soulbound token", async () => {
            expect(dealChainSoul.mint(NAME, DELIVERY_ADDRESS)).to.be.revertedWithCustomError(dealChainSoul, "YouAlreadyMintedYourSoulBound")
        })
        it("Should not be able to transfer the soulbound token", async () => {
            expect(dealChainSoul.transferFrom(user.address, receiver.address, 0)).to.be.revertedWithCustomError(dealChainSoul, "YourSoulboundIsNotTransferable")
        }) 
    })

    describe("Update the delivery address of the user", async () => {
        it("Should update the user address", async () => {
            const updateTx = await dealChainSoul.changeDeliveryAddress(0, "new address");
            await updateTx.wait();
            const userInfo = await dealChainSoul.getUserInfo(0);
            expect(userInfo.deliveryAddress).to.be.eq("new address");
        })
    })

})