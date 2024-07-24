import axios from 'axios';

import https from 'node:https';

// const FHIR_MOCK_SERVER = 'https://mhv-intb-api.myhealth.va.gov/fhir-ignite';
const FHIR_MOCK_SERVER = 'http://localhost:3000/r4/123-123-123';

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
  const data = {
    resourceType: 'MedicationDispense',
  };

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
  console.log('posted');
};

const start = async () => {
  // const medsDispense = await getMedsDispense();
  // console.log(medsDispense.data.total);
  // let clicks = 0;
  // setInterval(async () => {
  //   clicks++;
  //   const medsDispense = await getMedsDispense();
  //   console.log(medsDispense.data.total, clicks);
  // }, 1000);
  await postMedsDispense();
  // const after = await getMedsDispense();
  // console.log(after.data.total);
};

await start();
