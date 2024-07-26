const myHeaders = new Headers();
myHeaders.append('Accept', 'application/json');
myHeaders.append(
  'Authorization',
  `Basic ${Buffer.from(
    'df202887-57fe-4767-a2c2-4e821c4fe412:Su82fRIH-aPlAV5va6IYqYqErYKP8bJ3',
  ).toString('base64')}`,
);
myHeaders.append('Cache-Control', 'no-cache');
myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

const urlencoded = new URLSearchParams();
urlencoded.append('grant_type', 'client_credentials');
urlencoded.append('scope', 'system/Patient.read');

const requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: urlencoded,
  redirect: 'follow',
};

console.log({ requestOptions });

fetch(
  'https://authorization.cerner.com/tenants/ec2458f2-1e24-41c8-b71b-0e701af7583d/protocols/oauth2/profiles/smart-v1/token',
  requestOptions,
)
  .then((response) => response.json())
  .then((result) => {
    console.log({ result });
    const url =
      'https://fhir-ehr.cerner.com/r4/ec2458f2-1e24-41c8-b71b-0e701af7583d/Patient?_id=12724065';
    fetch(url, {
      headers: {
        Authorization: `Bearer ${result.access_token}`,
        'Content-Type': 'application/fhir+json',
        Accept: 'application/fhir+json',
      },
    })
      .then(async (resp) => {
        const body = await resp.text();
        console.log({ resp, body });
      })
      .catch((err) => {
        console.error({ err });
      });
  })
  .catch((error) => console.error(error));
