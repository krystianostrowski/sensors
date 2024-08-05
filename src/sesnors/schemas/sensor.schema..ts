import { Schema } from "mongoose";

export const SensorSchema = new Schema({
  temperature: {type: Number, required: true},
  humidity: {type: Number, required: true},
  timestamp: {type: Date, default: Date.now() }
})