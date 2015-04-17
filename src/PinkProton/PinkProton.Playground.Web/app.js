var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var twitter = require('./routes/twitter');
var users = require('./routes/users');
var Twitter = require('twitter');

var app = express();

// see: http://socket.io/docs/#using-with-express-3/4
var server = require('http').Server(app);
var io = require('socket.io')(server);
server.listen(8181);

io.on('connection', function (socket) {
    socket.on('track', function (track) {
        var client = new Twitter({
            consumer_key: 'zfAsWdx1sGeE2P4wyCDlgZ1ac',
            consumer_secret: 'E9KsOJjC8B5d9Z3BQm1H16yPFB1npVDpflg6Oqgya8V58xELye',
            access_token_key: '71804239-fetjmCE3jD7sQr7XJpGghVVwc794QL7mvRfhUAHiv',
            access_token_secret: 'ZQWmK8YVWaxUM8xXRy4bHeVhs7Fi6jptguUU2q4Meyvxk'
        });
        
        client.stream('statuses/filter', { track: track }, function (stream) {
            stream.on('data', function (tweet) {
                console.log(tweet.text);
                socket.emit('tweet', tweet.text);
            });
            
            stream.on('error', function (error) {
                console.log(error);
            });
        });
    });
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/twitter', twitter);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
