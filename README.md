# Sit & Go DLottery App

It's a contract of a TON Sit & Go lottery. 

Condition: Each participant buys the ticket to take part in the lottery and after there are 10 participants it distributes the prize pool. 

Prize pool distribution: 
 - 50% to the 1 place
 - 30% to the 2 place
 - 20% to the 3 place

## Project structure

-   `contracts` - source code of all the smart contracts of the project and their dependencies.
-   `wrappers` - wrapper classes (implementing `Contract` from ton-core) for the contracts, including any [de]serialization primitives and compilation functions.
-   `tests` - tests for the contracts.
-   `scripts` - scripts used by the project, mainly the deployment scripts.

## How to use

### Build

`npx blueprint build` or `yarn blueprint build`

### Test

`npx blueprint test` or `yarn blueprint test`

### Deploy or run another script

`npx blueprint run` or `yarn blueprint run`

### Add a new contract

`npx blueprint create ContractName` or `yarn blueprint create ContractName`
