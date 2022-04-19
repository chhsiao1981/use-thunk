import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import { act } from 'react-dom/test-utils'
import { init as _init, remove, setData, createReducer, addChild, removeChild, addLink, removeLink } from '../src/index'
import { useActionDispatchReducer, getRoot, genUUID, getChildIDs, getChildID, Empty } from '../src/index'

let container

beforeEach(() => {
  container = document.createElement('div')
  document.body.appendChild(container)
})

afterEach(() => {
  document.body.removeChild(container)
  container = null;
})

it('children (init and remove)', () => {
  // setup app
  const parentClass = 'test/parent'
  const childClass = 'test/child'

  const initParent = (myID, doMe) => {
    return (dispatch, _) => {
      dispatch(_init({ myID, myClass: parentClass, doMe }))
    }
  }

  const initChild = (myID, doMe, parentID, doParent) => {
    return (dispatch, _) => {
      dispatch(_init({ myID, myClass: childClass, doMe, parentID, doParent }))
    }
  }

  let DoParent = {
    init: initParent,
    addChild,
    addLink,
    removeChild,
    removeLink,
    default: createReducer(),
  }

  let DoChild = {
    init: initChild,
    addChild,
    addLink,
    removeChild,
    removeLink,
    remove,
    setData,
    default: createReducer(),
  }

  const App = (props) => {
    const [stateParent, doParent] = useActionDispatchReducer(DoParent)
    const [stateChild, doChild] = useActionDispatchReducer(DoChild)

    // init
    useEffect(() => {
      let parentID = genUUID()
      let childID0 = genUUID()
      let childID1 = genUUID()
      doParent.init(parentID, doParent)
      doChild.init(childID0, doChild, parentID, doParent)
      doChild.init(childID1, doChild, parentID, doParent)
    }, [])

    let parent = getRoot(stateParent)

    console.log('children (init and remove): parent:', parent)

    if (!parent) {
      return (<div />)
    }

    let childIDs = getChildIDs(parent, childClass)

    console.log('children (init and remove): childIDs:', childIDs)

    return (
      <div>
        <p>{childIDs.length}</p>
        <button onClick={() => doChild.remove(childIDs[0])}></button>
      </div>
    )
  }

  // do act
  act(() => {
    ReactDOM.render(<App />, container)
  })

  const p = container.querySelector('p')
  const button = container.querySelector('button')

  expect(p.textContent).toBe('2')

  console.log('to click button (1st)')
  act(() => {
    button.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  })

  expect(p.textContent).toBe('1')

  console.log('to click button (2nd)')
  act(() => {
    button.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  })

  expect(p.textContent).toBe('0')
})

it('removeChild', () => {
  // setup app
  const parentClass = 'test/parent'
  const childClass = 'test/child'

  const initParent = (myID, doMe) => {
    return (dispatch, _) => {
      dispatch(_init({ myID, myClass: parentClass, doMe }))
    }
  }

  const initChild = (myID, doMe, parentID, doParent) => {
    return (dispatch, _) => {
      dispatch(_init({ myID, myClass: childClass, doMe, parentID, doParent }))
    }
  }

  let DoParent = {
    init: initParent,
    addChild,
    addLink,
    removeChild,
    removeLink,
    default: createReducer(),
  }

  let DoChild = {
    init: initChild,
    addChild,
    addLink,
    removeChild,
    removeLink,
    remove,
    setData,
    default: createReducer(),
  }

  const App = (props) => {
    const [stateParent, doParent] = useActionDispatchReducer(DoParent)
    const [stateChild, doChild] = useActionDispatchReducer(DoChild)

    // init
    useEffect(() => {
      let parentID = genUUID()
      let childID0 = genUUID()
      let childID1 = genUUID()
      doParent.init(parentID, doParent)
      doChild.init(childID0, doChild, parentID, doParent)
      doChild.init(childID1, doChild, parentID, doParent)
    }, [])

    let parent = getRoot(stateParent)

    if (!parent) {
      return (<div />)
    }

    let childIDs = getChildIDs(parent, childClass)
    let stateChildIDs = stateChild.ids

    return (
      <div>
        <p>{childIDs.length}</p>
        <label>{stateChildIDs.length}</label>
        <button onClick={() => doParent.removeChild(parent.id, childIDs[0], childClass, false)}></button>
      </div>
    )
  }

  // do act
  act(() => {
    ReactDOM.render(<App />, container)
  })

  const p = container.querySelector('p')
  const label = container.querySelector('label')
  const button = container.querySelector('button')

  expect(p.textContent).toBe('2')
  expect(label.textContent).toBe('2')

  // click button (1st)
  act(() => {
    button.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  })

  expect(p.textContent).toBe('1')
  expect(label.textContent).toBe('1')

  // click button (2nd)
  act(() => {
    button.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  })

  expect(p.textContent).toBe('0')
  expect(label.textContent).toBe('0')
})

