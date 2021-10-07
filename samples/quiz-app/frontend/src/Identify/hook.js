/*
 *
 *  Copyright 2020, 2021 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

import { useState, useCallback } from "react"
import { request } from "../api";
import { saveCookie } from "../utils/cookie";

export const useIdentify = () => {
  const [status, setStatus] = useState('idle');

  const getCircleID = useCallback(async (payload) => {
    const workspaceId = process.env.REACT_APP_WORKSPACE_ID
    const circleMatcherUrl = process.env.REACT_APP_CIRCLE_MATCHER_URL
    try {
      setStatus('pending');
      const data = {
        workspaceId: workspaceId,
        requestData: payload
      };
      const response = await request(
        circleMatcherUrl,
        { method: 'POST', data }
      );
      const [{ id }] = response.data.circles;
      saveCookie('x-circle-id', id);
      setStatus('resolved');

    } catch (e) {
      saveCookie('x-circle-id', 'UNMATCHED');
      setStatus('rejected');
      console.error(e);
    }
  }, []);

  return {
    getCircleID,
    status
  }
}
