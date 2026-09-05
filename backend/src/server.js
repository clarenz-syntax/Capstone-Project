import express from "express";

const app = express();

const PORT = 9090;

app.listen(PORT, () => {
    console.log(`Connected Successfully on PORT ${PORT}`);
});