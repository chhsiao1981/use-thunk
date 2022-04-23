import React, { useEffect, Dispatch } from 'react'
import ReactDOM from 'react-dom'
import { act } from 'react-dom/test-utils'
import { init as _init, setData, createReducer, DispatchedAction, State, GetState, Action, UseReducerParams } from '../src/index'
import { useReducer, getRoot } from '../src/index'

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

  const init = (doMe: DispatchedAction<Me>, parentID: string, doParent: DispatchedAction<Parent>) => {
    return (dispatch: Dispatch<Action<Me>>, _: GetState<Me>) => {
      dispatch(_init({ myClass, doMe, parentID, doParent, state: { count: 0 } }))
    }
  }

  const increment = (myID: string) => {
    return (dispatch: Dispatch<Action<Me>>, getState: GetState<Me>) => {
      let me = getState().nodes[myID]
      if (!me) {
        return
      }

      dispatch(setData(myID, { count: me.state.count + 1 }))
    }
  }

  let DoIncrement: UseReducerParams<Me> = {
    init,
    increment,
    default: createReducer(),
  }

  const App = (props: Props) => {
    const [stateIncrement, doIncrement] = useReducer<UseReducerParams<Me>, Me>(DoIncrement)

    // init
    useEffect(() => {
      doIncrement.init(doIncrement)
    }, [])

    let increment_q = getRoot<Me>(stateIncrement)

    if (!increment_q) {
      return (<div></div>)
    }
    let increment = increment_q

    return (
      <div>
        <p>count: {increment.state.count}</p>
        <button onClick={() => doIncrement.increment(increment.id)}></button>
      </div>
    )
  }

  // do act
  act(() => {
    ReactDOM.render(<App />, container)
  })

  const p = container.querySelector('p')
  const button = container.querySelector('button')

  expect(p.textContent).toBe('count: 0')

  act(() => {
    // @ts-ignore
    button.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  })

  expect(p.textContent).toBe('count: 1')
})
