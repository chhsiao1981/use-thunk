import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import { act } from 'react-dom/test-utils'
import { init as _init, remove, setData, createReducer, addChild, addLink, removeChild, removeLink } from '../src/index'
import { useActionDispatchReducer, getRoot, genUUID, getLinkIDs, getLinkID } from '../src/index'

let container

beforeEach(() => {
  container = document.createElement('div')
  document.body.appendChild(container)
})

afterEach(() => {
  document.body.removeChild(container)
  container = null;
})


it('link (init and remove)', () => {
  // setup app
  const aClass = 'test/a'
  const bClass = 'test/b'

  const initA = (myID, doMe) => {
    return (dispatch, _) => {
      dispatch(_init({ myID, myClass: aClass, doMe }))
    }
  }

  const initB = (myID, doMe, aID, doA) => {
    return (dispatch, getState) => {
      dispatch(_init({ myID, myClass: bClass, doMe, links: [{ id: aID, do: doA }] }))
    }
  }

  let DoA = {
    init: initA,
    remove,
    setData,
    addChild,
    addLink,
    removeChild,
    removeLink,
    default: createReducer(),
  }

  let DoB = {
    init: initB,
    remove,
    setData,
    addChild,
    addLink,
    removeChild,
    removeLink,
    default: createReducer(),
  }

  const App = (props) => {
    const [stateA, doA] = useActionDispatchReducer(DoA)
    const [stateB, doB] = useActionDispatchReducer(DoB)

    // init
    useEffect(() => {
      let aID = genUUID()
      let bID0 = genUUID()
      let bID1 = genUUID()
      doA.init(aID, doA)
      doB.init(bID0, doB, aID, doA)
      doB.init(bID1, doB, aID, doA)
    }, [])

    let a = getRoot(stateA)
    console.log('link (init and remove): a:', a)
    if (!a) return (<div></div>)

    let bIDs = getLinkIDs(a, bClass)
    let bID = getLinkID(a, bClass)

    return (
      <div>
        <p>{bIDs.length}</p>
        <span>{bID}</span>
        <label>{bIDs[0]}</label>
        <button onClick={() => doB.remove(bIDs[0])}></button>
      </div>
    )
  }

  // do act
  act(() => {
    ReactDOM.render(<App />, container)
  })

  const p = container.querySelector('p')
  const button = container.querySelector('button')
  const span = container.querySelector('span')
  const label = container.querySelector('label')

  expect(p.textContent).toBe('2')
  expect(span.textContent).toBe(label.textContent)
  expect(span.textContent).not.toBe('')

  // click button (1st)
  act(() => {
    button.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  })

  expect(p.textContent).toBe('1')
  expect(span.textContent).toBe(label.textContent)
  expect(span.textContent).not.toBe('')

  // click button (2nd)
  act(() => {
    button.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  })

  expect(p.textContent).toBe('0')
  expect(span.textContent).toBe('')
  expect(label.textContent).toBe('')
})

it('addLink', () => {
  // setup app
  const aClass = 'test/a'
  const bClass = 'test/b'

  const initA = (myID, doMe) => {
    return (dispatch, getState) => {
      dispatch(_init({ myID, myClass: aClass, doMe }))
    }
  }

  const initB = (myID, doMe) => {
    return (dispatch, getState) => {
      dispatch(_init({ myID, myClass: bClass, doMe }))
    }
  }

  let DoA = {
    init: initA,
    remove,
    setData,
    addChild,
    addLink,
    removeChild,
    removeLink,
    default: createReducer(),
  }

  let DoB = {
    init: initB,
    remove,
    setData,
    addChild,
    addLink,
    removeChild,
    removeLink,
    default: createReducer(),
  }

  const App = (props) => {
    const [stateA, doA] = useActionDispatchReducer(DoA)
    const [stateB, doB] = useActionDispatchReducer(DoB)

    // init
    useEffect(() => {
      let aID = genUUID()
      let bID1 = genUUID()
      let bID2 = genUUID()
      doA.init(aID, doA)
      doB.init(bID1, doB)
      doB.init(bID2, doB)

      doB.addLink(bID1, { id: aID, do: doA, myClass: aClass })
      doB.addLink(bID2, { id: aID, do: doA, myClass: aClass })

    }, [])

    let a = getRoot(stateA)

    if (!a) return (<div></div>)

    let bIDs = getLinkIDs(a, bClass)

    return (
      <div>
        <p>{bIDs.length}</p>
        <button onClick={() => doB.remove(bIDs[0])}></button>
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

  act(() => {
    button.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  })

  expect(p.textContent).toBe('1')

  act(() => {
    button.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  })

  expect(p.textContent).toBe('0')
})

it('removeLink', () => {
  // setup app
  const aClass = 'test/a'
  const bClass = 'test/b'

  const initA = (myID, doMe) => {
    return (dispatch, getState) => {
      dispatch(_init({ myID, myClass: aClass, doMe }))
    }
  }

  const initB = (myID, doMe, aID, doA) => {
    return (dispatch, getState) => {
      dispatch(_init({ myID, myClass: bClass, doMe, links: [{ id: aID, myClass: aClass, do: doA }] }))
    }
  }

  let DoA = {
    init: initA,
    remove,
    setData,
    addChild,
    addLink,
    removeChild,
    removeLink,
    default: createReducer(),
  }

  let DoB = {
    init: initB,
    remove,
    setData,
    addChild,
    addLink,
    removeChild,
    removeLink,
    default: createReducer(),
  }

  const App = (props) => {
    const [stateA, doA] = useActionDispatchReducer(DoA)
    const [stateB, doB] = useActionDispatchReducer(DoB)

    // init
    useEffect(() => {
      let aID = genUUID()
      let bID0 = genUUID()
      let bID1 = genUUID()
      doA.init(aID, doA)
      doB.init(bID0, doB, aID, doA)
      doB.init(bID1, doB, aID, doA)
    }, [])

    let a = getRoot(stateA)

    if (!a) return (<div></div>)

    let bIDs = getLinkIDs(a, bClass)
    let stateBIDs = stateB.ids

    return (
      <div>
        <p>{bIDs.length}</p>
        <label>{stateBIDs.length}</label>
        <button onClick={() => doA.removeLink(a.id, bIDs[0], bClass, false)}></button>
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
  expect(label.textContent).toBe('2')

  // click button (2nd)
  act(() => {
    button.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  })

  expect(p.textContent).toBe('0')
  expect(label.textContent).toBe('2')
})
