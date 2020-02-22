# TrainBoard
Welcome to the TrainBoard repo.

## Getting started
You will need a TfNSW API key to be able to query train data from the API. You can obtain one for free at the [OpenData Transport NSW site](https://opendata.transport.nsw.gov.au/). You can then enter this key in the app settings once it's up and running.

It will need access to the following APIs:
* `Trip Planner APIs` - required
    * To show the list of departing trips
* `Public Transport - Realtime Vehicle Positions` - optional
    * To show vehicle positions with Google Maps

Because the TfNSW API doesn't support CORS requests, we need to use a proxy server.

You can either use a local proxy server, or a CloudFlare worker.

## Local proxy server
The local proxy server uses the `cors-anywhere` npm package.

Run `yarn install --production` to get the production packages only, mainly the `cors-anywhere` local HTTP server. 

It runs on `http://localhost:8010` by default, but you can override this by copying `.env` to `.env.local` and changing the settings.

Then, run the proxy server with `yarn run proxy`. 

## CloudFlare worker
Signup for CloudFlare workers at https://workers.cloudflare.com/.

Create a new JavaScript worker, and copy and paste the contents of `scripts/proxy-cloudflare-worker.js` in.

Then deploy your worker, and change the proxy URL to `https://your-worker.your-domain.workers.dev/?`. The query string `?` at the end is required to pass the URL through correctly.

## Development
Run `yarn install` to get all the required packages. You can then follow the usual Create React App instructions, which have been moved to [cra.md](./cra.md).