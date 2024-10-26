import express from "express";
import multer from "multer";
import {
  getAverageClose,
  getAverageVWAP,
  getHighestVolume,
  uploadData,
} from "../controllers/stock.controller.js";

const stockRouter = express.Router();
const upload = multer({ dest: "uploads/" });

stockRouter.post("/upload", upload.single("file"), uploadData);
stockRouter.get("/highest_volume", getHighestVolume);
stockRouter.get("/average_close", getAverageClose);
stockRouter.get("/average_vwap", getAverageVWAP);

export default stockRouter;
