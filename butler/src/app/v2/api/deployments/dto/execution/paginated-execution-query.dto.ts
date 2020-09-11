import { IsBooleanString, IsOptional, IsInt, Min } from 'class-validator'
import { Transform } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

export class ExecutionQuery {

  @ApiProperty()
  @IsInt()
  @Min(1)
  @IsOptional()
  @Transform(size => parseInt(size), { toClassOnly: true })
  public size: number

  @ApiProperty()
  @IsInt()
  @Min(0)
  @IsOptional()
  @Transform(page => parseInt(page), { toClassOnly: true })
  public page: number

  @ApiProperty()
  @IsBooleanString()
  public active: boolean

  constructor(size: number, page: number, active: boolean) {
    this.size = size
    this.page = page
    this.active = active
  }
}
