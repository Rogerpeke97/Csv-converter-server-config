//There is an upload folder inside the public folder which was udes for testing purposes and you 
//can use it too to store files locally on your computer if that is what you want to, you need to add
// a destination file in the google cloud download function
// in the official example they add that

const express = require('express');

const app = express();

const fs = require('fs');

const Multer = require('multer');

const path = require('path')

const dotenv = require('dotenv').config({
     path: './.env'
});

const ejs = require('ejs');

const passport = require('passport')

const bcrypt = require('bcrypt')

const {
     Pool,
     Client
} = require('pg');

const bodyParser = require("body-parser");

const PORT = process.env.PORT;

const session = require('express-session')

const FileStore = require('session-file-store')(session);

const {
     Storage
} = require('@google-cloud/storage');

const {
     format
} = require('util');


// Instantiate a storage client

LocalStrategy = require('passport-local').Strategy
//Postgresql
const client = new Client({
     user: process.env.DATABASE_USER, // ALL this process.env.variable are stored in a separate file
     host: process.env.DATABASE_HOST, //which you need to add to your .gitignore file
     database: process.env.DATABASE, //contains sensible info to connect to your database
     password: process.env.DATABASE_PASSWORD,
     port: process.env.DATABASE_PORT,
});

const dbConfig = {
     user: client.user,
     password: client.password,
     database: client.database,
     host: client.host,
     port: client.port,
}

const pool = new Pool(dbConfig) //Pooling so that different users can connect to the database
pool.on('error', function (err) {
     error('idle client error', err.message, err.stack)
})

const cookieParser = require('cookie-parser');

const gc = new Storage({
     keyFilename: path.join(__dirname, '/directory-example'), // You need to download the json file
     //from google and save it to your project when you deploy it or if you want to use it locally
     projectId: 'example-id' //project id of google cloud storage
})
gc.getBuckets().then(x => console.log(x)); // Check if it connects properly to your google cloud bucket

const FilesBucket = gc.bucket('example-name-bucket') //It shows on the id part of the function above
//or in the google cloud storage list
const multer = Multer({
     storage: Multer.memoryStorage(),
     limits: {
          fileSize: 10 * 1024 * 1024, // Limiting file up to 5mb
     },
});
// in this variable the download file information is stored after being turned into a 
//string. When you receive the downloaded file its served as a buffer
let doate = [{
     name: []
}]

function deleteDoate() {
     // To delete the array content after you download and send the json to the client side
     doate[0].name.length = 0
}

app.post('/uploadedfile', multer.single('myFile'), async (req, res, next) => {
     if (!req.file) {
          res.status(400).send('No file uploaded.');
          return;
     } else {
          // Create a new blob in the bucket and upload the file data.
          const blob = FilesBucket.file(req.file.originalname);
          const blobStream = blob.createWriteStream();
          blobStream.on('error', (err) => {
               next(err);
          });
          blobStream.on('finish', () => {
               // The public URL can be used to directly access the file via HTTP.
               const publicUrl = format(
                    `https://storage.googleapis.com/${FilesBucket.name}/${blob.name}`
               );
               res.status(200).send(publicUrl);
          });
          blobStream.end(req.file.buffer);
          // I set a timeout because the file does not upload right away
          //therefore you need to wait for the file to be uploaded and then download it  
          setTimeout(function main(require, respond) {
               let bucketName = 'your-bucket-name'
               let srcFilename = req.file.originalname
               async function downloadFile() {
                    // Downloads the file
                    let x = await FilesBucket.file(srcFilename).download();
                    console.log(x)
                    console.log(
                         `gs://${bucketName}/${srcFilename} downloaded`
                    );
                    deleteDoate();
                    const respondFile = x.toString('utf-8') //turning the buffer into string 
                    //adn then psuhing it into doate array
                    doate[0].name.push(respondFile);
                    //getting the fetch request from the client side app.js or logged.js
                    app.get('/uploaded', (req, response) => {
                         response.header("Content-Type", 'application/json');
                         response.send(doate); // sending the json to the client
                    })
               }
               downloadFile().catch(console.error);
          }, 2000);
     }
});
// setting the engine so that express can render the ejs files
app.set('view engine', 'ejs');

