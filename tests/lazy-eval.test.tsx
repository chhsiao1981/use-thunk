import { act, useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { afterEach, beforeEach, expect, it } from 'vitest'
import {
  init as _init,
  createReducer,
  genUUID,
  getRoot,
  getState,
  type State,
  setData,
  type Thunk,
  useReducer,
} from '../src/index'

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

interface A extends State {
  theStr: string
  theStr2: string
}

interface B extends State {}

type Props = unknown
it('should lazy eval', () => {
  // setup app
  const aClass = 'test/a'

  const initA = (myID: string): Thunk<A> => {
    return async (dispatch, _) => {
      dispatch(_init({ myID, state: { theStr: 'theStr' } }))
    }
  }

  const dupStr = (myID: string): Thunk<A> => {
    return async (dispatch, getClassState) => {
      const classState = getClassState()
      const me = getState(classState, myID)
      dispatch(setData(myID, { theStr2: `${me?.theStr}-2` }))
    }
  }

  const DoA = {
    init: initA,
    default: createReducer<A>(),
    dupStr,
    myClass: aClass,
  }

  const App = (props: Props) => {
    const [stateA, doA] = useReducer(DoA)
    const [aID, setAID] = useState(genUUID())

    useEffect(() => {
      doA.init(aID)
    }, [])

    const a = getRoot(stateA)
    const isRoot = !!a

    useEffect(() => {
      if (!isRoot) {
        return
      }

      doA.dupStr(aID)
    }, [isRoot])

    if (!a) return <div />

    return (
      <div>
        <p>{a.theStr}</p>
        <p>{a.theStr2}</p>
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
  expect(ps.length).toBe(2)
  const p = ps[0]
  const p1 = ps[1]

  expect(p.textContent).toBe('theStr')
  expect(p1.textContent).toBe('theStr-2')
})
