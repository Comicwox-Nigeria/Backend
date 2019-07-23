const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const fs = require("fs");
const cors = require('cors');
// const passportStaff = require('passport');

const config = require('config');

const path = require('path');

//ADMIN ROUTES

const adminAuth = require('./routes/api/adminRoutes/authentication');
const adminDashboard = require('./routes/api/adminRoutes/dashboard');
const adminManageComic = require('./routes/api/adminRoutes/manageComic');
const adminManagerReaders = require('./routes/api/adminRoutes/manageReaders');
const adminManagerStudios = require('./routes/api/adminRoutes/manageStudio');
const adminManagerStaff = require('./routes/api/adminRoutes/manageStaff');

// STAFF ROUTES
const staffAuth = require('./routes/api/staffRoutes/authentication');
const staffDashboard = require('./routes/api/staffRoutes/dashboard');
const staffManageComic = require('./routes/api/staffRoutes/manageComic');
const staffManagerReaders = require('./routes/api/staffRoutes/manageReaders');
const staffManagerStudios = require('./routes/api/staffRoutes/manageStudio');

// STUDIO ROUTES
const studioAuth = require('./routes/api/studioRoutes/authentication');
const studioDashboard = require('./routes/api/studioRoutes/dashboard');

// READER ROUTES
const readerAuth = require('./routes/api/readersRoutes/authentication');
const readerDashboard = require('./routes/api/readersRoutes/dashboard');

//COMIC ROUTES
const comic = require('./routes/api/comicRoutes/Comic');
const studio = require('./routes/api/comicRoutes/Studio');

const app = express();

//Using body parser
// app.use(express.json());
app.use(bodyParser.urlencoded({extended : true}));

app.use(bodyParser.json());

// DB Config
const db = config.get('mongoURI');

// Connect to Mongo DB thru Mongoose

mongoose
    .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true
    })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));



app.get("/api", (req, res) => {
    fs.readFile("docs/apiDocs.json", (err, data) => {
        if (err) {
            res.status(400).json({
                error: err
            });
        }
        const docs = JSON.parse(data);
        res.json(docs);
    });
});

//Passport Middleware
app.use(passport.initialize());
// app.use(passportStaff.initialize());

//Passport Config
require('./config/passport')(passport);
// require('./config/passportAdmin')(passportStaff);
// require('./config/passportReaders')(passport);

// require('./config/passportStudio')(passport);

app.use(cors());

//Use routes
// For ADMIN
app.use('/api/adminRoutes/authentication', adminAuth);
app.use('/api/adminRoutes/adminDashboard', adminDashboard);
app.use('/api/adminRoutes/adminManageComic', adminManageComic);
app.use('/api/adminRoutes/adminManagerReaders', adminManagerReaders);
app.use('/api/adminRoutes/adminManagerStudios', adminManagerStudios);
app.use('/api/adminRoutes/adminManagerStaff', adminManagerStaff);

//FOR STAFF
app.use('/api/staffRoutes/authentication', staffAuth);
app.use('/api/staffRoutes/staffDashboard', staffDashboard);
app.use('/api/staffRoutes/staffManageComic', staffManageComic);
app.use('/api/staffRoutes/staffManagerReaders', staffManagerReaders);
app.use('/api/staffRoutes/staffManagerStudios', staffManagerStudios);

//FOR STUDIO
app.use('/api/studioRoutes/authentication', studioAuth);
app.use('/api/studioRoutes/studioDashboard', studioDashboard);


//FOR READERS
app.use('/api/readersRoutes/readerAuth', readerAuth);
app.use('/api/readersRoutes/readerDashboard', readerDashboard);

// FOR COMIC
app.use('/api/comicRoutes/comic', comic);
app.use('/api/comicRoutes/studio', studio);


// SERVE STATIC ASSETS IF IN PRODUCTION
/*if (process.env.NODE_ENV === 'production') {

    app.use(express.static('readerfrontend/build'));

    app.get('*', (req,res) => {
        res.sendFile(path.resolve(__dirname, 'readerfrontend', 'build', 'index.html'));
    });

}*/

const port = process.env.PORT || 8080;
// const port = 5211;

app.listen(port, () => console.log(`Server running on port ${port}`));
