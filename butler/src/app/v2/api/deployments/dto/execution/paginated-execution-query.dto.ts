import { IsBooleanString, IsNumberString, IsOptional } from 'class-validator'

export class ExecutionQuery {
  @IsNumberString()
  @IsOptional()
  public pageSize: number

  @IsNumberString()
  @IsOptional()
  public page: number

  @IsBooleanString()
  public active: boolean

  constructor(pageSize: number, page: number, active: boolean) {
    this.pageSize = pageSize
    this.page = page
    this.active = active
  }
}
