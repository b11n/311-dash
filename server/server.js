const express = require('express');

const elastic = require('./elastic');

const DEFAULT_START = '2023-01-01';
const DEFAULT_END = '2023-04-01';

const app = express();

app.use((req, res, next) => {
    const from = req.query.from || DEFAULT_START;
    const to = req.query.to || DEFAULT_END;
    const neighbourhood = req.query.neighbourhood || null;

    req.parsedParams = { from, to, neighbourhood };

    next();
})

app.get('/api/raw', (request, response) => {
    const { from, to, neighbourhood } = request.parsedParams;
    Promise.all([
        elastic.constructLineGraphData(from, to, neighbourhood),
        elastic.constructToIssuesData(from, to, neighbourhood),
        elastic.constructTableData(from, to, neighbourhood),
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


app.get('/api/linechart', (request, response) => {
    const { from, to, neighbourhood } = request.parsedParams;
    elastic.constructLineGraphData(from, to, neighbourhood).then((data) => {
        response.send(data);
    });
});

app.get('/api/table', (request, response) => {
    const { from, to, neighbourhood } = request.parsedParams;
    const offset = request.query.offset || 0;
    Promise.all([
        elastic.constructTableData(from, to, neighbourhood, offset)]).then((data) => {
            response.send({
                count: data[0].total,
                rows: data[0].rows
            })
        })
});

app.get('/api/topissues', (request, response) => {
    const { from, to, neighbourhood } = request.parsedParams;
    elastic.constructToIssuesData(from, to, neighbourhood).then((data) => {
        response.send(data);
    });
});




app.listen(3000);