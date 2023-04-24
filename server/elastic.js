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


function lineGraphQueryBody(from, to, neighbourhood = null) {
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

    return {
        "size": 0,
        "query": {
            "bool": {
                "filter": filters
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

    return {
        "query": {
            "bool": {
                "filter": filters
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
        console.log(data)
        return data.aggregations.count_over_time.buckets.map(bucket=>{
            return {
                Category: bucket['key'],
                count: bucket['doc_count']
            };
        });
    });
}


module.exports = {
    constructLineGraphData,
    constructToIssuesData,
}