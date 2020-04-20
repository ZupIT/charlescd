import React from 'react'
import { render } from 'unit-test/testUtils'
import Modules from '..'

describe('Modules', () => {
  test('Render hello component div', async () => {
    const { getByText } = render(<Modules>Hello component</Modules>)
    const divElement = getByText(/Hello component/)
    expect(divElement).toBeInTheDocument()
  })
})
