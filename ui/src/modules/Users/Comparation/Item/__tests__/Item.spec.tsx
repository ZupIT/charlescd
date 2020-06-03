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

import React from 'react';
import { render, wait, fireEvent } from 'unit-test/testUtils';
import UsersComparationItem from '..';

const props = {
  email: 'test@zup.com.br'
};

test('render UsersComparationItem default component', async () => {
  const { getByTestId } = render(
    <UsersComparationItem {...props} onChange={jest.fn} />
  );

  await wait(() => expect(getByTestId(`users-comparation-item-${props.email}`)).toBeInTheDocument());
});

test('render Modal.Trigger on UsersComparationItem component', async () => {
  const { queryByTestId, getByTestId } = render(
    <UsersComparationItem {...props} onChange={jest.fn} />
  );

  await wait(() => expect(getByTestId(`users-comparation-item-${props.email}`)).toBeInTheDocument());

  const buttonDropdown = queryByTestId('icon-vertical-dots');
  fireEvent.click(buttonDropdown);
  await wait(() => expect(queryByTestId('icon-delete')).toBeInTheDocument())

  fireEvent.click(queryByTestId('icon-delete'));
  await wait(() => expect(queryByTestId('modal-trigger')).toBeInTheDocument())
});

test('click on Cancel button in Modal.Trigger component', async () => {
  const { getByTestId, queryByTestId } = render(
    <UsersComparationItem {...props} onChange={jest.fn} />
  );

  await wait(() => expect(getByTestId(`users-comparation-item-${props.email}`)).toBeInTheDocument());

  const buttonDropdown = queryByTestId('icon-vertical-dots');
  fireEvent.click(buttonDropdown);
  await wait(() => expect(queryByTestId('icon-delete')).toBeInTheDocument())

  const buttonDelete = queryByTestId('icon-delete')
  fireEvent.click(buttonDelete);
  await wait(() => expect(queryByTestId('modal-trigger')).toBeInTheDocument())
  
  const buttonCancel = getByTestId('button-default-dismiss')
  fireEvent.click(buttonCancel);
  await wait(() => expect(queryByTestId('modal-trigger')).not.toBeInTheDocument())
});

test('click on Delete button in Modal.Trigger component', async () => {
  const { getByTestId, queryByTestId } = render(
    <UsersComparationItem {...props} onChange={jest.fn} />
  );

  await wait(() => expect(getByTestId(`users-comparation-item-${props.email}`)).toBeInTheDocument());

  const buttonDropdown = queryByTestId('icon-vertical-dots');
  fireEvent.click(buttonDropdown);
  await wait(() => expect(queryByTestId('icon-delete')).toBeInTheDocument())
  
  const buttonDelete = queryByTestId('icon-delete')
  fireEvent.click(buttonDelete);
  await wait(() => expect(queryByTestId('modal-trigger')).toBeInTheDocument())
  
//   TODO
//   const buttonDeleteFinal = getByTestId('button-default-continue')
//   fireEvent.click(buttonDeleteFinal);
//   await wait(() => expect(queryByTestId('modal-trigger')).not.toBeInTheDocument())
});

test('close UsersComparationItem component', async () => {
    const { queryByTestId, getByTestId } = render(
      <UsersComparationItem {...props} onChange={jest.fn} />
    );
  
    await wait(() => expect(getByTestId(`users-comparation-item-${props.email}`)).toBeInTheDocument());

    const tabPanelCloseButton = queryByTestId('icon-cancel');
    expect(tabPanelCloseButton).toBeInTheDocument();

    fireEvent.click(tabPanelCloseButton);
    wait(() => expect(getByTestId(`users-comparation-item-${props.email}`)).not.toBeInTheDocument())
});