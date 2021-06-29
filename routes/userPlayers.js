/*
  todo.js -- Router for the ToDoList
*/
const express = require('express');
const router = express.Router();
const ToDoItem = require('../models/PlayerDB')


/*
this is a very simple server which maintains a key/value
store using an object where the keys and values are lists of strings

*/

isLoggedIn = (req,res,next) => {
  if (res.locals.loggedIn) {
    next()
  } else {
    res.redirect('/login')
  }
}

// get the value associated to the key
router.get('/',
  isLoggedIn,
  async (req, res, next) => {
      res.locals.players = await PlayerDB.find({userId:req.user._id})
      res.render('userSettings');
});

/* add the value in the body to the list associated to the key */
router.post('/',
  isLoggedIn,
  async (req, res, next) => {
      const newPlayer = new PlayerDB(
        {first_name:req.body.first_name,
         last_name:req.body.last_name,
         userId: req.user._id
        })
      await todo.save();
      //res.render("todoVerification")
      res.redirect('/userPlayers')
});


module.exports = router;