app.use(express.static("public"));

app.use(cookieParser('Your-cookie-parser secret key goes heree or you can use process.env.SESSION'));

app.use(bodyParser.urlencoded({
     extended: false
}))
app.use(bodyParser.json())

app.use(session({
     store: new FileStore(),
     secret: process.env.SESSION,
     resave: false,
     saveUninitialized: false,
     cookie: {
          httpOnly: true,
          expires: 60000 // the ammount of time your key is valid
     }
}))


app.use(passport.initialize())


app.use(passport.session())

client.connect();
//logging out and destroying the session
app.post('/log_out', (req, res) => {
     req.session.destroy((err) => {
          if (err) {
               console.log(err)
          } else {
               console.log(session);
               res.redirect('/')
          }
     })
})
// index2 contains an error message in which you either input and invalid user or password
app.get('/login', (req, res) => {
     let message = {
          Incorrect: "Username or password incorrect!"
     }
     res.render('index', {message})
})
app.listen(PORT, () => console.log("Server started on port " + PORT));
//upload file multer
// REGISTRATION
app.post('/signup', async (req, res) => {
     const hashedPassword = await bcrypt.hash(req.body.password, 10)
     client.connect();
     const text = 'insert into users (first_name, password) VALUES($1, $2)'
     const values = [req.body.user, hashedPassword];
     client.query(text, values, (err, response) => {
          if (err) {
               console.log(err);
          } else {
               res.redirect('/');
          }
     })
})
//all the console.logs give you some insight about what is going on
//and i think it's valuable to leave them there 
//as it was painful to pin-point certain debugging issues.
app.post('/', (req, res, next) => {
     passport.authenticate('local', (err, user, info) => {
          console.log(`req.session.passport: ${JSON.stringify(req.session.passport)}`)
          console.log(`req.user: ${JSON.stringify(req.user)}`)
          req.login(user, (err) => {
               console.log(`req.session.passport: ${JSON.stringify(req.session.passport)}`);
               if (req.user === null) {
                    console.log(`req.user: ${JSON.stringify(req.user)}`)
                    res.redirect('/login')
               } else {
                    res.redirect('/');
               }
          })
     })(req, res, next);
})
// if the user it's not authenticated you go to the main page again, otherwise you
//get the logged in website
app.get('/', (req, res) => {
     if (req.isAuthenticated()) {
          let user = {
               name: req.user.rows[0].first_name
          }
          res.render('index3.ejs', {
               user, message
          })
     } else {
          let message = {
               Incorrect: ""
          }
          res.render('index.ejs', {message})
     }
})
//postgresql and session creation
passport.use(new LocalStrategy((username, password, cb) => {
     client.query('SELECT * FROM users where first_name = $1', [username], (err, result) => {
          console.log(result);
          if (err) {
               console.log(err);
               return cb(err);
          }
          if (result.rowCount === 1) {
               const first = result.rows[0];
               bcrypt.compare(password, first.password, (err, res) => {
                    console.log(first.password)
                    if (res) {
                         console.log("Correct")
                         cb(null, {
                              id: first.id,
                              username: first.first_name
                         })
                    } else {
                         console.log("Incorrect password")
                         console.log(first.id)
                         return cb(null, false)
                    }
               })
          }
          //basically if there is 0 user was not found
          if (result.rowCount === 0) {
               console.log("No user with that name")
               return cb(null, false)
          }
     })
}))
passport.serializeUser((user, done) => {
     done(null, user.id);
})

passport.deserializeUser((id, done) => {
     // and important point here, all the tutorials do not usually add this explanation and perhaps
     // it's not hard to figure but in the doc examples of passport, the setup is different
     // that exaple does not connect to a database, therefore in this part you should 
     // query using the appropiate config of your database, i am using postgresql
     client.query('SELECT * FROM users where id = $1', [id], (err, user) => {
          if (err) {
               done(err, null);
          } else if (!user) {
               // no user found
               done(null, false);
          } else {
               done(null, user);
          }
     })
})