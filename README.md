# TrainBoard
Welcome to the TrainBoard repo.

## Getting started
You will need a TfNSW API key to be able to query train data from the API. You can obtain one for free at the [OpenData Transport NSW site](https://opendata.transport.nsw.gov.au/). You can then enter this key in the app settings once it's up and running.

Because the TfNSW API doesn't support CORS requests, we need to use a local proxy server, in this case the `cors-anywhere` npm package. Please see the instructions below on configuring.

## Production
For a production install, you only need to have the proxy server running.

Run `yarn install --production` to get the production packages only, mainly the `cors-anywhere` local HTTP server. 

It runs on `http://localhost:8010` by default, but you can override this by copying `.env` to `.env.local` and changing the settings.

Then, run the proxy server with `yarn run proxy`. 

## Development
Run `yarn install` to get all the required packages. You can then follow the usual Create React App instructions, which have been moved to [cra.md](./cra.md).