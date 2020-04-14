import React from 'react'
import { render } from 'unit-test/testUtils'
import Button from '../Button'


describe('Button', () => {
  test('It shows the Button content', async () => {
    const { getByText } = render(
      <Button>
        Foobar
      </Button>,
    )
    expect(getByText('Foobar')).toBeInTheDocument()
  })

  test('It shows the Button loading', async () => {
    const { getByText, getByTitle } = render(
      <Button isLoading>
        Foobar
      </Button>,
    )

    expect(getByText('Foobar')).toBeDisabled()
    expect(getByText('Foobar')).toBeInTheDocument()
    expect(getByTitle('loading')).toBeInTheDocument()
  })
})
