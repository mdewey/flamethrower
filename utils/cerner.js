import axios from 'axios';
import { logger, saveJsonFile } from './index.js';

const getScope = (resource) => {
  switch (resource) {
    case 'Patient':
      return 'system/Patient.read';
    case 'MedicationDispense':
      return 'system/MedicationDispense.read';
    case 'MedicationRequest':
      return 'system/MedicationRequest.read';
    case 'Encounter':
      return 'system/Encounter.read';
    case 'Organization':
      return 'system/Organization.read';
    case 'Location':
      return 'system/Location.read';
    case 'Practitioner':
      return 'system/Practitioner.read';
    case 'RelatedPerson':
      return 'system/RelatedPerson.read';
    default:
      logger.error({ resource }, 'Invalid resource');
      throw new Error('Invalid resource');
  }
};

const getToken = async ({ resource }) => {
  const { CERNER_CLIENT_ID, CERNER_SECRET } = process.env;
  const myHeaders = new Headers();
  myHeaders.append('Accept', 'application/json');
  myHeaders.append(
    'Authorization',
    `Basic ${Buffer.from(`${CERNER_CLIENT_ID}:${CERNER_SECRET}`).toString(
      'base64',
    )}`,
  );
  myHeaders.append('Cache-Control', 'no-cache');
  myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

  const urlencoded = new URLSearchParams();
  urlencoded.append('grant_type', 'client_credentials');
  urlencoded.append('scope', getScope(resource));

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
    redirect: 'follow',
  };

  logger.info({ requestOptions }, 'fetching token');

  const response = await fetch(
    'https://authorization.cerner.com/tenants/ec2458f2-1e24-41c8-b71b-0e701af7583d/protocols/oauth2/profiles/smart-v1/token',
    requestOptions,
  );
  const json = await response.json();
  return json;
};

const getResource = async ({ token, resource, id }) => {
  logger.info({ token, resource, id }, 'getting resource');
  const url = `https://fhir-ehr.cerner.com/r4/ec2458f2-1e24-41c8-b71b-0e701af7583d/${resource}?_id=${id}`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token.access_token}`,
      'Content-Type': 'application/fhir+json',
      Accept: 'application/fhir+json',
    },
  });
  const body = await response.json();
  return body;
};

const getAndSaveCernerResource = async ({ resource, id }) => {
  logger.info({ resource, id }, 'starting the resource saving');
  const token = await getToken({ resource });
  logger.info('got token');
  const data = await getResource({ token, resource, id });
  logger.info(`saving data: ${resource}/${id}.json`);
  saveJsonFile({ folder: resource, fileName: `${id}.json`, data });
};

export { getAndSaveCernerResource, getToken };
