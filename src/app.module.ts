import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SensorsModule } from './sesnors/sensors.module';
import { SensorGateway } from './sesnors/gateway/sensor.gateway';

const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/sensors'

@Module({
  imports: [
    MongooseModule.forRoot(MONGODB_URL),
    SensorsModule,
  ],
  providers: [SensorGateway],
})
export class AppModule {}
