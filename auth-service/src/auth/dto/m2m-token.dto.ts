import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class M2MTokenDto {
  @ApiProperty({ description: 'service account', example: 'inventory_service' })
  @IsString()
  @IsNotEmpty()
  clientId: string;

  @ApiProperty({
    description: 'service secret',
    example: 'super_secret_password',
  })
  @IsString()
  @IsNotEmpty()
  clientSecret: string;
}
