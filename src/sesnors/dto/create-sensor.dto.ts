export class CreateSensorDto {
  readonly temperature: number
  readonly humidity: number
  readonly timestamp: Date = new Date()
  readonly name: string
}