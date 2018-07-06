"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const nuxt_1 = require("nuxt");
const express = require("express");
const app = express();
const config = {
    debug: true,
    dev: false,
    buildDir: 'nuxt',
    build: {
        publicPath: '/'
    }
};
const nuxt = new nuxt_1.Nuxt(config);
function handleRequest(req, res) {
    res.set('Cache-Control', 'public, max-age=600, s-maxage=1200');
    return nuxt.render(req, res);
}
app.use(handleRequest);
exports.ssrapp = functions.https.onRequest(app);
//# sourceMappingURL=index.js.map