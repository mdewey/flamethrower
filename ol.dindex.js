import axios from 'axios';

import https from 'node:https';

import { openJsonFile, logger } from './utils/index.js';
import { getAndSaveCernerResource } from './utils/cerner.js';

const FHIR_MOCK_SERVER = 'https://mhv-intb-api.myhealth.va.gov/fhir-ignite';
// const FHIR_MOCK_SERVER = 'http://localhost:3000/r4/123-123-123';

const httpsAgent = new https.Agent({
  rejectUnauthorized: false, // (NOTE: this will disable client verification)
});

const getMedsDispense = async ({ params = {} } = {}) => {
  const data = await axios.get(`${FHIR_MOCK_SERVER}/MedicationDispense`, {
    httpsAgent,
  });
  return data;
};

const postMedsDispense = async () => {
// open file and post data
  const data = openJsonFile({
    folder: 'MedicationDispense',
    fileName: 'sample.json',
  });
  logger.info(data);
  const resp = await axios.post(
    `${FHIR_MOCK_SERVER}/MedicationDispense`,
    data,
    {
      httpsAgent,
      headers: {
        'Content-Type': 'application/fhir+json',
        Accept: 'application/fhir+json',
      },
    },
  );
  logger.info('posted');
  logger.info({
    status: resp.status,
    statusText: resp.statusText,
    body: resp.data,
  });
};

const loadMedsDispenseData = async () => {
  const medsDispense = await getMedsDispense();
  logger.info(medsDispense.data.total);
  // let clicks = 0;
  // setInterval(async () => {
  //   clicks += 1;
  //   const resp = await getMedsDispense();
  //   logger.info(resp.data.total, clicks);
  // }, 1000);
  await postMedsDispense();
};

const saveCernerData = async () => {
  await getAndSaveCernerResource({ resource: 'Patient', id: '12724065' });
  await getAndSaveCernerResource({ resource: 'Encounter', id: '97953483' });
  await getAndSaveCernerResource({ resource: 'MedicationRequest', id: '311877819' });
  await getAndSaveCernerResource({ resource: 'Location', id: '2552105067' });
  await getAndSaveCernerResource({ resource: 'Organization', id: '1024451' });
  await getAndSaveCernerResource({ resource: 'Practitioner', id: '12724045' });
  await getAndSaveCernerResource({ resource: 'Practitioner', id: '12744688' });
  await getAndSaveCernerResource({ resource: 'Practitioner', id: '12732053' });
  await getAndSaveCernerResource({ resource: 'Practitioner', id: '4122622' });
};
