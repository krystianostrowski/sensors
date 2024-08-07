import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SensorsService } from '../sensors.service';
import { CreateSensorDto } from '../dto/create-sensor.dto';

@WebSocketGateway({ namespace: '/sensors', cors: true })
export class SensorGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private readonly sensorsService: SensorsService) {}

  afterInit(server: Server) {
    console.log('WebSocket server init');
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Connected client ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected ${client.id}`);
  }

  @SubscribeMessage('sensorData')
  async handleSensorData(@MessageBody() data: CreateSensorDto) {
    const { temperature, humidity, name } = data;
    if (typeof temperature === 'number' && typeof humidity === 'number' && typeof name === 'string') {
      await this.sensorsService.create(data);
      this.server.emit('sensorDataSaved', data);
    } else {
      this.server.emit('error', 'Invalid data format');
    }
  }
}
