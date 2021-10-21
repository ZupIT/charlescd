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

import userEvent from '@testing-library/user-event';
import { fireEvent, render, screen } from 'unit-test/testUtils';
import Editor from '..';
import { TAB } from '../helper';

test('should render Editor', () => {
  render(<Editor />);

  expect(screen.getByTestId('line-0')).toBeInTheDocument();
  const text = screen.getByTestId('line-text-0');
  expect(text).toHaveTextContent('');
  expect(screen.queryByTestId('line-1')).not.toBeInTheDocument();
  const textarea = screen.getByTestId('input-text-undefined');
  expect(textarea).not.toHaveAttribute('readOnly');
});

test('should render Editor with size props', () => {
  render(<Editor width="100px" height="100px" />);

  const editor = screen.getByTestId('editor');
  expect(editor).toHaveStyle('width: 100px');
  expect(editor).toHaveStyle('height: 100px');
});

test('should render Editor in view mode', () => {
  render(<Editor mode="view" />);

  const textarea = screen.getByTestId('input-text-undefined');
  expect(textarea).toHaveAttribute('readOnly');
});

test('should complete editor', () => {
  render(<Editor mode="edit" />);

  const textarea = screen.getByTestId('input-text-undefined');
  userEvent.type(textarea, '{');
  userEvent.type(textarea, '[');
  userEvent.type(textarea, '"');

  expect(textarea).toHaveValue('{}[]""');
});

test('should accept tab command', () => {
  render(<Editor mode="edit" name="editor" />);

  const textarea = screen.getByTestId('input-text-editor');
  fireEvent.keyDown(textarea, { key: 'Tab' });
  const line = screen.getByTestId('line-text-0');
  expect(line.textContent.match(/\s/g).length).toEqual(TAB.length);
});

test('should accept enter command', () => {
  render(<Editor mode="edit" name="editor" />);

  const textarea = screen.getByTestId('input-text-editor');
  expect(screen.getByTestId('line-text-0')).toBeInTheDocument();
  expect(screen.queryByTestId('line-text-1')).not.toBeInTheDocument();
  fireEvent.keyDown(textarea, { key: 'Enter' });
  expect(screen.getByTestId('line-text-0')).toBeInTheDocument();
  expect(screen.getByTestId('line-text-1')).toBeInTheDocument();
});

test('should accept enter command after type {', () => {
  const { container } = render(<Editor mode="edit" name="editor" />);

  const textarea = screen.getByTestId('input-text-editor');
  userEvent.type(textarea, '{');
  container.querySelector('textarea').setSelectionRange(1, 1);
  fireEvent.keyDown(textarea, { key: 'Enter' });

  const line1 = screen.getByTestId('line-text-1');

  expect(screen.getByTestId('line-text-0')).toBeInTheDocument();
  expect(line1).toBeInTheDocument();
  expect(screen.getByTestId('line-text-2')).toBeInTheDocument();
  expect(line1.textContent.match(/\s/g).length).toEqual(TAB.length);
});
