import { INestApplication } from '@nestjs/common';
import * as io from 'socket.io-client';
import { CreateSensorDto } from '../src/sesnors/dto/create-sensor.dto';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';

describe('SensorsGateway (e2e)', () => {
  let app: INestApplication;
  let socket: io.Socket;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    await app.listen(3000);

    socket = io.connect(`http://127.0.0.1:3000/sensors`, {
      transports: ['websocket'],
      reconnection: false,
    });

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });

    await Promise.resolve((resolve) =>
      socket.on('connect', () => {
        console.log('Connect');
        resolve();
      }),
    );
  });

  afterAll(async () => {
    if (socket.connected) {
      socket.disconnect();
    }

    await app.close();
  });

  it('should receive and store sensor data via WebSocket', (done) => {
    const testData: CreateSensorDto = {
      temperature: 23,
      humidity: 45,
      timestamp: new Date(),
    };

    socket.emit('sensorData', testData);

    socket.on('sensorDataSaved', async (data: CreateSensorDto) => {
      expect(data.temperature).toBe(testData.temperature);
      expect(data.humidity).toBe(testData.humidity);

      // Verify data in the database
      // const response = await request(server).get('/sensors');
      // const sensors = response.body;

      // expect(sensors).toHaveLength(1);
      // expect(sensors[0].temperature).toBe(testData.temperature);
      // expect(sensors[0].humidity).toBe(testData.humidity);
      done();
    });

    socket.on('error', (error) => {
      done.fail(`Received error: ${error}`);
    });
  });
});
