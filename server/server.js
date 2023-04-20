const express = require('express');
const duckdb = require('duckdb');

var db = new duckdb.Database(':memory:'); // or a file name for a persistent DB



const DEFAULT_START = '2023-01-01';
const DEFAULT_END = '2023-04-01';

const app = express();

app.get('/api/raw', (request, response) => {
    const from = request.query.from || DEFAULT_START;
    const to = request.query.to || DEFAULT_END;
    const neighbourhood = request.query.neighbourhood || "";
    Promise.all([
        constructLineGraphData(from, to, neighbourhood), 
        constructToIssuesData(from, to, neighbourhood),
        constructRawData(from,to, neighbourhood),
        getRawDataCount(from, to, neighbourhood)]).then((data) => {
            console.log(data[3])
        response.send({
            chartData: data[0],
            issuesData: data[1],
            rawData: data[2],
            count: data[3][0].count
        })
    })
});

app.get('/api/table', (request, response) => {
    const from = request.query.from || DEFAULT_START;
    const to = request.query.to || DEFAULT_END;
    const neighbourhood = request.query.neighbourhood || "";
    const offset = request.query.offset || 0;
    Promise.all([
        constructRawData(from,to, neighbourhood,offset)]).then((data) => {
        response.send({
            rawData: data[0]
        })
    })
});



/**
 * Constructs the line graph data.
 * @param {string} from 
 * @param {string} to 
 * @returns 
 */
function constructLineGraphData(from, to, neighbourhood) {
    const fromDate = new Date(from).getTime();
    const toDate = new Date(to).getTime();
    const diff = toDate - fromDate;

    // If difference is more than 5 months, return 
    // with month level agregation, else aggregate in days.
    trunc = 'month'
    if (diff < 10368000000) {
        trunc = 'day'
    }

    let filterQuery = "";
    if (neighbourhood !== "") {
        filterQuery = `AND Neighborhood = '${neighbourhood}'`;
    }

    // TODO(b11n): Update this to an ORM based call or a prepared statement;
    const statement = "SELECT datetrunc('" + trunc + "',Opened) as date, COUNT(*) as count FROM '../data/small.csv' WHERE Opened > '" + from + "' AND Opened < '" + to + "' " + filterQuery + " GROUP BY date ORDER BY date asc ;";
    return new Promise((resolve, reject) => {
        db.all(statement, function (err, res) {
            if (err) {
                throw err;
            }
            resolve(res);
        });
    });
}


function constructToIssuesData(from, to, neighbourhood) {

    let filterQuery = "";
    if (neighbourhood !== "") {
        filterQuery = `AND Neighborhood = '${neighbourhood}'`;
    }

    // TODO(b11n): Update this to an ORM based call or a prepared statement;
    const statement = "SELECT DISTINCT(Category) as Category, count(*) as count FROM '../data/small.csv' WHERE Opened > '" + from + "' AND Opened < '" + to + "' " + filterQuery + " GROUP BY Category ORDER BY count desc ;";
    return new Promise((resolve, reject) => {
        db.all(statement, function (err, res) {
            if (err) {
                throw err;
            }
            resolve(res);
        });
    });
}

function getRawDataCount(from, to, neighbourhood, offset = 0) {
    let filterQuery = "";
    if (neighbourhood !== "") {
        filterQuery = `AND Neighborhood = '${neighbourhood}'`;
    }

    // TODO(b11n): Update this to an ORM based call or a prepared statement;
    const statement = "SELECT count(*) as count FROM '../data/small.csv' WHERE Opened > '" + from + "' AND Opened < '" + to + "' " + filterQuery + ";";
    return new Promise((resolve, reject) => {
        db.all(statement, function (err, res) {
            if (err) {
                throw err;
            }
            resolve(res);
        });
    });
}

function constructRawData(from, to, neighbourhood, offset = 0) {

    let filterQuery = "";
    if (neighbourhood !== "") {
        filterQuery = `AND Neighborhood = '${neighbourhood}'`;
    }

    // TODO(b11n): Update this to an ORM based call or a prepared statement;
    const statement = "SELECT * FROM '../data/small.csv' WHERE Opened > '" + from + "' AND Opened < '" + to + "' " + filterQuery + " ORDER BY CaseID LIMIT 10 OFFSET "+offset+";";
    return new Promise((resolve, reject) => {
        db.all(statement, function (err, res) {
            if (err) {
                throw err;
            }
            resolve(res);
        });
    });
}


app.listen(3000);