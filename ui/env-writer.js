/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const readline = require('readline');
const os = require('os');

const deleteFile = path => {
  fs.unlinkSync(path);
};

const createFile = path => {
  // eslint-disable-next-line no-useless-catch
  try {
    fs.writeFileSync(path, 'window.ENVIRONMENT = {');
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
    const lines = fs.readFileSync(`./environments/${ENVIRONMENT}`);
    const variables = lines.toString().split(endOfLine);
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
const { ENVIRONMENT } = process.env;

if (ENVIRONMENT) {
  const variables = sourceFile();
  variables.map(line => createEnvValueFromOS(line, configPath));
  fs.appendFileSync(configPath, `}`);
} else {
  readFile(envPath, configPath);
}
