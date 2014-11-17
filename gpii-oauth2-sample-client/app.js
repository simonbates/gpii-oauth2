var express = require('express');
var exphbs  = require('express-handlebars');
var http = require('http');
var morgan = require('morgan');
var querystring = require('querystring');
var url = require('url');
var util = require('util');
var config = require('../config');

var clientId = 'client_id_1';
var clientSecret = 'client_secret_1';

var requestedScope = 'scope_1';
var state = 'RANDOM-STRING';

var authorizeCallbackUri = util.format('http://localhost:%d/authorize_callback', config.clientPort);

function buildAuthorizeUrl (redirectUri) {
    // TODO generate the state parameter
    return url.format({
        protocol: 'http',
        hostname: 'localhost',
        port: config.authorizationServerPort,
        pathname: '/authorize',
        query: {
            client_id: clientId,
            response_type: 'code',
            redirect_uri: redirectUri,
            scope: requestedScope,
            state: state
        }
    });
}

function getAccessToken (code, callback) {
    var options = {
        hostname: 'localhost',
        port: config.authorizationServerPort,
        path: '/access_token',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };

    var postData = querystring.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        code: code
    });

    var req = http.request(options, function (res) {
        res.setEncoding('utf8');
        var body = "";
        res.on('data', function (chunk) {
            body += chunk;
        });
        res.on('end', function () {
            console.log('Got ' + options.path + ' response: ' + body);
            callback(JSON.parse(body));
        });
    });

    console.log('Sending ' + options.path);
    req.write(postData);
    req.end();
}

function getPreferences (accessToken, callback) {
    var options = {
        hostname: 'localhost',
        port: config.resourceServerPort,
        path: '/preferences',
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }
    };

    var req = http.request(options, function (res) {
        res.setEncoding('utf8');
        var body = "";
        res.on('data', function (chunk) {
            body += chunk;
        });
        res.on('end', function () {
            console.log('Got ' + options.path + ' response: ' + body);
            callback(body);
        });
    });

    console.log('Sending ' + options.path + ' with access token: ' + accessToken);
    req.end();
}

var app = express();
app.use(morgan(':method :url', { immediate: true }));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
    var redirectUrl = buildAuthorizeUrl(authorizeCallbackUri);
    console.log('Redirecting to ' + redirectUrl);
    res.redirect(redirectUrl);
});

app.get('/authorize_callback', function (req, res) {
    // TODO verify the state parameter
    getAccessToken(req.param('code'), function (accessTokenData) {
        getPreferences(accessTokenData.access_token, function (responseData) {
            res.render('preferences', {
                accessToken: accessTokenData.access_token,
                grantedScope: accessTokenData.scope,
                tokenType: accessTokenData.token_type,
                responseData: responseData
            });
        });
    });
});

app.listen(config.clientPort);
