import express from "express";
import logsRouter from "../src/routes/logRoutes.js";
import cors from "cors";


const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/logs", logsRouter);


app.get("/", (req, res) => {
  res.send("API running");
});

export default app;