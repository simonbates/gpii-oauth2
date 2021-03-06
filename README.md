GPII OAuth2
===========

**Note: Development of the OAuth 2 security for GPII has moved to GPII/universal.**

Get Infusion and dedupe:

- `npm install`
- `grunt dedupe-infusion`

Install dependencies:

- `cd gpii-oauth2-authorization-server`
- `npm install`
- `cd gpii-oauth2-single-process-auth-server`
- `npm install`
- `cd gpii-oauth2-utilities`
- `npm install`
- `cd sample-clients/gpii-oauth2-sample-client`
- `npm install`
- `cd sample-clients/gpii-oauth2-sample-client-passport`
- `npm install`

Start servers:

- `cd gpii-oauth2-single-process-auth-server`
- `node app.js`
- `cd sample-clients/gpii-oauth2-sample-client`
- `node app.js`
- `cd sample-clients/gpii-oauth2-sample-client-passport`
- `node app.js`

Pages:

- [http://localhost:3002/](http://localhost:3002/) - Sample client
- [http://localhost:3003/](http://localhost:3003/) - Sample client with Passport
- [http://localhost:3000/privacy](http://localhost:3000/privacy) - Privacy settings

Sample users and clients
------------------------

- [sample users and clients](gpii-oauth2-datastore/src/DataStoreWithSampleData.js)

Tests
-----

- `<Authorization Server>/tests/all-tests.html` (the server must be running)
- `gpii-oauth2-datastore/test/html/DataStoreTests.html`
- `gpii-oauth2-utilities/test/html/OAuth2UtilitiesTests.html`
