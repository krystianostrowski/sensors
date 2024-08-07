import { SensorsService } from "./sensors.service";
import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { CreateSensorDto } from "./dto/create-sensor.dto";

@Controller('sensors')
export class SensorsController {
  constructor (private readonly sensorsService: SensorsService) {}

  @Post()
  create(@Body() sensorData: CreateSensorDto) {
    return this.sensorsService.create(sensorData)
  }

  @Get()
  findAll() {
    return this.sensorsService.findAll()
  }

  @Get(':name')
  findByName(@Param('name') name: string) {
    return this.sensorsService.findByName(name)
  }

  @Delete(':name')
  removeAll(@Param('name') name: string) {
    return this.sensorsService.removeAll(name)
  }
}