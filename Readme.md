# ZKprover AVS

## What it does

ZKprover as an Autonomous Verification System (AVS) revolutionizes task verification through a seamless interaction between users and operators. Users initiate tasks, such as mathematical computations or data verification, by submitting requests to the AVS. Operators, registered and staked within the system, then respond by generating zero-knowledge proofs (zkProofs) that validate the task's correctness without revealing sensitive information. These proofs are securely submitted back to the AVS for on-chain validation, ensuring transparency and integrity through blockchain technology.

## Process Overview

1. AVS consumer requests a Task to be generated and signed.
2. AVS emits an event for operators to pick up the request.
3. A staked operator generates the result and signs it.
4. The operator submits the signed result back to the AVS.
5. AVS verifies the operator's registration and stake, then accepts the submission.

## Quick Start

### Prerequisites

- npm
- Foundry
- Docker (ensure it's running)
- NodeJS packages:
  - tcs
  - ethers

### Installation

1. Clone the repository: `git clone `
2. Run `npm install`
3. Run `cp .env.local .env`
4. Run `make start-chain-with-contracts-deployed`
5. Open new terminal tab and run `make start-operator`

### For Running backend and frontend

1. Run `cd frontend`
2. Run `npm start`
3. Open new terminal tab and run `cd backend`
4. Run `npm install ethers express dotenv cors`

## Learning
Throughout the development of ZKprover as an AVS, we gained invaluable insights into how autonomous verification systems interact with both operators and consumers. Learning and implementing zkproofs presented significant challenges but also deepened our understanding of cryptographic protocols and their applications in secure computation verification. Due to time constraints, our initial focus has been on enabling the AVS to verify the sum of two numbers. Looking ahead, we are enthusiastic about expanding its capabilities to handle more complex tasks, thereby enhancing its utility and versatility for users seeking robust, decentralized verification solutions.

## Team Members

- Veer
- Abdullah


