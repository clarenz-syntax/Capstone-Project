import "./config/env.js"
import express from "express";
import { connectDB, disconnectDB } from "./config/db.js";

connectDB();

const app = express();

const PORT = 9090;

app.listen(PORT, () => {
    console.log(`Connected Successfully on PORT ${PORT}`);
});