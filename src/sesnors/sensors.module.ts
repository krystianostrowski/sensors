import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SensorSchema } from './schemas/sensor.schema.';
import { SensorsService } from './sensors.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Sensor', schema: SensorSchema }]),
  ],
  providers: [SensorsService],
  exports: [SensorsService],
})
export class SensorsModule {}
