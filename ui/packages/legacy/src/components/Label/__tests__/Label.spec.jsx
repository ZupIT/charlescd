import React from 'react'
import { render } from 'unit-test/testUtils'
import Label from '..'

test('It shows the label content', async () => {
  const { getByText } = render(<Label id="general.ok" />)
  expect(getByText('Ok')).toBeInTheDocument()
})
