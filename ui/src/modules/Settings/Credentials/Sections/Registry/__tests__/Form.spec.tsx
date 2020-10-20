import React from 'react';
import { render, screen } from 'unit-test/testUtils';
import userEvent from '@testing-library/user-event';
import Form from '../Form';

const mockOnFinish = jest.fn();

test('show test connection button', () => {
  render(<Form onFinish={mockOnFinish} />);

  const gcpButton = screen.getByText(/GCP/);
  userEvent.click(gcpButton);

  const testConnectionButton = screen.getByText(/Test connection/);
  expect(testConnectionButton).toBeInTheDocument();
})