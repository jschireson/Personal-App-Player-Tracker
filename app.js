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

app.get("/demo",
        function (req, res){res.render("demo");});

app.get("/about", (request, response) => {
  response.render("about");
});

app.get("/userSettings", (request, response) => {
  response.render("userSettings");
});

app.get("/gpaform", (request,response) => {
  response.render("gpaform")
})

app.post("/gpa",(req,res) => {
  const a = parseFloat(req.body.a)
  const b = parseFloat(req.body.b)
  const c = parseFloat(req.body.c)
  const d = parseFloat(req.body.d)
  const e = parseFloat(req.body.e)
  const totalGrades = (a*4+b*3+c*2+d)
  res.locals.name = req.body.fullname
  res.locals.body = req.body
  res.locals.a = a
  res.locals.b = b
  res.locals.c = c
  res.locals.d = d
  res.locals.e = e
  res.locals.totalGrades = totalGrades
  res.render('gpaview')
})

app.get("/dataDemo", (request,response) => {
  response.locals.name="Tim Hickey"
  response.locals.vals =[1,2,3,4,5]
  response.locals.people =[
    {'name':'Tim','age':65},
    {'name':'Yas','age':29}]
  response.render("dataDemo")
})

app.post("/showformdata", (request,response) => {
  response.json(request.body)
})

app.post("/xxx", (request,response) => {
  response.json(request.body)
})

app.get("/rest", (request,response) => {
  response.render("rest")
})

app.post("/restData", (request,response) => {
  response.json(request.body)
})

app.get("/triangleArea", (req, res) => {
  response.render("triangleArea")
})

app.post("/calcTriangleArea", (req,res) => {
  const a = parseFloat(req.body.a)
  const b = parseFloat(req.body.b)
  const c = parseFloat(req.body.c)
  const s = (a+b+c)/2
  const area = math.sqrt(s*(s-a)*(s-b)*(s-c))
  res.locals.a = a
  res.locals.b = b
  res.locals.c = c
  res.locals.area = area
  res.render("showTriangleArea")
})

app.get('/playerSearch', (req,res) => { 
  res.render('playerSearch') //formerly player is recipe
})
//formerly getRecipes
app.post("/getPlayer",   async (req,res,next) => { 
  try { 
    const food = req.body.food 
    const balldontlie = "https://www.balldontlie.io/api/v1/players?search="+food+"&per_page=100" 
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


// Here is where we will explore using forms!



// this example shows how to get the current US covid data
// and send it back to the browser in raw JSON form, see
// https://covidtracking.com/data/api
// for all of the kinds of data you can get
app.get("/c19",
  async (req,res,next) => {
    try {
      const url = "https://covidtracking.com/api/v1/us/current.json"
      const result = await axios.get(url)
      res.json(result.data)
    } catch(error){
      next(error)
    }
})

// this shows how to use an API to get recipes
// http://www.recipepuppy.com/about/api/
// the example here finds omelet recipes with onions and garlic
app.get("/omelet",
  async (req,res,next) => {
    try {
      const url = "http://www.recipepuppy.com/api/?i=onions,garlic&q=omelet&p=3"
      const result = await axios.get(url)
      res.json(result.data)
    } catch(error){
      next(error)
    }
})

// this shows how to use an API to get recipes
// http://www.recipepuppy.com/about/api/
// the example here finds omelet recipes with onions and garlic
// app.get("/stats",
// console.log("stats pressed")
//   async (req,res,next) => {
//     try {
//       const url = "https://www.balldontlie.io/api/v1/stats"
//       const result = await axios.get(url)
//       console.log(result);
//       res.json(result.data)
//     } catch(error){
//       next(error)
//     }
// })

// fetch(url, {
//     method: 'post',
//     headers: {
//       "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
//     },
//     body: 'foo=bar&lorem=ipsum'
//   })
//   .then(json)
//   .then(function (data) {
//     console.log('Request succeeded with JSON response', data);
//   })
//   .catch(function (error) {
//     console.log('Request failed', error);
//   });

app.get('/player', (req,res) => { 
  res.render('player') //formerly player is recipe
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
