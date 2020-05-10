"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const checkout_route_1 = require("./checkout.route");
const get_user_middleware_1 = require("./get-user.middleware");
const cors = require("cors");
const stripe_webhooks_route_1 = require("./stripe-webhooks.route");
const createCharge_1 = require("./createCharge");
async function initServer() {
    const bodyParser = require('body-parser');
    const app = express();
    app.use(cors());
    console.log('xxxxxxxxxxxx');
    app.route('/').get((req, res) => {
        res.status(200).send("<h1>API is running now</h1>");
    });
    app.route('/api/checkout').post(bodyParser.json(), get_user_middleware_1.getUserMiddleware, checkout_route_1.createCheckoutSession);
    app.route('/api/charge').post(bodyParser.json(), get_user_middleware_1.getUserMiddleware, createCharge_1.createCharge);
    app.route("/stripe-webhooks").post(bodyParser.raw({ type: 'application/json' }), stripe_webhooks_route_1.stripeWebhooks);
    const PORT = process.env.PORT || 9000;
    app.listen(PORT, () => {
        console.log('HTTP Rest API Server running....');
    });
}
exports.initServer = initServer;
//# sourceMappingURL=server.js.map