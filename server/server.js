const express = require('express');
const duckdb = require('duckdb');

var db = new duckdb.Database(':memory:'); // or a file name for a persistent DB



const DEFAULT_START = '2023-01-01';
const DEFAULT_END = '2023-04-01';

const app = express();

app.get('/api/raw', (request,response)=>{
    const from = request.query.from || DEFAULT_START;
    const to = request.query.to || DEFAULT_END;
    console.log(from, to)
    Promise.all([constructLineGraphData(from,to), constructToIssuesData(from, to)]).then((data)=>{
        response.send({
            chartData: data[0],
            issuesData: data[1]
        })
    })
});


/**
 * Constructs the line graph data.
 * @param {string} from 
 * @param {string} to 
 * @returns 
 */
function constructLineGraphData(from, to) {
    const fromDate = new Date(from).getTime();
    const toDate = new Date(to).getTime();
    const diff = toDate - fromDate;

    // If difference is more than 5 months, return 
    // with month level agregation, else aggregate in days.
    trunc = 'month'
    if(diff < 10368000000) {
        trunc = 'day'
    }
    
    // TODO(b11n): Update this to an ORM based call or a prepared statement;
    const statement = "SELECT datetrunc('"+trunc+"',Opened) as date, COUNT(*) as count FROM '../data/small.csv' WHERE Opened > '"+from+"' AND Opened < '"+to+"' GROUP BY date ORDER BY date asc ;";
    return new Promise((resolve, reject)=>{
        db.all(statement, function(err, res) {
            if (err) {
              throw err;
            }
            resolve(res);
          });
    });
}


function constructToIssuesData(from, to) {
    // TODO(b11n): Update this to an ORM based call or a prepared statement;
    const statement = "SELECT DISTINCT(Category) as Category, count(*) as count FROM '../data/small.csv' WHERE Opened > '"+from+"' AND Opened < '"+to+"' GROUP BY Category ORDER BY count desc ;";
    return new Promise((resolve, reject)=>{
        db.all(statement, function(err, res) {
            if (err) {
              throw err;
            }
            resolve(res);
          });
    });
}

app.listen(3000);