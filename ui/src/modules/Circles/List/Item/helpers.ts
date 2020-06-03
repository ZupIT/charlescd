/*
 * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  CircleHealth,
  CircleComponentHealth
} from '../HealthVariation/interfaces';

function getTroubleComponentsByStatus(components: CircleComponentHealth[]) {
  return components.reduce(
    (accumulator, currentValue) => {
      if (currentValue.status === 'ERROR') {
        accumulator.error += 1;
      } else if (currentValue.status === 'WARNING') {
        accumulator.warning += 1;
      }

      return accumulator;
    },
    { error: 0, warning: 0 }
  );
}

export function getTroubleComponentsAmount(circleHealthData: CircleHealth) {
  const latencyTroubleComponents = getTroubleComponentsByStatus(
    circleHealthData.latency.circleComponents
  );

  const errorTroubleComponents = getTroubleComponentsByStatus(
    circleHealthData.errors.circleComponents
  );

  const troubleComponents = {
    errors: latencyTroubleComponents.error + errorTroubleComponents.error,
    warning: latencyTroubleComponents.warning + errorTroubleComponents.warning
  };

  if (troubleComponents.errors > 0) {
    return {
      status: 'error',
      value: troubleComponents.errors
    };
  } else if (troubleComponents.warning > 0) {
    return {
      status: 'warning',
      value: troubleComponents.warning
    };
  }
}
