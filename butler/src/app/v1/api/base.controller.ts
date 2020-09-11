import { ValidationPipe, UsePipes } from '@nestjs/common'

@UsePipes(new ValidationPipe({ transform: true }))
export class BaseController { }
