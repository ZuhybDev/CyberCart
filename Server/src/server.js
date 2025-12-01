import express from "express";

const app = express();

app.get("/api", (req, res) => {
    res.status(200).send("Welcome CyberCart");
})


app.listen(3000, () => console.log("Server started on port 3000"));
