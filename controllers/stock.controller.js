import csvParser from "csv-parser";
import fs from "fs";
import Stock from "../models/stock.model.js";
import { parse } from "path";

export const uploadData = async (req, res) => {
  if (!req.file || req.file.mimetype !== "text/csv") {
    return res.status(400).json({ error: "Please upload a valid CSV file" });
  }

  let totalRecords = 0;
  let successfulRecords = 0;
  let failedRecords = 0;

  fs.createReadStream(req.file.path)
    .pipe(csvParser())
    .on("data", async (data) => {
      totalRecords++;
      try {
        if (!parse(data.Date, "yyyy-MM-dd", new Date())) {
          throw new Error("Invalid date");
        }
        console.log("Data is => ", data);
        const dataSet = {
          date: data.Date ? new Date(data.Date) : null,
          symbol: data.Symbol || null,
          series: data.Series || null,
          prev_close: parseFloat(data["Prev Close"]) || 0,
          open: parseFloat(data.Open) || 0,
          high: parseFloat(data.High) || 0,
          low: parseFloat(data.Low) || 0,
          last: parseFloat(data.Last) || 0,
          close: parseFloat(data.Close) || 0,
          vwap: parseFloat(data.VWAP) || 0,
          volume: parseInt(data.Volume) || 0,
          turnover: parseFloat(data.Turnover) || 0,
          trades:
            data.Trades === "NaN" || !data.Trades
              ? null
              : parseInt(data.Trades),
          deliverable: parseInt(data["Deliverable Volume"]) || 0,
          percent_deliverable:
            data["%Deliverble"] === "NaN" || !data["%Deliverble"]
              ? null
              : parseFloat(data["%Deliverble"]),
        };
        successfulRecords++;
        await Stock.create(dataSet);
      } catch (error) {
        console.error("Failed record:", data);
        console.log(error);
        failedRecords++;
      }
    })
    .on("end", () => {
      res.json({
        totalRecords,
        successfulRecords,
        failedRecords,
      });
    });
};

export const getHighestVolume = async (req, res) => {
  const { start_date, end_date, symbol } = req.query;
  const filter = {
    date: { $gte: new Date(start_date), $lte: new Date(end_date) },
    ...(symbol && { symbol }),
  };
  const highestVolume = await Stock.findOne(filter).sort("-volume").limit(1);
  res.json({ highest_volume: highestVolume });
};

export const getAverageClose = async (req, res) => {
  const { start_date, end_date, symbol } = req.query;
  const filter = {
    date: { $gte: new Date(start_date), $lte: new Date(end_date) },
    symbol,
  };
  const avgClose = await Stock.aggregate([
    { $match: filter },
    { $group: { _id: null, avgClose: { $avg: "$close" } } },
  ]);
  res.json({ average_close: avgClose[0]?.avgClose || 0 });
};

export const getAverageVWAP = async (req, res) => {
  const { start_date, end_date, symbol } = req.query;
  const filter = {
    date: { $gte: new Date(start_date), $lte: new Date(end_date) },
    ...(symbol && { symbol }),
  };
  const avgVWAP = await Stock.aggregate([
    { $match: filter },
    { $group: { _id: null, avgVWAP: { $avg: "$vwap" } } },
  ]);
  res.json({ average_vwap: avgVWAP[0]?.avgVWAP || 0 });
};
