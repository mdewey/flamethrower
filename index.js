// load encounter json

import fs from 'fs-extra';

const loadEncounterJson = () => {
  const data = fs.readJSONSync('data\\Encounter\\97953483.json');
  return data;
};

const data = loadEncounterJson();
const references = data.entry[0].resource.participant.map((p) => p.individual.reference);
const uniqueReferences = [...new Set(references)];
console.log({ uniqueReferences });
console.log(uniqueReferences.length);
