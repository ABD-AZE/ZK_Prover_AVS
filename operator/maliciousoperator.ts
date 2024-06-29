import { ethers } from "ethers";
import * as dotenv from "dotenv";
import { delegationABI } from "./abis/delegationABI";
import { contractABI } from './abis/contractABI';
import { registryABI } from './abis/registryABI';
import { avsDirectoryABI } from './abis/avsDirectoryABI';
import fs from "fs-extra";

dotenv.config();

import { writeInputToFile, runScript, readOutputFile } from "./operatorHelper";
import { generateVerifierInputs,run } from "./generateVerifierInputs";


const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet("0x92db14e403b83dfe3df233f83dfa3a0d7096f21ca9b0d6d6b8d88b2b4ec1564e", provider);

const delegationManagerAddress = process.env.DELEGATION_MANAGER_ADDRESS!;
const contractAddress = process.env.CONTRACT_ADDRESS!;
const stakeRegistryAddress = process.env.STAKE_REGISTRY_ADDRESS!;
const avsDirectoryAddress = process.env.AVS_DIRECTORY_ADDRESS!;

const delegationManager = new ethers.Contract(delegationManagerAddress, delegationABI, wallet);
const contract = new ethers.Contract(contractAddress, contractABI, wallet);
const registryContract = new ethers.Contract(stakeRegistryAddress, registryABI, wallet);
const avsDirectory = new ethers.Contract(avsDirectoryAddress, avsDirectoryABI, wallet);
interface taski{
    a: ethers.BigNumber;
    b: ethers.BigNumber;
    taskCreatedBlock: number;
}
const signAndRespondToTask = async (taskIndex: number, taskCreatedBlock: number, a: ethers.BigNumber, b: ethers.BigNumber, _a:ethers.BigNumber[],_b:ethers.BigNumber[][],_c:ethers.BigNumber[],_num:ethers.BigNumber[]) => {
    // console.log(message);
    // const messageHash = ethers.utils.solidityKeccak256(["uint256"], [message]);
    // const messageBytes = ethers.utils.arrayify(messageHash);
    // const signature = await wallet.signMessage(messageBytes);
    // console.log(taskIndex,taskCreatedBlock,a,b,_a,_b,_c,_num);
    console.log(`Signing and responding to task ${taskIndex}`);
    // console.log(a,b,_num[1],_num[2]);
    const tx = await contract.respondToTask(
      { taskCreatedBlock: taskCreatedBlock, a: a, b: b },
      taskIndex,
        _a,
        _b,
        _c,
        _num
    );
  
    await tx.wait();
    console.log(`Responded to task`);
  };

const registerOperator = async () => {
    const tx1 = await delegationManager.registerAsOperator({
        earningsReceiver: await wallet.address,
        delegationApprover: "0x0000000000000000000000000000000000000001",
        stakerOptOutWindowBlocks: 0
    }, "");
    await tx1.wait();
    console.log("Operator registered on EL successfully");

    const salt = ethers.utils.hexlify(ethers.utils.randomBytes(32));
    const expiry = Math.floor(Date.now() / 1000) + 3600; // Example expiry, 1 hour from now

    // Define the output structure
    let operatorSignature = {
        expiry: expiry,
        salt: salt,
        signature: ""
    };

    // Calculate the digest hash using the avsDirectory's method
    const digestHash = await avsDirectory.calculateOperatorAVSRegistrationDigestHash(
        wallet.address, 
        contract.address, 
        salt, 
        expiry
    );

    // Sign the digest hash with the operator's private key
    const signingKey = new ethers.utils.SigningKey("0x92db14e403b83dfe3df233f83dfa3a0d7096f21ca9b0d6d6b8d88b2b4ec1564e");
    const signature = signingKey.signDigest(digestHash);
    
    // Encode the signature in the required format
    operatorSignature.signature = ethers.utils.joinSignature(signature);

    const tx2 = await registryContract.registerOperatorWithSignature(
        wallet.address,
        operatorSignature
    );
    await tx2.wait();
    console.log("Operator registered on AVS successfully");
};

const monitorNewTasks = async () => {
    // let a:ethers.BigNumber = ethers.BigNumber.from(13);
    // let b:ethers.BigNumber = ethers.BigNumber.from(5);
    // // console.log(a+b);
    // await contract.createNewTask(a, b);

    contract.on("NewTaskCreated", async (taskIndex: number, task: taski) => {
        console.log(`New task detected: ${+task.a + +task.b}`);
        // Calculate the sum

        // let sum:number = Number(task.a) + Number(task.b);
        // console.log(`Sum: ${sum}`);

        //generating proof
        // let proof:any[];
        // writeInputToFile((task.a), (task.b));
        // await   runScript();
        // await generateVerifierInputs();
        // const verifierInputs = await fs.readJson("./Circuits/verifierInputs.json");
        // const a = verifierInputs.a.map(ethers.BigNumber.from);
        // const b = verifierInputs.b.map((row: any[]) => row.map(ethers.BigNumber.from));
        // const c = verifierInputs.c.map(ethers.BigNumber.from);
        // const input = verifierInputs.input.map(ethers.BigNumber.from);

        let verifierInputs = {
            a: [
              '16513277439395686978333287192681411485972913100021886891072227446081602093303',
              '14386690421340525196499492475435398813340243273616502951150337096529479702610'
            ],
            b: [
              [
                '17889927125112411671836093504438821512535429427728946346213486517123248998718',
                '2560798881419388004837204651726640058847310083474799433090101107833202872311'
              ],
              [
                '7268472102839098963177675146358458865930939181287220834629350941836401941042',
                '11420779303042505634370823973083107632268331522820527181513430106552572988185'
              ]
            ],
            c: [
              '19476912485494788346669150109201072386208355089008028931035894208191285326379',
              '18364350205866762511566975609747919903383858176692216124500799238615044466040'
            ],
            input: [ '510', '456', '54' ]
          };
          let a=verifierInputs.a.map(ethers.BigNumber.from);
            let b=verifierInputs.b.map((row: any[]) => row.map(ethers.BigNumber.from));
            let c=verifierInputs.c.map(ethers.BigNumber.from);
            let input=verifierInputs.input.map(ethers.BigNumber.from);
        await signAndRespondToTask(taskIndex, Number(task.taskCreatedBlock), (task.a), (task.b), a, b, c, input);
    });

    console.log("Monitoring for new tasks...");
};

const main = async () => {
    await registerOperator();
    monitorNewTasks().catch((error) => {
        console.error("Error monitoring tasks:", error);
    });
};

main().catch((error) => {
    console.error("Error in main function:", error);
});
