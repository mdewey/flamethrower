import fs from 'fs-extra';
import jp from 'jsonpath';

import { getAndSaveCernerResource } from '../utils/cerner.js';

import { logger } from '../utils/index.js';

const go = async () => {
  const loadEncounterJson = (filePath) => {
    logger.info({ filePath });
    const data = fs.readJSONSync(filePath);
    return data;
  };

  const resources = fs.readdirSync('data');

  logger.info({ resources });

  const filesArrays = resources.map((resource) => {
    const resourceFiles = fs.readdirSync(`data\\${resource}`);
    return resourceFiles.map((file) => `data\\${resource}\\${file}`);
  });

  const files = filesArrays.flat();

  logger.info({ files });

  const references = [];

  files.forEach((file) => {
    const data = loadEncounterJson(file);
    const refs = jp.query(data, '$..reference');
    references.push(...refs);
  });
  const uniqueReferences = [...new Set(references)];
  logger.info({ uniqueReferences });
  logger.info(uniqueReferences.length);

  // Check to see if we have the json file

  const missingFiles = uniqueReferences.filter((ref) => {
    const filePath = `data\\${ref}.json`;
    return !fs.existsSync(filePath);
  });

  logger.info({ missingFiles });
  logger.info(missingFiles.length);

  // load the missing files form cerner
  missingFiles.forEach(async (ref) => {
    const [resource, id] = ref.split('/');
    await getAndSaveCernerResource({ resource, id });
  });
};

export default go;
