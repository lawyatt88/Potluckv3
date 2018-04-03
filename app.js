const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression')
// const Web3 = require('web3');
const net = require('net');
const isPortAvailable = require('is-port-available');
const config = require('config');
const compiledContract = require('./contracts/contractv1');
const morgan = require('morgan')
const path = require('path')
const session = require('express-session')
const passport = require('passport')
const SequelizeStore = require('connect-session-sequelize')(session.Store)
const db = require('./server/db')
const sessionStore = new SequelizeStore({ db })
const app = express();
module.exports = app


// passport registration
passport.serializeUser((user, done) => done(null, user.id))
passport.deserializeUser((id, done) =>
  db.models.user.findById(id)
    .then(user => done(null, user))
    .catch(done))

const createApp = () => {

  // logging middleware
  app.use(morgan('dev'))

  // body parsing middleware
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }));

  // compression middleware
  app.use(compression())

  // session middleware with passport
  app.use(session({
    secret: process.env.SESSION_SECRET || 'my best friend is Cody',
    store: sessionStore,
    resave: false,
    saveUninitialized: false
  }))

  app.use(passport.initialize())
  app.use(passport.session())

  app.use((req, res, next) => {
    if (!req.session.inbox) req.session.inbox = {}
    if (!req.session.basket) req.session.basket = []
    if (!req.session.inEscrow) req.session.inEscrow = []
    next()
  })
  
  //config
  // const ipcAddr = config.get('ipcAddr');
  // const ipcAddr = "/Users/natalieung/blockchaintest/privEth/geth.ipc"
  // const configPort = config.get('port');
  // const configPort = 4001


  // auth and api routes
  app.use('/api', require('./server/api'))
  app.use('/auth', require('./server/auth'))
  app.use('/web3', require('./server/web3'))


  // static file serving middleware
  app.use(express.static(path.join(__dirname, 'public')))

  // sends index.html
  app.use('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'))
  })

  // error handling endware
  app.use((err, req, res, next) => {
    console.error(err)
    console.error(err.stack)
    res.status(err.status || 500).send(err.message || 'Internal server error.')
  })
}

// const ipcAddr = "/Users/natalieung/blockchaintest/privEth/geth.ipc"
// const configPort = config.get('port');
// const configPort = 4001

const findPort = async (startingPort) => {
  let openPort; 
  let status = await isPortAvailable(startingPort)
  if (status) {
    console.log('Port ' + startingPort + ' IS available!');
    openPort = startingPort;
  }
  else {
    console.log('Port ' + startingPort + ' IS NOT available!');
    console.log('Reason : ' + isPortAvailable.lastError);
    let nextPort = +startingPort + 1
    openPort = findPort(nextPort)
  };
  return openPort
}

let port = (process.env.PORT || 4001);

const startListening = (availablePort) => {
  // start listening (and create a 'server' object representing our server)
  app.set('port', availablePort)
  app.set('findPort', findPort)
  const server = app.listen(availablePort, () => console.log(`Mixing it up on port ${availablePort}`))
}

const syncDb = () => db.sync()

// This evaluates as true when this file is run directly from the command line,
// i.e. when we say 'node server/index.js' (or 'nodemon server/index.js', or 'nodemon server', etc)
// It will evaluate false when this module is required by another module - for example,
// if we wanted to require our app in a test spec
if (require.main === module) {
  sessionStore.sync()
    .then(syncDb)
    .then(createApp)
    .then(() => findPort(port))
    .then(openPort => startListening(openPort))
} else {
  createApp()
}
