import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import { act } from 'react-dom/test-utils'
import { init as _init, setData, createReducer, DispatchedAction, State, GetClassState, Action, UseReducerParams, getNodeState, getState, getRootState, _GEN_UUID_STATE, genUUID, Dispatch, Thunk } from '../src/index'
import { useReducer, getRoot } from '../src/index'

const mockuuidv4 = jest.fn(() => '123')

let container: any

beforeEach(() => {
  // @ts-ignore
  container = document.createElement('div')
  // @ts-ignore
  document.body.appendChild(container)
})

afterEach(() => {
  // @ts-ignore
  document.body.removeChild(container)
  container = null
})

interface Me extends State {
  count: number
}

interface Parent extends State {

}

type Props = {

}

it('example in README.md', () => {
  // setup app
  const myClass = 'test/test'

  const init = (doMe: DispatchedAction<Me>, parentID: string, doParent: DispatchedAction<Parent>): Thunk<Me> => {
    return (dispatch: Dispatch<Me>, _: GetClassState<Me>) => {
      dispatch(_init({ myClass, doMe, parentID, doParent, state: { count: 0 } }, mockuuidv4))
    }
  }

  const increment = (myID: string): Thunk<Me> => {
    return (dispatch: Dispatch<Me>, getClassState: GetClassState<Me>) => {
      let me = getNodeState(getClassState(), myID)
      if (!me) {
        return
      }

      dispatch(setData(myID, { count: me.state.count + 1 }))
    }
  }

  const increment2 = (myID: string): Thunk<Me> => {
    return (dispatch: Dispatch<Me>, getClassState: GetClassState<Me>) => {
      let myState = getState(getClassState(), myID)
      if (!myState) {
        return
      }

      dispatch(setData(myID, { count: myState.count + 1 }))
    }
  }

  let DoIncrement: UseReducerParams<Me> = {
    init,
    increment,
    increment2,
    default: createReducer(),
  }

  const App = (props: Props) => {
    const [stateIncrement, doIncrement] = useReducer<Me>(DoIncrement)

    // init
    useEffect(() => {
      doIncrement.init(doIncrement)
      genUUID(mockuuidv4)
    }, [])

    let increment_q = getRoot<Me>(stateIncrement)

    if (!increment_q) {
      return (<div></div>)
    }
    let increment = increment_q

    let increment2_q = getRootState<Me>(stateIncrement)
    if (!increment2_q) {
      return (<div></div>)
    }
    let increment2 = increment2_q

    return (
      <div>
        <p>count: {increment.state.count}</p>
        <p>count: {increment2.count}</p>
        <p>{_GEN_UUID_STATE.iterate}</p>
        <button onClick={() => doIncrement.increment(increment.id)}></button>
        <button onClick={() => doIncrement.increment2(increment.id)}></button>
      </div>
    )
  }

  // do act
  act(() => {
    ReactDOM.render(<App />, container)
  })

  const ps = container.querySelectorAll('p')
  const p = ps[0]
  const p1 = ps[1]
  const p2 = ps[2]
  const buttons = container.querySelectorAll('button')
  const button = buttons[0]
  const button1 = buttons[1]

  expect(p.textContent).toBe('count: 0')
  expect(p1.textContent).toBe(p.textContent)
  expect(p2.textContent).toBe("2")

  act(() => {
    // @ts-ignore
    button.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  })

  expect(p.textContent).toBe('count: 1')
  expect(p1.textContent).toBe(p.textContent)

  act(() => {
    // @ts-ignore
    button1.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  })

  expect(p.textContent).toBe('count: 2')
  expect(p1.textContent).toBe(p.textContent)
})
