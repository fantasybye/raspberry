exports.start = async () => {
    'use strict';

    const express = require('express');
    const bodyParser = require('body-parser');

    const app = express();

    // initialize
    app.use(bodyParser.json());
    // app.use(bodyParser.urlencoded({ extended: true }));

    app.listen(3000, function () {
        console.log('server started');
    });

    function fail(err, res) {
        console.error(err);
        if (err instanceof Error) {
            err = err.message;
        }
        res.send(JSON.stringify(err));
    }

    function getApiKey(req) {
        return req.get('U-ApiKey');
    }

    function loadController(controller) {
        let interceptor = controller.interceptor;
        let actions = controller.actions;

        if (interceptor === undefined) {
            interceptor = Promise.resolve();
        } else if (!(interceptor instanceof Promise)) {
            let temp = interceptor;
            interceptor = async (req, apiKey, info) => {
                await temp(req, apiKey, info);
            }
        }

        for (let action of actions) {
            console.log(action.method, action.path);
            app[action.method.toLowerCase()](
                action.path,
                (req, res) => {
                    let apiKey = getApiKey(req);
                    let info = req.body;

                    interceptor(req, apiKey, info)
                        .then(() => action.action(req, apiKey, info))
                        .then(result => res.send(JSON.stringify(result !== undefined ? result : '')))
                        .catch(err => fail(err, res));
                }
            );
        }
    }

    console.log('load start');
    loadController(require('./controller/User'));
    loadController(require('./controller/Room'));
    loadController(require('./controller/Device'));
    loadController(require('./controller/Sensor'));
    loadController(require('./controller/Datapoint'));
    console.log('load end');
};
