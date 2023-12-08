const http = require('http');
const app = require('./app');
require('dotenv').config();
 

const server = http.createServer(app);
const port = process.env.PORT || 3000;
server.listen(port,()=>{
   console.log('API started on port ' + process.env.PORT);
});
 

module.exports = server;