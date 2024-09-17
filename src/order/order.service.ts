import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}
  create(createOrderDto: CreateOrderDto) {
    const newOrder = new Order();
    newOrder.email = createOrderDto.email;
    newOrder.productID = createOrderDto.productID;
    newOrder.status = 'draf';
    return this.orderRepository.save(newOrder);
  }

  findAll() {
    return this.orderRepository.find();
  }

  findOne(id: number) {
    return this.orderRepository.findOne({ where: { id: id } });
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
   await this.orderRepository.update(id, updateOrderDto);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.orderRepository.delete(id);
  }
}
