import { render, act, screen, waitFor } from 'unit-test/testUtils';
import userEvent from '@testing-library/user-event';
import FormUser from '../Form';

test('should render default component', async () => {
  const onFinish = jest.fn();

  render(<FormUser onFinish={onFinish} />);
  
  await waitFor(() => expect(screen.getAllByText('Create User')).toHaveLength(2));
  await waitFor(() => expect(screen.getByText('Enter the requested information bellow:')).toBeInTheDocument());
  await waitFor(() => expect(screen.getByLabelText('User name')).toBeInTheDocument());
  await waitFor(() => expect(screen.getByLabelText('E-mail')).toBeInTheDocument());
  await waitFor(() => expect(screen.getByLabelText('Create password')).toBeInTheDocument());
  await waitFor(() => expect(screen.getByTestId('icon-info')).toBeInTheDocument());
});

test('should enable button when all fields are filled and validated', async () => {
  const onFinish = jest.fn();

  render(<FormUser onFinish={onFinish} />);

  const nameInput = screen.getByLabelText('User name');
  const emailInput = screen.getByLabelText('E-mail');
  const passwordInput = screen.getByLabelText('Create password');

  await act(async () => {
    userEvent.type(nameInput, 'charles');
    userEvent.type(emailInput, 'charlesadmin@zup.com.br');
    userEvent.type(passwordInput, 'Mudar123');
  })

  const createUserButton = screen.getByTestId('button-create-user');
  expect(createUserButton).not.toHaveAttribute('disabled');
});

test('should not enable button with missing name', async () => {
  const onFinish = jest.fn();

  render(<FormUser onFinish={onFinish} />);

  const nameInput = screen.getByLabelText('User name');
  const emailInput = screen.getByLabelText('E-mail');
  const passwordInput = screen.getByLabelText('Create password');

  await act(async () => {
    userEvent.type(nameInput, '');
    userEvent.type(emailInput, 'charlesadmin@zup.com.br');
    userEvent.type(passwordInput, 'Mudar123');
  })

  const createUserButton = screen.getByTestId('button-create-user');
  expect(createUserButton).toHaveAttribute('disabled');
});