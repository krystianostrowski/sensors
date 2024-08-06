import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SensorsModule } from './sesnors/sensors.module';
import { SensorGateway } from './sesnors/gateway/sensor.gateway';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/sensors'),
    SensorsModule,
  ],
  providers: [SensorGateway],
})
export class AppModule {}
