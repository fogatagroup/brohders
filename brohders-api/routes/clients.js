const { Client } = require('pg')
const { pgConfig } = require('../config');
var express = require('express');
var router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const client = new Client(pgConfig);
    await client.connect()
    const clients = await client.query('SELECT * from clients')
    await client.end()
    res.send(clients.rows.filter(req.query.mod && req.query.mod == 'all' ? c => c : c => !c.isdeleted));
  } catch(err){
    next(err);
  }
})

router.get("/:clientid/shops", async (req, res, next) => {
  try {
    const client = new Client(pgConfig);
    await client.connect()
    const items = await client.query('SELECT * from shops where clientid=$1', [req.params.clientid])
    await client.end()
    res.send(items.rows.filter(req.query.mod && req.query.mod == 'all' ? i => i : i => !i.isdeleted));
  } catch(err){
    next(err);
  }
})

module.exports = router;
