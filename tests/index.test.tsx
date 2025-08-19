import { act, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import {
  init as _init,
  createReducer,
  genUUID,
  getNode,
  getRoot,
  getRootNode,
  getState,
  type ModuleToFunc,
  type State,
  setData,
  type Thunk,
  useReducer,
} from '../src/index'

const mockuuidv4 = vi.fn(() => '123')

let container: HTMLDivElement | null
let root: ReactDOM.Root | null
beforeEach(() => {
  container = document.createElement('div')
  document.body.appendChild(container)

  root = ReactDOM.createRoot(container)

  globalThis.IS_REACT_ACT_ENVIRONMENT = true
})

afterEach(() => {
  root = null

  if (container === null) {
    return
  }
  document.body.removeChild(container)
  container = null
})

interface Increment extends State {
  count: number
}

// biome-ignore lint/correctness/noUnusedVariables: in test.
interface Parent extends State {}

// biome-ignore lint/complexity/noBannedTypes: in test.
type Props = {}

it('example in README.md', () => {
  // setup app
  const myClass = 'test/test'

  const init = (): Thunk<Increment> => {
    return async (dispatch, _) => {
      dispatch(_init({ state: { count: 0 } }, mockuuidv4))
    }
  }

  const increment = (myID: string): Thunk<Increment> => {
    return async (dispatch, getClassState) => {
      const me = getNode(getClassState(), myID)
      if (!me) {
        return
      }

      dispatch(setData(myID, { count: me.state.count + 1 }))
    }
  }

  const increment2 = (myID: string): Thunk<Increment> => {
    return async (dispatch, getClassState) => {
      const myState = getState(getClassState(), myID)
      if (!myState) {
        return
      }

      dispatch(setData(myID, { count: myState.count + 1 }))
    }
  }

  const DoIncrement = {
    init,
    increment,
    increment2,
    default: createReducer<Increment>(),
    myClass,
  }

  type TDoIncrement = ModuleToFunc<typeof DoIncrement>

  const App = (props: Props) => {
    const [stateIncrement, doIncrement] = useReducer<Increment, TDoIncrement>(DoIncrement)

    // init
    useEffect(() => {
      doIncrement.init()
      genUUID(mockuuidv4)
    }, [])

    const incrementOrEmpty = getRootNode(stateIncrement)

    if (!incrementOrEmpty) {
      return <div />
    }
    const increment = incrementOrEmpty

    const increment2OrEmpty = getRoot(stateIncrement)
    if (!increment2OrEmpty) {
      return <div />
    }
    const increment2 = increment2OrEmpty

    return (
      <div>
        <p>count: {increment.state.count}</p>
        <p>count: {increment2.count}</p>
        <button type='button' onClick={() => doIncrement.increment(increment.id)} />
        <button type='button' onClick={() => doIncrement.increment2(increment.id)} />
      </div>
    )
  }

  // do act
  act(() => {
    root?.render(<App />)
  })
  if (container === null) {
    return
  }
  const ps = container.querySelectorAll('p')
  const p = ps[0]
  const p1 = ps[1]
  const buttons = container.querySelectorAll('button')
  const button = buttons[0]
  const button1 = buttons[1]

  expect(p.textContent).toBe('count: 0')
  expect(p1.textContent).toBe(p.textContent)

  act(() => {
    button.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  })

  expect(p.textContent).toBe('count: 1')
  expect(p1.textContent).toBe(p.textContent)

  act(() => {
    button1.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  })

  expect(p.textContent).toBe('count: 2')
  expect(p1.textContent).toBe(p.textContent)
})
