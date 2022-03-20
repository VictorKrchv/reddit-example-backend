import { ApiProperty } from '@nestjs/swagger';

export class EmailSingle {
  @ApiProperty({ description: 'Email невалидный' })
  noValid: boolean;

  @ApiProperty({ description: 'Email занят' })
  exists: boolean;
}
