import { Controller, Post, Body, UsePipes, ValidationPipe, HttpCode } from '@nestjs/common'
import { HookParams } from './params.interface'

@Controller('deploymentsHook')
export class DeploymentsHookController {

  @Post('/v2/operator/deployment/hook/reconcile')
  @HttpCode(200)
  @UsePipes(new ValidationPipe({ transform: true }))
  public async reconcile(@Body() params: HookParams) : Promise<{status?: unknown, children: Record<string, unknown>[]}> {
    console.log(JSON.stringify(params))
    const deploymentId = params.parent.spec.deploymentId
    // const specs = `select manifests from v2deployments where id = deploymentId`
    const specs = [
      {
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
    ]
    const podNames = Object.keys(params.children['Pod.v1'])
    const allReady = podNames.every( p => params.children['Pod.v1'][p].status.containerStatuses.ready)
    if (allReady) {
      // params.parent.spec.deploymentId = 123
      // params.children = [
      //   pod: {name: quiz-app-backend}
      //   pod: {name: quiz-app-front}
      // ]
      // k8sClient.updateRoutesResource(params.children)
      // - id: 123  << add those
      //   components:
      //   - quiz-app-backend
      //   - quiz-app-frontend

    }
    return { children: specs }
  }

  @Post('/v2/operator/deployment/hook/finalize')
  @HttpCode(200)
  @UsePipes(new ValidationPipe({ transform: true }))
  public async finalize(@Body() params: HookParams): Promise<{ status?: unknown, children: Record<string, unknown>[], finalized: boolean }> {
    console.log(JSON.stringify(params))
    // deploymentRepository.update(params.parent.spec.deploymentId, {active: false})
    // params.parent.spec.deploymentId = 123
    // params.children = [
    //   pod: {name: quiz-app-backend}
    //   pod: {name: quiz-app-front}
    // ]
    // k8sClient.createRoutesResource(params.children)
    // - id: 123  << remove those
    //   components:
    //   - quiz-app-backend
    //   - quiz-app-frontend

    return { children: [], finalized: true }
  }
}
