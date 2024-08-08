import { INestApplication } from '@nestjs/common';
import * as io from 'socket.io-client';
import { CreateSensorDto } from '../src/sesnors/dto/create-sensor.dto';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import axios from 'axios';

describe('SensorsGateway (e2e)', () => {
  let app: INestApplication;
  let socket: io.Socket;

  const testData: CreateSensorDto = {
    temperature: 23,
    humidity: 45,
    timestamp: new Date(),
    name: 'TestSensor',
  };

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

    await axios.delete('http://127.0.0.1:3000/sensors/TestSensor');
    await app.close();
  });

  afterEach(() => {
    socket.off('error');
  })

  it('should add sensor using HTTP request', async () => {
    const response = await axios.post('http://127.0.0.1:3000/sensors', testData)
    console.log(response)
  })

  it('should get all sensors using HTTP request', async () => {
    const response = await axios.get('http://127.0.0.1:3000/sensors')
    expect(response.data).toHaveLength(1)
  })

  it('should get sensors by name using HTTP request', async () => {
    const response = await axios.get('http://127.0.0.1:3000/sensors/TestSensor')
    expect(response.data).toHaveLength(1)
  })

  it('should delete sensor using HTTP request', async () => {
    const response = await axios.delete('http://127.0.0.1:3000/sensors/TestSensor')
    expect(response.data).toEqual({ acknowledged: true, deletedCount: 1 })

    const afterDelete = await axios.get('http://127.0.0.1:3000/sensors/TestSensor')
    expect(afterDelete.data).toHaveLength(0)
  })

  it('should receive and store sensor data via WebSocket', (done) => {
    socket.emit('sensorData', testData);

    socket.on('sensorDataSaved', async (data: CreateSensorDto) => {
      expect(data.temperature).toBe(testData.temperature);
      expect(data.humidity).toBe(testData.humidity);

      const response = await axios.get(
        'http://127.0.0.1:3000/sensors/TestSensor',
      );
      const sensors = response.data;

      expect(sensors).toHaveLength(1);
      expect(sensors[0].temperature).toBe(testData.temperature);
      expect(sensors[0].humidity).toBe(testData.humidity);
      done();
    });

    socket.on('error', (error) => {
      done(`Received error: ${error}`);
    });
  });

  it('should handle invalid sensor data format', done => {
    const invalidData = {
      temperature: "temp",
      humidity: 50,
      name: "TestSensor"
    }

    socket.emit('sensorData', invalidData)

    socket.on('error', (error) => {
      expect(error).toBe("Invalid data format")
      done();
    })
  })
});
