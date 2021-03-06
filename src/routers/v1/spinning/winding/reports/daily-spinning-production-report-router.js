var Router = require('restify-router').Router;
var router = new Router();
var db = require("../../../../../db");
var DailySpinningProductionReportManager = require("dl-module").managers.production.spinning.DailySpinningProductionReportManager;
var resultFormatter = require("../../../../../result-formatter");

var YarnEquivalentConversionManager = require("dl-module").managers.master.YarnEquivalentConversion;
var DailySpinningProductionReport = require("dl-models").production.spinning.DailySpinningProductionReport;

var passport = require('../../../../../passports/jwt-passport');
const apiVersion = '1.0.0';

router.get("/", passport, function (request, response, next) {
    db.get().then(db => {

        var manager = new DailySpinningProductionReportManager(db, request.user);
        var firstDay = request.params.firstDay;
        var lastDay = request.params.lastDay;
        var unitId = request.params.unitId;

        var x;

        manager.getDailySpinningProductionReport(firstDay, lastDay, unitId)
            .then(data => {
                var result = resultFormatter.ok(apiVersion, 200, data);
                response.send(200, result);
            })
            .catch(e => {
                var error = resultFormatter.fail(apiVersion, 400, e);
                response.send(400, error);
            })

    });
});

module.exports = router;