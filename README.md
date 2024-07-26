# Things

- Figure out the order,
- script the order
- document the process

# Mock data tree

To get the `\data\MedicationDispense\sample.json` Upload I need

"id": "5210966",

"reference": "Patient/12724065",

Practitioner/12744688
Practitioner/12732053
Practitioner/4122622

"reference": "Practitioner/12724045",

- no references

"reference": "Encounter/97953483"

- 50 refences to practiioners
    'Practitioner/11817978', 'Practitioner/763923',
    'Practitioner/12744839', 'Practitioner/12793249',
    'Practitioner/12840391', 'Practitioner/12784022',
    'Practitioner/12750302', 'Practitioner/12742069',
    'Practitioner/12759637', 'Practitioner/12732057',
    'Practitioner/12742711', 'Practitioner/12742666',
    'Practitioner/12732049', 'Practitioner/12732063',
    'Practitioner/12742668', 'Practitioner/12742614',
    'Practitioner/12742384', 'Practitioner/4122625',
    'Practitioner/1',        'Practitioner/12742667',
    'Practitioner/12746397', 'Practitioner/12742892',
    'Practitioner/607928',   'Practitioner/12798938',
    'Practitioner/12807021', 'Practitioner/12784000',
    'Practitioner/12743472', 'Practitioner/744113',
    'Practitioner/12762687', 'Practitioner/12747925',
    'Practitioner/12718044', 'Practitioner/12724045',
    'Practitioner/12743144', 'Practitioner/12724064',
    'Practitioner/12742072', 'Practitioner/12743897',
    'Practitioner/12742070', 'Practitioner/12742071',
    'Practitioner/12742694', 'Practitioner/12736052',
    'Practitioner/12732051', 'Practitioner/12724044',
    'Practitioner/12742490', 'Practitioner/12742530',
    'Practitioner/12732044', 'Practitioner/12742500',
    'Practitioner/12742606', 'Practitioner/12742596',
    'Practitioner/744122',   'Practitioner/12742577'
- 1 to Organization/1024451
- 1 to Location/165826097

"reference": "Organization/1024451"

- no references

"reference": "Location/2552105067",

- no references

"reference": "MedicationRequest/311877819"

Patient/12724065
Encounter/97953483
Practitioner/2

# I need to create

To recreate the meds dis I need to create and save the ids of a

- [x]"reference": "Patient/12724065",
- [ ]"reference": "Encounter/97953483"
- [ ]"reference": "Practitioner/12724045",
- [x]"reference": "Organization/1024451"
- [ ]"reference": "Location/2552105067",
- [ ]"reference": "MedicationRequest/311877819"
