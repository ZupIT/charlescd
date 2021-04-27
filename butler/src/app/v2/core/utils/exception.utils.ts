import { HttpException } from '@nestjs/common'
import { HttpStatus } from '@nestjs/common/enums/http-status.enum'

export class ExceptionBuilder  {
      public title: string
      public detail?: string
      public source?: string
      public status: number
  
      constructor(title: string, status: HttpStatus) {
        this.title = title
        this.status = status.valueOf()
      }


      public withDetail(detail: string): ExceptionBuilder{
        this.detail = detail
        return this
      }

      public withSource(source: string): ExceptionBuilder{
        this.source = source
        return this
      }
    
      public build() {
        const errorDetails = new ErrorDetails(this.title, this.status, this.source, this.detail)
        return new HttpException(new ErrorResponse([errorDetails]), this.status)
      }

      public static buildFromArray(errors: ExceptionBuilder[], status: HttpStatus) {
        return new HttpException(new ErrorResponse(errors), status)
      }
}

export class ErrorDetails {
  public title: string
  public detail?: string
  public source?: string
  public status: number

  constructor(title: string, status: number, source: string | undefined, details: string | undefined) {
    this.title = title
    this.status = status
    this.source = source
    this.detail = details
  }
}
export class ErrorResponse {
  public errors: ErrorDetails[];
  constructor(errors: ErrorDetails[]){
    this.errors = errors
  }
}