import { VirtualServiceSpec, DestinationRuleSpec } from './params.interface'

type PartialVirtualServiceSpec = Pick<VirtualServiceSpec, 'kind' | 'metadata'>
type PartialDestinationRuleSpec = Pick<DestinationRuleSpec, 'kind' | 'metadata'>
export type SpecsUnion = PartialVirtualServiceSpec | PartialDestinationRuleSpec


export interface PartialRouteHookParams {
  parent: {
    spec: {
      circles: {
        components: {
          name: string
          tag: string
        }[]
        default: boolean
        id: string
      }[]
    }
  }
  children: PartialRouteChildren
}

interface PartialRouteChildren {
  'VirtualService.networking.istio.io/v1beta1': PartialChildVirtualServiceSpec,
  'DestinationRule.networking.istio.io/v1beta1': PartialChildDestinationRuleSpec
}


interface PartialChildVirtualServiceSpec {
  [key: string]: PartialVirtualServiceSpec
}

interface PartialChildDestinationRuleSpec {
  [key: string]: PartialDestinationRuleSpec
}
