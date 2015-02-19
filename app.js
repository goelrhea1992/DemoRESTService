var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('./config')

// Database
var mysql = require('mysql');
var db = mysql.createConnection(config.db);

var routes = require('./routes/index');
var users = require('./routes/users');
var actors = require('./routes/actors');
var languages = require('./routes/languages');
var categories = require('./routes/categories');
var films = require('./routes/films');

var app = express();

// view engine setup
//----app.set('views', path.join(__dirname, 'views'));
//---app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Make our db accessible to our router
app.use(function(req, res, next){
    req.db = db;
    next();
});

app.use('/', routes);
app.use('/users', users);
app.use('/actors', actors);
app.use('/languages', languages);
app.use('/categories', categories);
app.use('/films', films);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.json({ 'error': {
            message: err.message,
            error: err
        }});
    });
}

function row_to_obj(row) {
    var film = {
        film_id: row.film_id,
        title: row.title,
        description: row.description,
        release_year: row.release_year,
        language: {
            data: {
                id: row.language_id
            },
            link: {
                rel: 'languages',
                href: '/languages/'+row.language_id
            }
            },

        original_language_id: row.original_language_id,
        rental_duration: row.rental_duration,
        rental_rate: row.rental_rate,
        length: row.length,
        replacement_cost: row.replacement_cost,
        rating: row.rating,
        special_features: row.special_features,
        last_update: row.last_update

    }
    return film;
}

pagination = function (req,res,table,url_table,projectionFields){
    var offset =req.query.offset;
    var limit =req.query.limit;
    if(limit!=null)
        limit =parseInt(limit);
    if(limit ==null || limit >10)
        limit=10;
    if(offset!=null){
        query='SELECT '+ projectionFields+' FROM '+table+' limit ?,?';
        offset = parseInt(offset);
        var prev_num= offset-limit;
        var next_num=offset+limit;
        var prev_url=url_table+'?offset='+prev_num+'&limit='+limit;
        if(prev_num<0)
            prev_url='';
        params=[]
        var last_num =1000;
        query_getLastNum = 'SELECT count(*) as num FROM '+table;
        db.query(query_getLastNum,params, function(err, rows, fields) {
            if (err) throw_err(err, res);
            last_num=rows[0].num;
        //sql.query(
       //     'SELECT count(*) FROM ' + 'category'
     //   ).then(function(query_res) {
   // last_num = query_res[0].p_key;
 // });
    });
        var next_url=url_table+'?offset='+next_num+'&limit='+limit;
        if(next_num > last_num)
           next_url='';
       var self_url = url_table+'?offset='+offset+'&limit='+limit;
        params=  [offset,limit]
        db.query(query,params, function(err, rows, fields) {
           if (err) throw_err(err, res);
           
            res.json({
            'data': rows,
            'links': [
                {
                    'rel':  'self',
                    'href': self_url
                },
                {
                    'rel':  'prev',
                    'href': prev_url
                },
                {
                    'rel':  'next',
                    'href': next_url
                }
            ]
        });
     });
    }
};

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);

    res.json({ 'error': {
        message: err.message,
        error: {}
    }});
});


module.exports = app;
