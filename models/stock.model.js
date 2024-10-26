import mongoose from "mongoose";

const stockSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  symbol: {
    type: String,
  },
  series: {
    type: String,
  },
  prev_close: {
    type: Number,
  },
  open: {
    type: Number,
  },
  high: {
    type: Number,
  },
  low: {
    type: Number,
  },
  last: {
    type: Number,
  },
  close: {
    type: Number,
  },
  vwap: {
    type: Number,
  },
  volume: {
    type: Number,
  },
  turnover: {
    type: Number,
  },
  trades: {
    type: Number,
  },
  deliverable: {
    type: Number,
  },
  percent_deliverable: {
    type: Number,
  },
});

const Stock = mongoose.model("Stock", stockSchema);
export default Stock;
