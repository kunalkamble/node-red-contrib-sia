## node-red-contrib-sia

A [Node-RED](http://nodered.org) node to query [Sia API](https://sia.tech/docs/).

    Created by Kunal Kamble

### Install

Run the following command in the root directory of your Node-RED install

    npm install node-red-contrib-sia


### Set Credentials

   add data to settings.js

    siaConnects:
    {
       uri: "http://localhost:9980",
       walletPassword: "demo123",
       apipassword: "2147fd9bb6d4ebffb4044b1eaf78ce99"
    }



### Example node-red flowgit 

Import the flow below in an empty sheet in nodered with test end point to check **Sia Daemon version**

`
[{"id":"d37b09f1.c58378","type":"http in","z":"8d240379.15af7","name":"","url":"/daemon/version","method":"get","upload":false,"swaggerDoc":"","x":160,"y":1320,"wires":[["bcbf7bcf.0cc6d8"]]},{"id":"88a09cd9.2e8be","type":"http response","z":"8d240379.15af7","name":"","statusCode":"","headers":{},"x":710,"y":1400,"wires":[]},{"id":"bcbf7bcf.0cc6d8","type":"sia in","z":"8d240379.15af7","service":"_ext_","configNode":"c9b3ee3d.4734e","name":"Get Daemon version","operation":"GET daemon/version","x":400,"y":1320,"wires":[["739f0a8f.8e5064"]]},{"id":"739f0a8f.8e5064","type":"exec","z":"8d240379.15af7","command":"","addpay":true,"append":"","useSpawn":"false","timer":"","oldrc":false,"name":"","x":430,"y":1420,"wires":[["ed05f044.5ec72"],[],["82da64ab.c56bb8"]]},{"id":"ed05f044.5ec72","type":"json","z":"8d240379.15af7","name":"","property":"payload","action":"","pretty":false,"x":570,"y":1400,"wires":[["88a09cd9.2e8be"]]},{"id":"b0215cb.519f8a","type":"debug","z":"8d240379.15af7","name":"","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"true","targetType":"full","statusVal":"","statusType":"auto","x":750,"y":1460,"wires":[]},{"id":"82da64ab.c56bb8","type":"switch","z":"8d240379.15af7","name":"Handle Error","property":"payload.code","propertyType":"msg","rules":[{"t":"neq","v":"0","vt":"str"}],"checkall":"true","repair":false,"outputs":1,"x":580,"y":1460,"wires":[["b0215cb.519f8a","88a09cd9.2e8be"]]},{"id":"c9b3ee3d.4734e","type":"sia","z":"","uri":"http://localhost:9980","name":"Sia Local"}]
`