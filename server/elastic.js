const { Client } = require('@elastic/elasticsearch');
const config = require('config');

const elasticConfig = config.get('elastic');

const client = new Client({
    cloud: {
        id: elasticConfig.cloudID
    },
    auth: {
        username: elasticConfig.username,
        password: elasticConfig.password
    }
});



function fromToAndNeighbourhoodQueryFilter(from, to, neighbourhood) {
    let filters = [
        {
            "range": {
                "Opened": {
                    "gte": from,
                    "lte": to
                }
            }
        },
    ];
    if(neighbourhood !== null) {
        filters.push({
            "match_phrase": {
                "Neighborhood": neighbourhood
            }
        });
    }
    return filters;
}


function lineGraphQueryBody(from, to, neighbourhood = null) {
    return {
        "size": 0,
        "query": {
            "bool": {
                "filter": fromToAndNeighbourhoodQueryFilter(from, to, neighbourhood)
            }
        },
        "aggs": {
            "count_over_time": {
                "date_histogram": {
                    "field": "Opened",
                    "calendar_interval": "day"
                }
            }
        }
    };
}

function topIssuesQueryBody(from, to, neighbourhood = null) {
    return {
        "query": {
            "bool": {
                "filter": fromToAndNeighbourhoodQueryFilter(from, to, neighbourhood)
            }
        },
        "aggs": {
            "count_over_time": {
                "terms": {
                    "field": "Category.keyword",
                    "size": 1000
                }
            }
        }
    };
}

function tableQueryBody(from, to, neighbourhood = null, offset = null) {
    const retObj = {
        "from": 0,
        "size":10,
        "query": {
            "bool": {
                "filter": fromToAndNeighbourhoodQueryFilter(from, to, neighbourhood)
            }
        },
    };
    if(offset !== null) {
        retObj['from'] = parseInt(offset);
    }
    console.log(retObj)
    return retObj;
}

function constructLineGraphData(from, to, neighbourhood) {
    return client.search({ index: 'one', body: lineGraphQueryBody(from, to,neighbourhood) }).then((data)=>{
        return data.aggregations.count_over_time.buckets.map(bucket=>{
            return {
                date: bucket['key_as_string'],
                count: bucket['doc_count']
            };
        });
    });
}

function constructToIssuesData(from, to , neighbourhood) {
    return client.search({ index: 'one', body: topIssuesQueryBody(from, to,neighbourhood) }).then((data)=>{
        return data.aggregations.count_over_time.buckets.map(bucket=>{
            return {
                Category: bucket['key'],
                count: bucket['doc_count']
            };
        });
    });
}


function constructTableData(from, to , neighbourhood, offset = null) {
    return client.search({ index: 'one', body: tableQueryBody(from, to,neighbourhood, offset) }).then((data)=>{
        console.log(data.hits);
        return {
            total: data.hits.total.value,
            rows: data.hits.hits.map(hit=>{
                return hit._source;
            })
        }
    });
}


module.exports = {
    constructLineGraphData,
    constructToIssuesData,
    constructTableData,
}