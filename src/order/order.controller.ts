import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import {
  ClientProxy,
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

@Controller('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    @Inject('INVENTORY_SERVICE') private client: ClientProxy,
  ) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    const newOrder = await this.orderService.create(createOrderDto);
    console.log('Order sent to Inventory for processing');
    this.client.emit('Order_created', newOrder);
    return newOrder;
  }

  @Get()
  findAll() {
    return this.orderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }

  @MessagePattern('order_completed')
  async handleOrderCompleted(@Payload() data: any, @Ctx() context: RmqContext) {
    console.log('Order completed');
    const channel = context.getChannelRef();
    const message = context.getMessage();
    data.status = 'completed';
    await this.orderService.update(data.id, data);
    channel.ack(message);
  }
  @MessagePattern('order_canceled')
  async handleOrderCanceled(@Payload() data: any, @Ctx() context: RmqContext) {
    console.log('Order canceled');
    const channel = context.getChannelRef();
    const message = context.getMessage();
    data.status = 'canceled';
    await this.orderService.update(data.id, data);
    channel.ack(message);
  }
}
