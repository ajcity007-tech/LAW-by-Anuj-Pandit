require('dotenv').config();
const { initDatabase } = require('./models/database');
const Book = require('./models/Book');

async function test() {
  await initDatabase();
  console.log(Book.findAll());
}

test();
