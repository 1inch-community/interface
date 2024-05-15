import { exec } from 'node:child_process';
import * as os from 'node:os';
import * as readline from 'node:readline';

export function isProcessRunning(processName: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const platform = os.platform();
    let command;

    if (platform === 'win32') {
      command = `tasklist`;
    } else if (platform === 'linux' || platform === 'darwin') {
      command = `pgrep -x ${processName}`;
    } else {
      return reject(new Error('Unsupported platform'));
    }

    exec(command, (err, stdout, stderr) => {
      if (err) {
        // Если код выхода 1, это означает, что процесс не найден
        if (err.code === 1) {
          resolve(false);
        } else {
          return reject(err);
        }
      } else {
        if (platform === 'win32') {
          resolve(stdout.toLowerCase().includes(processName.toLowerCase()));
        } else {
          resolve(stdout.trim().length > 0);
        }
      }
    });
  });
}

export function killProcess(processName: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const platform = os.platform();
    let command;

    if (platform === 'win32') {
      command = `taskkill /F /IM ${processName}`;
    } else if (platform === 'linux' || platform === 'darwin') {
      command = `pkill -f ${processName}`;
    } else {
      return reject(new Error('Unsupported platform'));
    }

    exec(command, (err, stdout, stderr) => {
      if (err) {
        return resolve(false);
      }
      resolve(true);
    });
  });
}

export function askQuestion(query: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise(resolve => {
    rl.question(query, answer => {
      rl.close();
      resolve(answer);
    });
  });
}
