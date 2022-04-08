const express = require("express")
const router = express.Router();
const jwt = require("jsonwebtoken");
const client = require('./db');
  
router.post("/login", (req, res) => {
    const user = {
      username: req.username,  
      password: req.password 
    };
    jwt.sign({ user: user }, "secretkey", (err, token) => {  
          res.json({token: token, message: "login success!"});
    });
    if(user.username == "pradeep" || user.password == "pradeep@28"){
      req.session.user = "pradeep";
      req.session.admin = true;
    }
  });

  router.post("/register", (req,res)=>{
   const newUser = {
       first_name: req.first_name,
       last_name: req.last_name,
       email: req.email,
       password: req.password
   }
   client.query(
    `INSERT INTO user_list(first_name, last_name, email, password) VALUES (${newUser.first_name}, ${newUser.last_name}, ${newUser.email}, ${newUser.password})`,(err,result)=>{
      if(!err){
        res.status(200).send({
          message: "Registered successfully!",
          body: result.rows,
        });
      }
      else{
        res.status(500).send({
          message: "Error in registering details"
        })
      }
      client.end;
    });
   

  });

  router.put("/updateUser/:id", verifyToken, (req, res) => {
    jwt.sign(req.token, "secretkey", (err, users)=>{
      if(err){
        res.status(403).send()
      }
      else{
        const updateUser = {
          first_name: req.first_name,
          last_name: req.last_name,
          email: req.email,
          password: req.password
      }
        client.query(
          `UPDATE user_list SET first_name = ${updateUser.first_name}, last_name = ${updateUser.last_name}, email = ${updateUser.email}, password = ${updateUser.password} WHERE id = ${req.params.id}`,(err,result)=>{
            if(!err){
              res.status(200).send({ message: "User updated", lists: result.rows });
            }
            else{
              res.status(500).send(err.message)
            }
            client.end;
            });
      }
    });

  });

  router.get("/lists", verifyToken, (req,res)=>{
     jwt.sign(req.token, "secretkey", (err, users)=>{
      if (err) {  
        res.sendStatus(403);
      } else {
        client.query("select * from user_list",(error,dbRes)=>{
          if(!error){
            res.status(200).json({message:"Retrieving data from db", lists:dbRes.rows});
          }
          else{
              res.status(500).send(error.message);
          }
          client.end;
      })
      } 
     })
  })

  function verifyToken(req, res, next) {
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== "undefined") {
      const bearerToken = bearerHeader.split(" ")[1];  
      req.token = bearerToken;
      next();
    } else {
      res.sendStatus(403); 
    }
  }

  module.exports = router