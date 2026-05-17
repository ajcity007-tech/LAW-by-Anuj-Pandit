const initSqlJs = require('sql.js');
const fs = require('fs');

async function check() {
  const SQL = await initSqlJs();
  const filebuffer = fs.readFileSync('./db/lexprep.db');
  const db = new SQL.Database(filebuffer);
  const res = db.exec("SELECT count(*) FROM books");
  console.log(JSON.stringify(res));
}

check();
