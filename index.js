const express = require('express');
const path = require('path');
const logger  = require('morgan');
const bodyParser = require('body-parser');
const redis = require('redis');

const app = express();

const client = redis.createClient();

client.on('connect', function(){
    console.log('Redis server connected...')
});
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
    let title = 'Task list';
    client.lrange('tasks', 0, -1, function(err, reply){
        res.render('index', { 
            title: title,
            tasks: reply 
        });

    });
});

app.listen(3000);
console.log('Server started on port 3000');

module.exports = app;