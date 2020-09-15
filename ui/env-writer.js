/*
 * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const readline = require('readline');
const os = require('os');
const { ENVIRONMENT } = process.env;

const deleteFile = path => {
  fs.unlinkSync(path);
};

const createFile = path => {
  // eslint-disable-next-line no-useless-catch
  try {
    fs.writeFileSync(path, 'window.CHARLESCD_ENVIRONMENT = {');
  } catch (error) {
    throw error;
  }
};

const fileExist = path => {
  try {
    const configExists = fs.existsSync(path);
    if (configExists) {
      deleteFile(path);
      createFile(path);
    } else {
      createFile(path);
    }
  } catch (err) {
    console.log('error in fileExist', err);
  }
};

const createEnvValueFromOS = (line, path) => {
  const keyAndValue = line.split('=');
  const key = keyAndValue[0];
  const value = keyAndValue[1];

  const newValue = process.env[key] || value;
  fs.appendFileSync(path, `${key}:"${newValue}",`);
};

const readFile = (path, confPath) => {
  try {
    const readInterface = readline.createInterface({
      input: fs.createReadStream(path),
      console: false
    });
    readInterface.on('line', function(line) {
      createEnvValueFromOS(line, confPath);
    });
    readInterface.on('close', () => {
      fs.appendFileSync(confPath, `}`);
    });
  } catch (error) {
    console.log(error);
  }
};

const sourceFile = () => {
  const endOfLine = os.EOL;
  if (ENVIRONMENT) {
    const lines = fs.readFileSync(`.env.${ENVIRONMENT}`);
    const variables = lines
      .toString()
      .trim()
      .split(endOfLine);
    return variables;
  }
  return null;
};

const createConfigPath = args => {
  if (args.length && args[0].includes('path')) {
    return `${args[0].split('=')[1]}/config.js`;
  }
  return `./config.js`;
};

const args = process.argv.slice(2);

const envPath = './.env';
const configPath = createConfigPath(args);

fileExist(configPath);

if (ENVIRONMENT) {
  const variables = sourceFile();
  variables.map(line => createEnvValueFromOS(line, configPath));
  fs.appendFileSync(configPath, `}`);
} else {
  readFile(envPath, configPath);
}
