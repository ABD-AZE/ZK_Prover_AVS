# ZKprover AVS

## Project Description

ZKprover as an Actively Validated Services(AVS) revolutionizes task verification through a seamless interaction between users and operators. Users initiate tasks, such as mathematical computations or data verification, by submitting requests to the AVS. Operators, registered and staked within the system, then respond by generating zero-knowledge proofs (zkProofs) that validate the task's correctness without revealing sensitive information. These proofs are securely submitted back to the AVS for on-chain validation, ensuring transparency and integrity through blockchain technology.

## Project Video

## Process Overview

1. AVS consumer requests a Task to be generated and signed.
2. AVS emits an event for operators to pick up the request.
3. A staked operator generates the result and signs it.
4. The operator submits the signed result back to the AVS.
5. AVS verifies the operator's registration and stake,zkproof, then accepts the submission.

## Quick Start

### Prerequisites

- npm
- Foundry
- Docker (ensure it's running)
- NodeJS packages:
  - tcs
  - ethers

### Installation

1. Clone the repository: `git clone https://github.com/ABD-AZE/ZK_Prover_AVS.git `
2. Run `npm install`
3. Run `cp .env.local .env`
4. Run `make start-chain-with-contracts-deployed`
5. Open new terminal tab and run `make start-operator`

### For Running backend and frontend

1. Run `cd frontend`
2. Run `npm install`
3. Run `npm start`
4. Open new terminal tab and run `cd backend`
5. Run `npm install`
6. Run `ts-node index.ts`

## Challenges Faced
### Understanding the AVS framework.
The building block of our project was AVS so understanding it in depth was utterly necessary.
### Integration with Smart Contracts
EigenLayer's Repo has a lot of smart contracts.Understanding each of them were necessary to buils our project although we learned a lot but it was quite challenging
### Integration of circuit with operator
First we planned to use a complex circuit but we were facing issues while intergating the operator with the proving mechanism due to bulk of input size.So instead we went ahead with using simpler circuits that is being adder


## Individual Contributions

### Veer
- Frontend
- Backend
- Modification and Integration of Smart Contracts

### Abdullah
- ZKproofs Integration with Operator
- Modification and Integration of Smart Contracts
- Bash scripting

## Learning
-We undestood the architecture of EigenLayer AVS which included understaing its complex smart ocntracts and how they interact with each other
-We Learned about ehters library 

### Future 
