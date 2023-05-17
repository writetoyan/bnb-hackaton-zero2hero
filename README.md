# DEALCHAIN


Website: https://dealchain.vercel.app

Video demo: https://youtu.be/LWVUgorBIcc

## Project abstract: 

This project is about to empower e-commerce with the blockchain technology to have more transparency, security and efficiency when buying online. We are targeting group buying business model. Companies can offer product sells on discount if a treshold is obtained or buyers can group together to offer to buy a product from a target company.

Advantages using blockchain for consumers:

- Their money is hold by a smart contract until they receive their product.
- The money is send to the sellers only if a certain percentage of buyers vote for the conformity / satisfaction of the product with the description provided. 
- They can buy without spending time searching if the seller / product is legit. 
- They can build their reputation as a buyer that can be used by other platforms or flex it to others thanks to Soulbound token.

Advantages using blockchain for companies: 

- No more credit card fees on each sells. Everything is packed on a single withdraw and hence a minimized blockchain transaction fee. 
- They can be sure to be paid if their product is as described.
- The product of the sell can be put to work on different DeFi protocol while the whole selling process is being processed.
- Less doubt from the consummer means more and faster sells to boost revenu.


## Contracts 

### Product Factory contract

This is the contract from where the different group buy products are created and kept track.

#### For the companies
- The companies can create an offer with the sells requirement like the quantity of buyers to reach and an end date for the offer.
- If the requirements are met. The company can decide to close the deals and start shipping the products.

#### For the consumers
- Everyone can create a preProduct contract to gather the interest for a particular product from a specific company.
- The asking price are set.
- If the company targeted show there is a lot of interest to his product at this price, he can accept and a real Product contract will be deployed to start the group buy process.

### Product contract

A new Product contract is created from the factory contract. This contract manage the group buy sells. 

#### Normal operation

- It should be created by the company selling the products.
- The companies set all the requirement at creation.
- When the sells period is over and if the requirements are met, the companies can start shipping the products to the different buyers. This period last 2 weeks.
- The product of the sells is locked on the contract for another 2 weeks (evaluation period).
- It can be withdrawn by the company only if there are less than 30% of disatisfied consummer.
- There is a 5% platform fees that is send to the platform treasury when the company decide to withdraw his funds.

#### Evaluation period

- After this period, the evaluation period starts for another 2 weeks and consummers can express their evaluation.
- If during that time, they didn't received their product or the product received is not as expected, the consummer can evaluate the product as non conform.
- To discourage bad behavior from the consummer, if they evaluate as non conform, they should lock a certain amount of BNB.
- To encourage consummer satisfied with the product to evaluate, if the conformity of the product wins, the BNB locked from the people who evaluated the product as non conform is split between them.
- People evaluating the product conform do not lock any amount of BNB.


### PreProduct contract

This contract is created from the factory contract by anyone who want to make a request to a company. It gathers all the interest for a product from a targeted company at a certain price.

- The targeted company can check how much interest there is.
- If he estimate that he want to do the deals, he can call the accept function on that contract.
- This function will trigger the creation of a real Product contract automatically to start the classic selling process.


### DealChainSoul contract

This contract is used to mint a Soulbound token for the users. This token allow companies to get the users info like tehir name and delivery address. It also keep track of the reputation of the user as a buyer. Other social dApp can the use this reputation to unlock different functionalities.   

## Tests 

![Tests](/assets/tests.png "Tests")
![Soulbound Tests](/assets/Soulbound%20tests.png "Soulbound tests")


## DApp

### Homepage - Mint SoulBound token and reveal all the offers 

![Homepage](/assets/Homepage.png "Homepage")

### Mint SoulBound token page

![soulboundMint](/assets/soulboundMint.png "soulboundMint")

### Create a Product page

![createProduct](/assets/createProduct.png "createProduct")

### Propose a company to create Product for group buy page

![proposeProduct](/assets/proposeProduct.png "proposeProduct")

### Company can consult the proposal from the client and get the number of interest

![proposedProduct](/assets/proposedProduct.png "proposedProduct")

### Buy and Evaluate page

![buyAndEvaluate](/assets/buyAndEvaluate.png "buyAndEvaluate")

### Withdraw fund page      

![withdraw](/assets/withdraw.png "withdraw")
