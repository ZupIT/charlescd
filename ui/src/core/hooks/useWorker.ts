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

import { useEffect, useRef, useState, useCallback } from 'react';
import { buildHeaders, basePath } from 'core/providers/base';
import { logout } from 'core/utils/auth';

function loadWorker(workerFile: Function) {
  const code = workerFile.toString();
  const blob = new Blob(['(' + code + ')()']);
  return new Worker(URL.createObjectURL(blob));
}

const useWorker = <T>(
  workerFile: Function,
  initialValue?: T
): [T, Function] => {
  const worker = useRef<Worker>();
  const [data, setData] = useState<T>(initialValue);

  const terminateWorker = () => {
    worker.current.terminate();
  };
  const workerHook = useCallback(
    (apiParams: object) => {
      if (worker.current) {
        terminateWorker();
      }

      worker.current = loadWorker(workerFile);
      worker.current.postMessage({
        apiParams,
        headers: buildHeaders(),
        basePath
      });
      worker.current.addEventListener('message', (event: MessageEvent) => {
        if (event.data.unauthorized) {
          logout();
        } else {
          setData(event.data);
        }
      });
    },
    [workerFile]
  );

  useEffect(() => {
    return () => terminateWorker();
  }, []);

  return [data, workerHook];
};

export default useWorker;
