var Router = require('restify-router').Router;
var router = new Router();
var db = require("../../../../db");
var WindingQualitySamplingManager = require("dl-module").managers.production.spinning.winding.WindingQualitySampling;
var resultFormatter = require("../../../../result-formatter");

var passport = require('../../../../passports/jwt-passport');
const apiVersion = '1.0.0';

router.get("/", passport, function (request, response, next) {
    db.get().then(db => {
        var manager = new WindingQualitySamplingManager(db, request.user);

        var sorting = {
            "_updatedDate": -1
        };
        var query = request.queryInfo;
        query.order = sorting;
        manager.read(query)
            .then(docs => {
                var result = resultFormatter.ok(apiVersion, 200, docs.data);
                delete docs.data;
                result.info = docs;
                response.send(200, result);
            })
            .catch(e => {
                response.send(500, "gagal ambil data");
            })
    })
        .catch(e => {
            var error = resultFormatter.fail(apiVersion, 400, e);
            response.send(400, error);
        })
});

router.get("/:id", passport, (request, response, next) => {
    db.get().then(db => {
        var manager = new WindingQualitySamplingManager(db, request.user);

        var id = request.params.id;

        manager.getSingleById(id)
            .then(doc => {
                var date = new Date(doc.date);
                var dd = ('0' + date.getDate()).slice(-2);
                var mm = ('0' + (date.getMonth() + 1)).slice(-2);
                doc.date = `${date.getFullYear()}-${mm}-${dd}`
                var result = resultFormatter.ok(apiVersion, 200, doc);
                response.send(200, result);
            })
            .catch(e => {
                var error = resultFormatter.fail(apiVersion, 400, e);
                response.send(400, error);
            })
    })
});

router.post('/', passport, (request, response, next) => {
    db.get().then(db => {
        var manager = new WindingQualitySamplingManager(db, request.user);

        var data = request.body;

        manager.create(data)
            .then(docId => {
                response.header('Location', `${request.url}/${docId.toString()}`);
                var result = resultFormatter.ok(apiVersion, 201);
                response.send(201, result);
            })
            .catch(e => {
                var error = resultFormatter.fail(apiVersion, 400, e);
                response.send(400, error);
            })

    })
});

router.put('/:id', passport, (request, response, next) => {
    db.get().then(db => {
        var manager = new WindingQualitySamplingManager(db, request.user);

        var id = request.params.id;
        var data = request.body;

        manager.update(data)
            .then(docId => {
                var result = resultFormatter.ok(apiVersion, 204);
                response.send(204, result);
            })
            .catch(e => {
                var error = resultFormatter.fail(apiVersion, 400, e);
                response.send(400, error);
            })

    })
});

router.del('/:id', passport, (request, response, next) => {
    db.get().then(db => {
        var manager = new WindingQualitySamplingManager(db, request.user);

        var id = request.params.id;
        var data = request.body;

        manager.delete(data)
            .then(docId => {
                var result = resultFormatter.ok(apiVersion, 204);
                response.send(204, result);
            })
            .catch(e => {
                var error = resultFormatter.fail(apiVersion, 400, e);
                response.send(400, error);
            })
    })
});

module.exports = router;