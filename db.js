const {Client} = require('pg');

const client = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "postgres",
    database: "TaskDB"
})

client.connect(console.log("Connected to DB."));

module.exports = client;