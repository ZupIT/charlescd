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
// @ts-nocheck


import { render, screen } from 'unit-test/testUtils';
import Revoke from '../Revoke';
import {revokeTitle, revokeDescription} from './fixtures';

test('should render revoke modal', () => {
  const onClose = jest.fn();
  const onContinue = jest.fn();
  const loading = false;

  render(
    <Revoke 
      onClose={onClose} 
      onContinue={onContinue} 
      isLoading={loading}
      tokenName="token test 1"
    />);

    expect(screen.getByText(revokeTitle)).toBeInTheDocument();
    expect(screen.getByText(revokeDescription)).toBeInTheDocument();
    expect(screen.getByText('Cancel, keep token')).toBeInTheDocument();
    expect(screen.getByText('Yes, revoke token')).toBeInTheDocument();
    expect(screen.getByText('token test 1')).toBeInTheDocument();
});