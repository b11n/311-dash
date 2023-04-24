const express = require('express');

const elastic  = require('./elastic');

const DEFAULT_START = '2023-01-01';
const DEFAULT_END = '2023-04-01';

const app = express();

app.get('/api/raw', (request, response) => {
    const from = request.query.from || DEFAULT_START;
    const to = request.query.to || DEFAULT_END;
    const neighbourhood = request.query.neighbourhood || null;
    Promise.all([
        elastic.constructLineGraphData(from, to, neighbourhood), 
        elastic.constructToIssuesData(from, to, neighbourhood),
        elastic.constructTableData(from,to, neighbourhood),
        // getRawDataCount(from, to, neighbourhood)
    ]).then((data) => {
        const tableData = data[2];
        response.send({
            chartData: data[0],
            issuesData: data[1],
            rawData: tableData.rows,
            count: tableData.total,
        })
    })
});

app.get('/api/table', (request, response) => {
    const from = request.query.from || DEFAULT_START;
    const to = request.query.to || DEFAULT_END;
    const neighbourhood = request.query.neighbourhood || null;
    const offset = request.query.offset || 0;
    Promise.all([
        elastic.constructTableData(from,to, neighbourhood,offset)]).then((data) => {
        response.send({
            rawData: data[0].rows
        })
    })
});


app.listen(3000);