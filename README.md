# Flamethrower

BLUF: this tool kit is for creating mock FHIR data for Medications Dispense. The goal is to create mock Medications Dispense, and all the referenced resources, in the FHIR-ignite server.

## Idea

- re-create OH health data in the lower enviroments of the MHV ecosystem
- Create a way to easliy recreate and create test data

## Process

- Start with the Medications Dispense FHIR object
- Download the FHIR json of the resources from the sandbox
- Strip out the entries from the bundles
- Upload entries in the correct order determined by the references

## How to use

- All the tools are in the `junk.drawer` folder
  - `cerner.js` has tools for interacting with the OH sandbox
  - `reference.download` has tools for downloading all references that a
  - `upload` has tools and processes for creating and uploading the data in the FHIR-ignite server.

## data folders

- `data.uploaded.mocks` is a copy of what was created in the MHV fhir-igite API
- `data.templates` is the templated resources that are used to create new data
- `data.sample.requirements`; the requirement for the mocks
- `data`; generic folder for data that didn't fit anywhere else

## Order for uploading Medication Dispense

To upload a Medications Dispense resource, the references must be created in this order

- patient
- organization
- practitioner
- location
- encounter
- Medication Request
- Medication Dispense

## To use

- Create a new template for all the resources that needed in the data folder
- Update the resource ids in the `junk.drawer.js/upload.js`.`upload` to point the new templates
- `npm start`
- Debug the challenges
