import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty()
  productID: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  status: string;
}
