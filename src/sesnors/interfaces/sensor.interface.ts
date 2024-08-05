import { Document } from 'mongoose'

export interface Sensor extends Document {
  readonly temperature: number
  readonly humidity: number
  readonly timestamp: Date
}