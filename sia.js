/**
 * Copyright 2018 Timvork Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

module.exports = function(RED) {
    "use strict";
    const EventEmitter = require('events').EventEmitter;
    const appEnv = require('cfenv').getAppEnv();
    const operations = require('./operations')
    const forEachIteration = new Error("node-red-contrib-sia forEach iteration");
    const forEachEnd = new Error("node-red-contrib-sia forEach end");

    let services = [];
    Object.keys(appEnv.services).forEach(function(label) {
        if ((/^sia/i).test(label)) {
            services = services.concat(appEnv.services[label].map(function(service) {
                return {
                    "name": service.name,
                    "label": service.label
                };
            }));
        }
    });

    const generateCurl = (config, path, cred, data, post, args) => {
        if(args) path = `${path}${args}`
        if(post) return `curl -A "Sia-Agent" -u "":${config.credentials.apipassword} -X POST ${config.uri}/${path}`
        if(data) return `curl -A "Sia-Agent" -u "":${config.credentials.apipassword} --data "encryptionpassword=${config.credentials.walletPassword}" ${config.uri}/${path}`
        if(cred) return `curl -A "Sia-Agent" -u "":${config.credentials.apipassword} ${config.uri}/${path}`
        return `curl -A "Sia-Agent" ${config.uri}/${path}`
    }

    RED.nodes.registerType("sia", function SiaConfigNode(n) {
        RED.nodes.createNode(this, n);
        this.uri = n.uri;
        this.name = n.name;
        if (!!n.options) {
            try {
                this.options = JSON.parse(n.options);
            } catch (err) {
                this.error("Failed to parse options: " + err);
            }
        }
        this.deploymentId = (1 + Math.random() * 0xffffffff).toString(16).replace('.', '');
    }, {
        "credentials": {
            "walletPassword": {
                "type": "password"
            },
            "apipassword": {
                "type": "password"
            }
        }
    });

    RED.httpAdmin.get('/sia/vcap', function(req, res) {
        res.json(services);
    });

    RED.httpAdmin.get('/sia/operations', function(req, res) {
        res.json(Object.keys(operations).sort());
    });

    let allSiaConnectings = RED.settings.get('siaConnects') ? RED.settings.get('siaConnects') : false;
    RED.nodes.registerType("sia in", function SiaInputNode(n) {
        RED.nodes.createNode(this, n);
        this.configNode = n.configNode;
        this.collection = n.collection;
        this.operation = n.operation;
        if (n.service == "_ext_") {
            // Refer to the config node's id, uri, options and warn function.
            this.config = RED.nodes.getNode(this.configNode);
        } else if (n.service) {
            const configService = appEnv.getService(n.service);
            if (configService) {
                // Only a uri is defined.
                this.config = {
                    "deploymentId": 'service:' + n.service, // different from node-red deployment ids.
                    "uri": configService.credentials.uri || configService.credentials.url
                };
            }
        }
        let uri;
        if(allSiaConnectings){
            this.config.uri = allSiaConnectings.uri;
            uri = this.config.uri || allSiaConnectings.uri
        }
        if (!this.config || !this.config.uri) {
            this.error("missing sia configuration");
            return;
        }
        const node = this;

        //
        let nodeOperation;
        if (node.operation) {
            nodeOperation = operations[node.operation];
        }
        node.on('input', function(msg) {
            setImmediate(function() {
                handleMessage(msg);
            });
        });
        node.on('node-red-contrib-sia handleMessage', function(msg) {
            // see: messageHandlingCompleted
            setImmediate(function(){
                handleMessage(msg);
            });
        });
        function handleMessage(msg) {
            msg.payload = generateCurl(node.config, nodeOperation[0], nodeOperation[1], nodeOperation[2], nodeOperation[3], msg.args)
            node.send(msg);
        }

        node.on('close', function() {
            if (node.config) {
            }
            node.removeAllListeners('node-red-contrib-sia handleMessage');
            if (debouncer) {
                clearTimeout(debouncer);
            }
        });
    });
};
