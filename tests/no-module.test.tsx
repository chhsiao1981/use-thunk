import { act } from 'react'
import ReactDOM from 'react-dom/client'
import { afterEach, beforeEach, expect, it } from 'vitest'
import { ThunkContext } from '../src/index'

let container: HTMLDivElement | null
let root: ReactDOM.Root | null
beforeEach(() => {
  container = document.createElement('div')
  document.body.appendChild(container)

  root = ReactDOM.createRoot(container)

  // @ts-expect-error
  global.IS_REACT_ACT_ENVIRONMENT = true
})

afterEach(() => {
  root = null
  if (container === null) {
    return
  }

  document.body.removeChild(container)
  container = null
})

it('many-parents (init and remove)', () => {
  // biome-ignore lint/complexity/noBannedTypes: Props is a required type.
  type Props = {}
  const App = (_props: Props) => {
    return <div className='empty'>this is an empty test.</div>
  }

  const App2 = () => {
    return (
      <ThunkContext>
        <App />
        <App />
      </ThunkContext>
    )
  }

  // do act
  act(() => {
    root?.render(<App2 />)
  })
  expect(container).not.toBeNull()
  expect(container).not.toBeUndefined()
  if (!container) {
    return
  }

  const emptyDivs = container.querySelectorAll('.empty')

  expect(emptyDivs.length).toBe(2)
})
