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
       "walletPassword": "demo123",
       "apipassword": "2147fd9bb6d4ebffb4044b1eaf78ce99"
    }


### Example For Request

   set data in function node

    msg.payload = {"login": "login"};
    return msg;


### Example node-red flowgit 

Import the flow below in an empty sheet in nodered

