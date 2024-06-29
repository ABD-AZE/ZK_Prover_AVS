import express, { Request, Response } from 'express';
import cors from 'cors';
import { ethers } from 'ethers';
import dotenv from 'dotenv';
import {contractABI} from './ContractABI';

dotenv.config();
const app = express();

app.use(cors({
  origin: 'http://localhost:3000'
}));

app.use(express.json());

const RPC_URL = process.env.RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY || '';
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || '';

const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, wallet);

interface TaskDetails {
  taskIndex: string;
  transactionHash: string;
  createdAt: string;
  status: string;
  a: string;
  b: string;
}

let taskDetails: TaskDetails[] = [];

app.post('/create-task', async (req: Request, res: Response) => {
  try {
    const { a, b } = req.body;

    // Convert a and b to BigInt
    const aValue = BigInt(a);
    const bValue = BigInt(b);

    // Call the contract function
    const tx = await contract.createNewTask(aValue, bValue);

    // Wait for the transaction to be mined
    const receipt = await tx.wait();

    // Add task details to our array
    taskDetails.push({
      taskIndex: taskDetails.length.toString(), // This is a temporary index, it will be updated when we receive the TaskResponded event
      transactionHash: receipt.hash,
      createdAt: new Date().toISOString(),
      status: 'Created',
      a: a,
      b: b
    });

    res.json({ message: "Task created successfully", transactionHash: receipt.hash });
  } catch (error: any) {
    console.error("Error details:", error);
    res.status(500).json({ error: "An error occurred while creating the task", details: error.message });
  }
});

app.get('/task-details', (_req: Request, res: Response) => {
  res.json(taskDetails);
});

function listenForTaskResponded() {
  contract.on("TaskResponded", (taskIndex: any, task: any, respondingOperator: any) => {
    console.log("New TaskResponded event:");
    console.log("Task Index:", taskIndex.toString());
    console.log("Task:", task);
    console.log("Responding Operator:", respondingOperator);
    
    // Update the task details with the correct task index
    const index = taskDetails.findIndex(t => t.taskIndex === taskIndex.toString());
    if (index !== -1) {
      taskDetails[index].status = 'Responded';
    }
  });
}

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  listenForTaskResponded(); // Start listening for events when the server starts
});