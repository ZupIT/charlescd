import { Controller, Post, Body, UsePipes, ValidationPipe, HttpCode } from '@nestjs/common'
import { HookParams } from './params.interface'
@Controller('deploymentsHook')
export class DeploymentsHookController {

  @Post('/v2/operator/routes/hook/reconcile')
  @HttpCode(200)
  @UsePipes(new ValidationPipe({ transform: true }))
  public async reconcile(@Body() params: HookParams): Promise<{ status?: unknown, children: Record<string, unknown>[] | [] }> {


    return { children: [] }
  }
}
