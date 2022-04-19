import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import { act } from 'react-dom/test-utils'
import { init as _init, remove, setData, createReducer, addChild, addLink, removeChild, removeLink } from '../src/index'
import { useActionDispatchReducer, getRoot, genUUID, getChildIDs, getChildID, getLinkIDs, getLinkID, Empty } from '../src/index'

let container

beforeEach(() => {
  container = document.createElement('div')
  document.body.appendChild(container)
})

afterEach(() => {
  document.body.removeChild(container)
  container = null;
})

it('example in README.md', () => {
  // setup app
  const myClass = 'test/test'

  const init = (doMe, parentID, doParent) => {
    return (dispatch, _) => {
      dispatch(_init({ myClass, doMe, parentID, doParent, count: 0 }))
    }
  }

  const increment = (myID) => {
    return (dispatch, getState) => {
      let me = getState()[myID]
      if (!me) {
        return
      }

      dispatch(setData(myID, { count: me.count + 1 }))
    }
  }

  let DoIncrement = {
    init,
    increment,
    default: createReducer(),
  }

  const App = (props) => {
    const [stateIncrement, doIncrement] = useActionDispatchReducer(DoIncrement)

    // init
    useEffect(() => {
      doIncrement.init(doIncrement)
    }, [])

    let increment = getRoot(stateIncrement)

    if (!increment) return (<div></div>)

    return (
      <div>
        <p>count: {increment.count}</p>
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
    button.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  })

  expect(p.textContent).toBe('count: 1')
})

