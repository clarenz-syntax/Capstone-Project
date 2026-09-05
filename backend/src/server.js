import "./config/env.js"
import express from "express";
import { connectDB, disconnectDB } from "./config/db.js";

connectDB();

//Import Routes
import authRoute from "./routes/authRoute.js" 

const app = express();

//Body Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//API Routes
app.use("/auth", authRoute);

const PORT = 9090;

app.listen(PORT, () => {
    console.log(`Connected Successfully on PORT ${PORT}`);
});