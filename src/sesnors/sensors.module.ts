import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SensorSchema } from './schemas/sensor.schema.';
import { SensorsService } from './sensors.service';
import { SensorsController } from './sensors.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Sensor', schema: SensorSchema }]),
  ],
  providers: [SensorsService],
  controllers: [SensorsController],
  exports: [SensorsService],
})
export class SensorsModule {}
