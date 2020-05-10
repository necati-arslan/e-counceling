import * as express from 'express';
import { Application } from "express";
import { createCheckoutSession } from './checkout.route';
import { getUserMiddleware } from './get-user.middleware';


import * as cors from "cors";
import { stripeWebhooks } from './stripe-webhooks.route';
import { createCharge } from './createCharge';


export async function initServer() {
    const bodyParser = require('body-parser');

    const app: Application = express();

    app.use(cors());


    console.log('xxxxxxxxxxxx')

    app.route('/').get((req, res) => {
        res.status(200).send("<h1>API is running now</h1>")
    })

    app.route('/api/checkout').post(bodyParser.json(), getUserMiddleware, createCheckoutSession);

    app.route('/api/charge').post(bodyParser.json(), getUserMiddleware, createCharge);


    app.route("/stripe-webhooks").post(
        bodyParser.raw({ type: 'application/json' }), stripeWebhooks);










    const PORT = process.env.PORT || 9000;

    app.listen(PORT, () => {
        console.log('HTTP Rest API Server running....')
    });

} 