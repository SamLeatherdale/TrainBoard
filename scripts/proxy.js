const fs = require('fs');
const cors_proxy = require('cors-anywhere');
const dotenv = require('dotenv');
dotenv.config();

// Overwrite with local if exists
const localPath = __dirname + '/../.env.local';
if (fs.existsSync(localPath)) {
    const localEnv = dotenv.parse(fs.readFileSync(localPath));
    for (const k of Object.keys(localEnv)) {
        process.env[k] = localEnv[k]
    }
}

// Listen on a specific host via the HOST environment variable
const host = process.env.PROXY_HOST || '0.0.0.0';
// Listen on a specific port via the PORT environment variable
const port = process.env.PROXY_PORT || 8010;

cors_proxy.createServer({
    originWhitelist: [], // Allow all origins
    requireHeader: [],
    removeHeaders: ['cookie', 'cookie2', 'origin']
}).listen(port, host, function() {
    console.log('Running CORS Anywhere on ' + host + ':' + port);
});