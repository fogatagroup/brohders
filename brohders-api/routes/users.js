var express = require('express');
var router = express.Router();
const uuid = require('uuid/v1');

/* GET users listing. */
router.post('/:username/login', function(req, res, next) {
  try {
    let userStore = req.app.locals.userStore;
    let users = req.app.locals.users;
    let userName = req.params.username.toLowerCase();
    let pass = req.body.pass;
    console.log("DATA:", `${userName}:${pass}`);
    if(!userName || !pass){
      res.sendStatus(400);
    } else {
      let user = users.find(u => u.user == userName && u.pass == pass);
      if(!user){
        res.sendStatus(404);
      } else {
        let logged = userStore.find(u => u.user.id == user.id);
        if(!logged) {
          logged = {
            user: {
              id: user.id,
              name: user.name,
              user: user.user
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
