import axios from 'axios';

import https from 'node:https';

import { openJsonFile, logger } from '../utils/index';
import { getAndSaveCernerResource } from '../utils/cerner';

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

const splitResourceId = (resourceId) => {
  const split = resourceId.split('/');
  return {
    resource: split[0],
    id: split[1],
  };
};

const uploadToFhirServer = async (resourceId) => {
// open file and post data
  const { resource, id } = splitResourceId(resourceId);
  const data = openJsonFile({
    folder: resource,
    fileName: `${id}.json`,
  });
  logger.info(data);
  const url = `${FHIR_MOCK_SERVER}/${resource}`;
  const resp = await axios.post(
    url,
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

const upload = async () => {
  logger.info('doing the thing');
  // uploadToFhirServer('MedicationDispense/minimal');
  await uploadToFhirServer('MedicationDispense/no-references');
};

export {
  upload,
};
