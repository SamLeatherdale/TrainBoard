const cors_proxy = require('cors-anywhere');
require('dotenv').config();

// Listen on a specific host via the HOST environment variable
const host = process.env.REACT_APP_PROXY_HOST || '0.0.0.0';
// Listen on a specific port via the PORT environment variable
const port = process.env.REACT_APP_PROXY_PORT || 8080;

cors_proxy.createServer({
    originWhitelist: [], // Allow all origins
    requireHeader: ['origin', 'x-requested-with'],
    removeHeaders: ['cookie', 'cookie2']
}).listen(port, host, function() {
    console.log('Running CORS Anywhere on ' + host + ':' + port);
});