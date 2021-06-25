const mongoose = require("mongoose");
mongoose.connect(
  "mongodb://localhost:27017/recipe_db",
  {useNewUrlParser: true}
);
const db = mongoose.connection;

db.once("open", () => {
  console.log("Successfully connected to MongoDB using Mongoose!");
});


/*
  app.js -- This creates an Express webserver
*/

// First we load in all of the packages we need for the server...
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
//const bodyParser = require("body-parser");
const axios = require("axios");
var debug = require("debug")("personalapp:server");

// Now we create the server
const app = express();

// Here we specify that we will be using EJS as our view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Here we process the requests so they are easy to handle
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Here we specify that static files will be in the public folder
app.use(express.static(path.join(__dirname, "public")));

// Here we enable session handling ..
app.use(
  session({
    secret: "zzbbya789fds89snana789sdfa",
    resave: false,
    saveUninitialized: false
  })
);

//app.use(bodyParser.urlencoded({ extended: false }));

// This is an example of middleware
// where we look at a request and process it!
app.use(function(req, res, next) {
  //console.log("about to look for routes!!! "+new Date())
  console.log(`${req.method} ${req.url}`);
  //console.dir(req.headers)
  next();
});

// here we start handling routes
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/userSettings", async(request, response, next) => {
  try{
    response.locals.userSettings = await PlayerDB.find({})
    console.log("finding")
    console.log(response.locals.userSettings.length)
    response.render("userSettings")
  }
  catch(error){
    console.log(error)
    next(error)
  }
});

app.post("/showformdata", (request,response) => {
  response.render("index")
})

app.get('/playerSearch', (req,res) => { 
  res.render('playerSearch') //formerly player is recipe
})

//formerly getRecipes
app.post("/getPlayer",   async (req,res,next) => { 
  try { 
    const searchedPlayer = req.body.searchedPlayer 
    const balldontlie = "https://www.balldontlie.io/api/v1/players?search="+searchedPlayer+"&per_page=100" 
    const myAPI = await axios.get(balldontlie) 
    console.dir(myAPI) 
    console.dir(myAPI.data) 
    console.log('results') 
    console.log('results') 
    console.dir(myAPI.data.data) 
    res.locals.myAPI = myAPI.data.data
    //res.json(result.data) 
    res.render('displayPlayer') //formerly showRecipes
  } catch(error){ 
    next(error)     }
 }) 

const PlayerDB = require("./models/PlayerDB")
app.post("/getPlayer2",   async (req,res,next) => { 
  try { 
    const first_name = req.body.first_name
    const last_name = req.body.last_name
    console.log("XFDS")
    const myPlayer = new PlayerDB({
      first_name:first_name,
      last_name:last_name
    })
    const done = await myPlayer.save()
    console.log('result=')
    console.dir(done)
    res.redirect('/userSettings')

  } catch(error){ 
    console.log("error in getPlayer2")
    next(error)     }
 }) 



var date = new Date();
var year = date.getFullYear();
var month = 1 + date.getMonth();
var day = date.getDate();
var dayMod = day-1
var api_date = year + "-" + month + "-" + day
var api_date_mod = year + "-" + month + "-" + dayMod
//formerly getRecipes
//<%= let trueShooting = player.pts/(2*(player.fga + 0.44 * player.fta)) %>


//https://www.balldontlie.io/api/v1/players?search=tyrese%20haliburton
app.post("/getPlayer",   async (req,res,next) => { 
  try { 
    //player name First Last
    const player = req.body.player
    let nameArray = player.split(" ")
    let first_name = nameArray[0]
    let last_name = nameArray[1]
    const playerURL = "https://www.balldontlie.io/api/v1/players?search="+first_name+"%20"+last_name
    const playerID = await axios.get(playerURL) 
    let best = playerID.data.data
    let best2 = best.map(player => player.id);
    let player_id_number = best2[0]; //player ID number finally

//https://www.balldontlie.io/api/v1/stats?player_ids[]=274&start_date=2021-6-8&per_page=100
    const balldontlie = "https://www.balldontlie.io/api/v1/stats?player_ids[]="+player_id_number+"&start_date="+api_date_mod+"&per_page=100" 
    const myAPI = await axios.get(balldontlie) 
    console.dir(myAPI) 
    console.dir(myAPI.data) 
    console.log('results') 

    console.log(api_date);
    console.log(api_date_mod);
    console.log('XXXXXXXXXXXXXXXXXXXXXXX') 
    console.dir(myAPI.data.data) 
    res.locals.myAPI = myAPI.data.data


    //let player_id_number = best.map(a => a.id);
    //console.log(player_id_number);
    //res.json(result.data) 
    res.render('showPlayer') //formerly showRecipes
  } catch(error){ 
    next(error)     }
 }) 


//dummy function to display all checked players
const checkedPlayers = {
            'durant':false,
            'curry':false,
            'jokic':true,
            'james':false,
            'lillard':true
};

for(var key in checkedPlayers){
    if(checkedPlayers[key] == true)
    console.log(key);
  }


// Don't change anything below here ...

// here we catch 404 errors and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// this processes any errors generated by the previous routes
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

//Here we set the port to use
const port = "4000";
app.set("port", port);

// and now we startup the server listening on that port
const http = require("http");
const server = http.createServer(app);

server.listen(port);

function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
}

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

server.on("error", onError);

server.on("listening", onListening);

module.exports = app;
