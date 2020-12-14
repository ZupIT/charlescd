import { Controller, Post, Body, UsePipes, ValidationPipe, HttpCode } from '@nestjs/common'
import { HookParams } from './deployments.hook.controller'
@Controller('deploymentsHook')
export class DeploymentsHookController {

  @Post('/v2/operator/deployment/hook/reconcile')
  @HttpCode(200)
  @UsePipes(new ValidationPipe({ transform: true }))
  public async reconcile(@Body() params: HookParams): Promise<{ status?: unknown, children: Record<string, unknown>[] | [] }> {

    const podNames = Object.keys(params.children['Pod.v1'])
    const allReady = podNames.every( p => params.children['Pod.v1'][p].status.containerStatuses.ready)

    let childSpec : Record<string, unknown>[] | [] = []
    if (allReady) {
      childSpec = [] // list of virtual services
    }

    return { children: childSpec }

  }
}
