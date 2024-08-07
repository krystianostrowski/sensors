import { SensorsService } from './sensors.service';
import { Model } from 'mongoose';
import { Sensor } from './interfaces/sensor.interface';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { CreateSensorDto } from './dto/create-sensor.dto';

const mockSensor = (temperature = 0, humidity = 0): Partial<Sensor> => ({
  temperature,
  humidity,
  timestamp: new Date(),
});

const sensor = mockSensor(21, 55)

class SensorModel {
  constructor(private data: unknown) {}
  save = jest.fn().mockResolvedValue(this.data);
  static find = jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue([sensor])
  });
}

describe('SensorsService', () => {
  let service: SensorsService;
  let model: Model<Sensor>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SensorsService,
        {
          provide: getModelToken('Sensor'),
          useValue: SensorModel,
        },
      ],
    }).compile();

    service = module.get<SensorsService>(SensorsService);
    model = module.get<Model<Sensor>>(getModelToken('Sensor'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(model).toBeDefined();
  });

  it('should create new sensor reading', async () => {
    const createSensorDto: CreateSensorDto = { temperature: 21, humidity: 55, timestamp: new Date() };
    const sensor = await service.create(createSensorDto);

    expect(sensor).toEqual(mockSensor(21, 55));
  });

  it('should return all sensor readings', async () => {
    const sensors = await service.findAll();
    expect(sensors).toEqual([sensor]);
  });
});
