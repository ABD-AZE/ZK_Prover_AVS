import fs from 'fs';
import { exec } from 'child_process';
import { ethers } from 'ethers';
export function writeInputToFile(a:ethers.BigNumber,b:ethers.BigNumber) {
    const content = JSON.stringify({ a: String(a), b: String(b) });

    fs.writeFile('./Circuits/input.json', content, (err) => {
        if (err) {
            console.error('Error writing to file:', err);
        } else {
            console.log('Input file written successfully.');
        }
    });
}
export function runScript() {
        return new Promise<void>((resolve, reject) => {
            exec('./Circuits/executeCircuit.sh', (error, stdout, stderr) => {
                if (error) {
                    console.error('Error running script:', error);
                } else {
                    console.log('Proof generated successfully.');
                }
            });
          setTimeout(() => {
            resolve();
          }, 1000); // Simulating script execution delay
        });
    }
export function readOutputFile() {
    fs.readFile('./Circuits/output.txt', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
        } else {
            console.log('Proof:', data);
            return data;
        }
    });
}