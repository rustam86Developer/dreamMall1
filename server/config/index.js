const environment = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/' + environment + '.config.js');
module.exports = config;