const express = require("express");
const app = express();
const session = require("express-session");

app.use(session({
    secret:"shsh!Secret!",
    resave: false,
    saveUninitialized: false
}));

app.get('/', (req,res)=>{
    res.json({ message: "Test API" });
});

app.use("/api/users", require('./user'));

app.listen(3000, ()=>{
    console.log("Server listening to the port 3000!");
})