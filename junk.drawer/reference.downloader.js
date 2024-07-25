import fs from 'fs-extra';
import jp from 'jsonpath';

import { getAndSaveCernerResource } from '../utils/cerner.js';

const loadEncounterJson = (filePath) => {
  console.log({ filePath });
  const data = fs.readJSONSync(filePath);
  return data;
};

const resources = fs.readdirSync('data');

console.log({ resources });

const filesArrays = resources.map((resource) => {
  const resourceFiles = fs.readdirSync(`data\\${resource}`);
  return resourceFiles.map((file) => `data\\${resource}\\${file}`);
});

const files = filesArrays.flat();

console.log({ files });

const references = [];

files.forEach((file) => {
  const data = loadEncounterJson(file);
  const refs = jp.query(data, '$..reference');
  references.push(...refs);
});
const uniqueReferences = [...new Set(references)];
console.log({ uniqueReferences });
console.log(uniqueReferences.length);

// Check to see if we have the json file

const missingFiles = uniqueReferences.filter((ref) => {
  const filePath = `data\\${ref}.json`;
  return !fs.existsSync(filePath);
});

console.log({ missingFiles });
console.log(missingFiles.length);

// load the missing files form cerner

missingFiles.forEach(async (ref) => {
  const [resource, id] = ref.split('/');
  await getAndSaveCernerResource({ resource, id });
});
