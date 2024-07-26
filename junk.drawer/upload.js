import axios from 'axios';

import https from 'node:https';

import { log } from 'node:console';
import { openJsonFile, logger, saveJsonFile } from '../utils/index.js';
import { getAndSaveCernerResource } from '../utils/cerner.js';

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


const uploadToFHIRServer = async (entry) =>{
  const resource = entry.resourceType;
  const url = `${FHIR_MOCK_SERVER}/${resource}`;
  const resp = await axios.post(
    url,
    entry,
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
  });
  return resp.data;
}

const uploadFileToFhirServer = async (resourceId) => {
// open file and post data
  const { resource, id } = splitResourceId(resourceId);
  const data = openJsonFile({
    dataFolder: 'data.templates',
    folder: resource,
    fileName: `${id}.json`,
  });
  return await uploadToFHIRServer(data);
};





const medicationsRequestFactory = ({
  resourceId,
  patient,
  encounter,
  practitioner,
}) => {
  const { resource, id } = splitResourceId(resourceId);
  const data = openJsonFile({
    dataFolder: 'data.templates',
    folder: resource,
    fileName: `${id}.json`,
  });
  data.subject.reference = patient
  data.encounter.reference = encounter
  data.requester.reference = practitioner
  return data;
}

const encounterFactory = ({
  resourceId,
  patient,
  location,
  practitioner,
}) => {
  const { resource, id } = splitResourceId(resourceId);
  const data = openJsonFile({
    dataFolder: 'data.templates',
    folder: resource,
    fileName: `${id}.json`,
  });
  data.subject.reference = patient
  data.location = [
    {
      "location": {
        "reference": location,
        "display": "Model Cancer Center, MX CC, MedOncClin"
      },
      "status": "completed"
    }
  ]

  data.participant = [{
    "type": [
      {
        "coding": [
          {
            "system": "https://fhir.cerner.com/ec2458f2-1e24-41c8-b71b-0e701af7583d/codeSet/333",
            "code": "1116",
            "display": "Admitting Physician",
            "userSelected": true
          },
          {
            "system": "http://terminology.hl7.org/CodeSystem/v3-ParticipationType",
            "code": "ADM",
            "display": "admitter",
            "userSelected": false
          }
        ],
        "text": "Admitting Physician"
      }
    ],
    "period": {
      "start": "2020-03-05T17:29:10.000Z"
    },
    "individual": {
      "reference": practitioner,
      "display": "Carter, Kristin Cerner"
    }
  }]

  return data;
}


//TODO: add display names at some point
const medicationDispenseFactory = async ({
  resourceId,
  patient,
  organization,
  practitioner,
  location,
  encounter,
  medicationsRequest
})=> {
  const { resource, id } = splitResourceId(resourceId);
  const data = openJsonFile({
    dataFolder: 'data.templates',
    folder: resource,
    fileName: `${id}.json`,
  });
  data.subject.reference = patient
  data.performer.push({
      "actor": {
        "reference": organization
      }
  })
  data.performer.push({
    "actor": {
      "reference": practitioner,
    }
  })
  data.location.reference = location;
  data.authorizingPrescription.push({
    "reference": medicationsRequest
  })
  data.context.reference = encounter
  return data;
}

const saveJsonToFolder = async ({json}) => {
  saveJsonFile({
    folder:json.resourceType,
    fileName:`${json.id}.json`,
    data:json, 
    dataFolder:'data.uploaded.mocks'
  })
}

const upload = async () => {
  logger.info('doing the thing');

  // upload the patient
  const patient = await uploadFileToFhirServer('Patient/wilma');
  saveJsonToFolder({json:patient})
  // get the patient id
  const patientReference = `Patient/${patient.id}`;


  // upload organization
  const organization = await uploadFileToFhirServer('Organization/sample');
  saveJsonToFolder( {json: organization});
  const orgReference = `Organization/${organization.id}`

  // create practitioner
  const practitioner = await uploadFileToFhirServer('Practitioner/graham');
  saveJsonToFolder({json:practitioner})
  const practitionerReference = `Practitioner/${practitioner.id}`

  // add Location
  const location = await uploadFileToFhirServer('Location/sample');
  saveJsonToFolder({json:location});
  const locationReference = `Location/${location.id}`

  // create encounter
  const encounter = encounterFactory({
    resourceId: 'Encounter/sample',
    patient:patientReference,
    location:locationReference,
    practitioner:practitionerReference,
  })

  const encounterEntry = await uploadToFHIRServer(encounter);
  saveJsonToFolder({json:encounterEntry});
  const encounterReference = `Encounter/${encounterEntry.id}`
  
  
  // add  medsrequest
  const medsRequest = medicationsRequestFactory({
    resourceId:"MedicationsRequest/sample",
    patient:patientReference,
    encounter:encounterReference, 
    practitioner:practitionerReference
  })
  const medsRequestEntry = await uploadToFHIRServer(medsRequest);
  saveJsonToFolder({json:medsRequestEntry})

  const medsRequestReference = `MedicationRequest/${medsRequestEntry.id}`


  // set the reference on the medication dispense
  const  medsDispense = await medicationDispenseFactory({
    resourceId:'MedicationDispense/sample',
    patient:patientReference,
    organization: orgReference,
    practitioner:practitionerReference,
    location:locationReference,
    encounter:encounterReference,
    medicationsRequest:medsRequestReference
  });
  logger.info({medsDispense});
  // // upload the medications dispense
  const final = await uploadToFHIRServer(medsDispense);
  saveJsonToFolder({json:final})
  logger.info(`created meds : ${final.id}`);
};

export {
  upload,
};
