import { Controller, Post, Body, UsePipes, ValidationPipe, HttpCode } from '@nestjs/common'

@Controller('deploymentsHook')
export class DeploymentsHookController {

  @Post('/v2/operator/deployment/hook/reconcile')
  @HttpCode(200)
  @UsePipes(new ValidationPipe({ transform: true }))
  public async reconcile(@Body() params: HookParams) : Promise<{status?: unknown, children: Record<string, unknown>[]}> {
    // console.log(JSON.stringify(params))
    //const deploymentId = params.parent.spec.deploymentId
    // select manifests from v2deployments where id = deploymentId
    const spec = {
      'apiVersion': 'v1',
      'kind': 'Pod',
      'metadata': {
        'name': 'some-pod'
      },
      'spec': {
        'restartPolicy': 'OnFailure',
        'containers': [
          {
            'name': 'hello',
            'image': 'hashicorp/http-echo',
            'args': ['-text', 'hello world']
          }
        ]
      }
    }
    return { children: [spec] }
  }

  @Post('/v2/operator/deployment/hook/finalize')
  @HttpCode(200)
  @UsePipes(new ValidationPipe({ transform: true }))
  public async finalize(@Body() params: HookParams): Promise<{ status?: unknown, children: Record<string, unknown>[], finalized: boolean }> {
    // dont know if we need to perform some cleanup here, maybe do `update v2deployments set active=false`
    return { children: [], finalized: true }
  }
}


export interface HookParams {
  controller: Record<string, unknown>
  parent: {
    apiVersion: 'zupit.com/v1'
    kind: 'CharlesDeployment'
    metadata: Record<string, unknown>
    spec: {
      circleId: string
      deploymentId: string
      components: { chat: string, name: string, tag: string }[]
    }
  }
  children: {
    'Pod.v1': Record<string, childSpec>
  }
  finalizing: boolean
}

interface childSpec {
  name: string
  status: {
    containerStatuses: {
      ready: boolean
      restartCount: number
      started: boolean
    }
  }
}
