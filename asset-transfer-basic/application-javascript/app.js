const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended : true}));

// const bodyParser = require('body-parser');
const cors = require('cors');
app.use(cors());
app.options('*',cors());
const morgan = require('morgan');
app.use(morgan('dev'));
//import middlewares
// const errorMiddleware = require("./middlewares/errorMiddleware");



//Import routes
const transactionRoute = require('./routes/transferts');


app.get('/',(req,res) => {
    return res.send({
        'success' : true,
        'message' : 'Welcome to BlockMomoChain Network'
    });
});


app.use('/api/transactions',transactionRoute);

// app.use(errorMiddleware.errorHandler);
// app.use(errorMiddleware.notFound);
module.exports = app; 