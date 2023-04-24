import {parse} from 'csv-parse';
import fs from 'fs';
import { Client } from '@elastic/elasticsearch';
import config from 'config';

const elasticConfig = config.get('elastic');

const client = new Client({
  cloud: {
    id: elasticConfig.cloudID
  },
  auth: {
    username: elasticConfig.username,
    password: elasticConfig.password
  }
})

client.info()
  .then(response => console.log(response))
  .catch(error => console.error(error))

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

let operations = [];

fs.createReadStream("../data/311_Cases.csv")
  .pipe(parse({ delimiter: ",", from_line: 6300000,to_line: 6499999  }))
  .on("data", async function (row) {

    operations.push({ index: { _index: 'one' } });
    operations.push(constructRecord(row))
    count++;

    if(count % 30000 == 0) {
        console.log("Write")
        await writeBulk();
        operations = new Array();
        console.log(count);
    }
    


  })
  .on("end", async function () {
    await writeBulk();
    console.log(count);
  
  })
  .on("error", function (error) {
    console.log(error.message);
  });


  function constructRecord(valuesArr) {
    const ret= {};
    valuesArr.forEach((val, index)=>{
        if(keys[index] === "Opened") {
            ret[keys[index]] = new Date(val);

        }else {
            ret[keys[index]] = val;
        }
        

    })

    return ret;
  }

async function writeBulk() {
    const bulkResponse = await client.bulk({ refresh: true, operations })

    if (bulkResponse.errors) {
      const erroredDocuments = []
      // The items array has the same order of the dataset we just indexed.
      // The presence of the `error` key indicates that the operation
      // that we did for the document has failed.
      bulkResponse.items.forEach((action, i) => {
        const operation = Object.keys(action)[0]
        if (action[operation].error) {
          erroredDocuments.push({
            // If the status is 429 it means that you can retry the document,
            // otherwise it's very likely a mapping error, and you should
            // fix the document before to try it again.
            status: action[operation].status,
            error: action[operation].error,
            operation: operations[i * 2],
            document: operations[i * 2 + 1]
          })
        }
      })
      console.log(erroredDocuments)
    }
}