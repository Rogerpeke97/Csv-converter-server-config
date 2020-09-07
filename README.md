## Csv-converter-config:
### `Configuration for the webapp, server side`:
I added the server side configuration which involves the usage of the @google-cloud-storage dependency. With this i am able to upload files to the bucket and download them.<br />
These files are later fetched by the client side app.js and displayed in the canvas.
### Here is the list of dependencies i used, in case you want to install them yourself:
Runs the app.
### `bcrypt`:
In order to hash the password when you log in or sign up and store it in the database.
### `dotenv`:
To store the secret cookie key and also the database user, host, password, etc.
### `ejs`:
 I needed it to add the user name after you log in, rendering the index.ejs along the user name on the navbar. ("if you are using a phone, the name will not be displayed, only the log out icon"). 
### `express`:
To handle the backend requests and serving the files, etc.
### `express-session`:
To create a session along with cookie-parser, which according to the npm last update is not needed, thats why i'm not adding it here. 
### `session-file-store`:
To store the cookie containing the user session, once you log out its destroyed and when you log in again, a new one is created. 
### `multer`:
To store temporarily the csv files until they are fetched by the app.js and logged.js.
### `nodemon`:
For testing purposes.
### `pg`:
Used to connect to the database and pooling so that multiple users can connect to it.
### `passport`:
Along with passport-local in order to connect to the database and authenticate the user.