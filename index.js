import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dbConnection from "./config/db.js";
import stockRouter from "./routes/stock.route.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

dbConnection();

app.get("/", async (req, res) => {
  res.send("Stock data app is started...");
});

app.use("/api/v1/stocks", stockRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`App is started at port ${PORT}`);
});
