'use strict';

var querystring = require('querystring');
var util = require('util');

var async = require('async');
var request = require('request');
var open = require('yc-open');

//from grunt-contrib-imagemin
exports.symbols = {
    ok: '✓',
    err: '✖'
};

// for windows
if (process.platform == 'win32') {
    exports.symbols.ok = '\u221A';
    exports.symbols.err = '\u00D7';
}


function getIPDatas() {
    return require('./lib/ips');
}

function checkIp(ip, done) {
    request.head('http://' + ip, function(error, response, body) {
        if (error) {
            //check error
            console.log(ip, exports.symbols.err);
            done(null);
        } else {
            //ok
            console.log(ip, exports.symbols.ok);
            done(ip);
        }
    });
}

function getIp(done){
    async.mapLimit(getIPDatas(), 50, checkIp, function(err, results) {
        if (err) {
            done(err);
        }
    });
}

function search(arg) {

    var URL = "http://%s/search?q=%s";

    getIp(function(ip) {
        
        var url = 'http://' + ip;
        if (arg.length > 2) {
            var query = arg[2];
            query = querystring.escape(query);
            url = util.format(URL, ip, query);
        }

        //open it
        open(url);

        process.exit(0);

    });
    
}

exports.search = search;
