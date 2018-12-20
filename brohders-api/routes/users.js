var express = require('express');
var router = express.Router();
const uuid = require('uuid/v1');
const md5 = require("md5");
const { Client } = require('pg')
const { pgConfig } = require('../config');

/* GET users listing. */
router.post('/:username/login', async function(req, res, next) {
  try {
    let userStore = req.app.locals.userStore;
    let userName = req.params.username.toLowerCase();
    let pass = req.body.pass;
    if(!userName || !pass){
      res.sendStatus(400);
    } else {
      const client = new Client(pgConfig);
      await client.connect();
      pass = md5(pass);
      console.log("Logging in :", `${userName}:${pass}`);
      let user = await client.query(`SELECT * FROM users WHERE username=$1 AND password_hash=$2`,[userName,pass]);
      await client.end()
      if(!user.rows.length){
        res.sendStatus(404);
      } else {
        user = user.rows[0];
        let logged = userStore.find(u => u.user.userid == user.userid);
        if(!logged) {
          logged = {
            user: {
              userid: user.userid,
              name: user.name,
              username: user.username
            },
            token: uuid()
          }
          userStore.push(logged);
        }
        res.send(logged)
      }
    }
  } catch(err){
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  let username = req.body.username;
  let name = req.body.name;
  let lastname = req.body.lastname;
  let password = req.body.password;
  let roleid = req.body.roleid;
  if(!username || !name || !password || !roleid){
    res.sendStatus(400);
  } else {
    try {
      let pass = md5(password);
      const client = new Client(pgConfig);
      await client.connect()
      const user = await client.query(`
      INSERT INTO users(username,name,password_hash,lastname,roleid) 
      VALUES($1,$2,$3,$4,$5) 
      RETURNING *`
      ,[username,name,pass,lastname,roleid])
      await client.end()
      if(user){
        res.sendStatus(200);
      } else {
        throw "User not created";
      }
    } catch(err){
      next(err);
    }
  }
})

router.get("/", (req, res, next) => {
  try {
    res.send(req.app.locals.users.map(u => {
      return {
        id: u.id,
        user: u.user,
        name: u.name
      }
    }))
  } catch(err){
    next(err);
  }
})

module.exports = router;
