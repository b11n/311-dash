import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore, Timestamp, FieldValue } from 'firebase-admin/firestore';
import {parse} from 'csv-parse';
import fs from 'fs';

initializeApp({
    credential: applicationDefault(),
    databaseURL: 'https://cal-311.firebaseio.com'
});

const db = getFirestore();
let batchs = [db.batch()];
let batchcount = 1;

const keys = [
    'CaseID',
    'Opened',
    'Closed',
    'Updated',
    'Status',
    'Status Notes',
    'Responsible Agency',
    'Category',
    'Request Type',
    'Request Details',
    'Address',
    'Street',
    'Supervisor District',
    'Neighborhood',
    'Police District',
    'Latitude',
    'Longitude',
    'Point',
    'Source',
    'Media URL',
    'SF Find Neighborhoods',
    'Current Police Districts',
    'Current Supervisor Districts',
    'Analysis Neighborhoods',
    'DELETE - Supervisor Districts',
    'DELETE - Fire Prevention Districts',
    'DELETE - Current Police Districts',
    'DELETE - Zip Codes',
    'DELETE - Police Districts',
    'DELETE - Neighborhoods',
    'DELETE - Neighborhoods_from_fyvs_ahh9',
    'DELETE - 2017 Fix It Zones',
    'DELETE - SF Find Neighborhoods',
    'Civic Center Harm Reduction Project Boundary',
    'DELETE - Current Supervisor Districts',
    'Fix It Zones as of 2017-11-06 ',
    'Invest In Neighborhoods (IIN) Areas',
    'DELETE - HSOC Zones',
    'Fix It Zones as of 2018-02-07',
    'CBD, BID and GBD Boundaries as of 2017',
    'Central Market/Tenderloin Boundary',
    'Areas of Vulnerability, 2016',
    'Central Market/Tenderloin Boundary Polygon - Updated',
    'HSOC Zones as of 2018-06-05',
    'OWED Public Spaces',
    'Parks Alliance CPSI (27+TL sites)',
    'Neighborhoods'
  ];


let count = 0;

fs.createReadStream("../data/311_Cases.csv")
  .pipe(parse({ delimiter: ",", from_line: 2,to_line:100000  }))
  .on("data", async function (row) {
    const ref = db.collection('cases').doc();
    batchs[batchcount-1].set(ref,constructRecord(row));
    count++;
    if(count % 500 == 0) {
      batchs.push(db.batch());
      batchcount++;
    }
  })
  .on("end", async function () {

    Promise.all(batchs.map(batch=>batch.commit())).then(()=>{
      console.log("fin")
    })
    console.log("finished");
  })
  .on("error", function (error) {
    console.log(error.message);
  });


  function constructRecord(valuesArr) {
    const ret= {};
    valuesArr.forEach((val, index)=>{
        ret[keys[index]] = val;
    })

    return ret;
  }