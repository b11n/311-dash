import duckdb from 'duckdb';

var db = new duckdb.Database(':memory:'); // or a file name for a persistent DB

db.all("SELECT * FROM '../data/311_cases.csv' LIMIT 1000;", function(err, res) {
    if (err) {
      throw err;
    }
    console.log(res[0])
  });