import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import { act } from 'react-dom/test-utils'
import { Empty } from '../src/index'

let container

beforeEach(() => {
  container = document.createElement('div')
  document.body.appendChild(container)
})

afterEach(() => {
  document.body.removeChild(container)
  container = null;
})


it('Empty', () => {
  // setup app

  const App = (props) => {
    return (
      <Empty />
    )
  }

  // do act
  act(() => {
    ReactDOM.render(<App />, container)
  })

  const div = container.querySelector('div')


  expect(div.getAttribute('style')).toBe('display: none;')
})

