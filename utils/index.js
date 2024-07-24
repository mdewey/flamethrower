import fs from 'fs-extra';
import path from 'node:path';
import pino from 'pino';

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
});

const { dirname } = import.meta;

const openJsonFile = ({ folder, fileName }) => {
  const pathToOpen = path
    .join(dirname.replace('\\utils', ''), `/data/${folder}/${fileName}`);
  // check if file exists
  logger.info({ path: pathToOpen, dirname }, 'opening file');
  const json = fs.readJSONSync(pathToOpen);
  return json;
};

const saveJsonFile = ({ folder, fileName, data }) => {
  const pathToSave = path
    .join(dirname.replace('\\utils', ''), `/data/${folder}/${fileName}`);
  // check if file exists
  logger.info({ path: pathToSave, dirname }, 'saving file');
  fs.outputJSONSync(pathToSave, data, { spaces: 2 });
};

export {
  saveJsonFile,
  openJsonFile,
  logger,
};
