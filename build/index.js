"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const app = express();
//setings
app.set("port", process.env.PORT || 3001);
//midelware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//routes
//app
app.get("/", (_req, res, _next) => {
    res.send("API RUNNING AND READY TO TAKE DATA");
});
app.listen(app.get("port"), () => { console.log(`app succesfully runnint in port ${app.get("port")}`); });
