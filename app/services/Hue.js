var request = require('request'),
    async = require('async');

module.exports = function () {
    var self = this,
        requestBuilds = function (callback) {
            request({
                'url': 'http://localhost:8080/myapp/myresources',
                'json' : true
                },
                function(error, response, body) {
                    callback(body);
            });
        },
        queryBuilds = function (callback) {
            requestBuilds(function (body) {
                async.map(body, requestBuild, function (error, results) {
                    callback(results);
                });
            });
        },
        requestBuild = function (build, callback) {
            request({
                'url': 'http://localhost:8080/myapp/myresource',
                'json' : true
                },
                function(error, response, body) {
                    callback(error, simplifyBuild(body));
            });
        },
        parseDate = function (dateAsString) {
            return new Date(dateAsString);
        },
        getStatus = function (state) {
            if (state === 'RUNNING') return 'Green';
            return 'Red';
        },
        simplifyBuild = function (res) {
            return {
                id: res.id,
                project: res.project ,
                number: res.number,
                isRunning: res.isRunning,
                startedAt: parseDate(res.startTime),
                finishedAt: parseDate(res.stopTime),
                requestedFor: res.user,
                status: getStatus(res.status),
                statusText: res.status,
                reason: res.reason,
                hasErrors: false,
                hasWarnings: false,
                url: res.url
            };
        };

    self.configure = function (config) {
        self.configuration = config;
    };

    self.check = function (callback) {
        queryBuilds(callback);
    };
};
