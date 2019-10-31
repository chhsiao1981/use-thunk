import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import { act } from 'react-dom/test-utils'
import {init as _init, remove, setData, createReducer, addChild, addLink, removeChild, removeLink} from '../src/index'
import {useActionDispatchReducer, getRoot, genUUID, getChildIDs, getChildID, getLinkIDs, getLinkID, Empty} from '../src/index'

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
    return (dispatch, getState) => {
      dispatch(_init({myClass, doMe, parentID, doParent, count: 0}))
    }
  }

  const increment = (myID) => {
    return (dispatch, getState) => {
      let me = getState()[myID]
      if(!me) {
          return
      }

      dispatch(setData(myID, {count: me.count + 1}))
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

    if(!increment) return (<div></div>)

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
    button.dispatchEvent(new MouseEvent('click', {bubbles: true}))
  })

  expect(p.textContent).toBe('count: 1')
})

it('children (init and remove)', () => {
  // setup app
  const parentClass = 'test/parent'
  const childClass = 'test/child'

  const initParent = (myID, doMe) => {
    return (dispatch, getState) => {
      dispatch(_init({myID, myClass: parentClass, doMe}))
    }
  }

  const initChild = (doMe, parentID, doParent) => {
    return (dispatch, getState) => {
      dispatch(_init({myClass: childClass, doMe, parentID, doParent}))
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
      doParent.init(parentID, doParent)
      doChild.init(doChild, parentID, doParent)
      doChild.init(doChild, parentID, doParent)
    }, [])

    let parent = getRoot(stateParent)

    if(!parent) return (<div></div>)

    let childIDs = getChildIDs(parent, childClass)

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

  act(() => {
    button.dispatchEvent(new MouseEvent('click', {bubbles: true}))
  })

  expect(p.textContent).toBe('1')

  act(() => {
    button.dispatchEvent(new MouseEvent('click', {bubbles: true}))
  })

  expect(p.textContent).toBe('0')
})

it('removeChild', () => {
  // setup app
  const parentClass = 'test/parent'
  const childClass = 'test/child'

  const initParent = (myID, doMe) => {
    return (dispatch, getState) => {
      dispatch(_init({myID, myClass: parentClass, doMe}))
    }
  }

  const initChild = (doMe, parentID, doParent) => {
    return (dispatch, getState) => {
      dispatch(_init({myClass: childClass, doMe, parentID, doParent}))
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
      doParent.init(parentID, doParent)
      doChild.init(doChild, parentID, doParent)
      doChild.init(doChild, parentID, doParent)
    }, [])

    let parent = getRoot(stateParent)

    if(!parent) return (<div></div>)

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

  act(() => {
    button.dispatchEvent(new MouseEvent('click', {bubbles: true}))
  })

  expect(p.textContent).toBe('1')
  expect(label.textContent).toBe('1')

  act(() => {
    button.dispatchEvent(new MouseEvent('click', {bubbles: true}))
  })

  expect(p.textContent).toBe('0')
  expect(label.textContent).toBe('0')
})

it('link (init and remove)', () => {
  // setup app
  const aClass = 'test/a'
  const bClass = 'test/b'

  const initA = (myID, doMe) => {
    return (dispatch, getState) => {
      dispatch(_init({myID, myClass: aClass, doMe}))
    }
  }

  const initB = (doMe, aID, doA) => {
    return (dispatch, getState) => {
      dispatch(_init({myClass: bClass, doMe, links: [{id: aID, myClass: aClass, do: doA}]}))
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
      doA.init(aID, doA)
      doB.init(doB, aID, doA)
      doB.init(doB, aID, doA)
    }, [])

    let a = getRoot(stateA)

    if(!a) return (<div></div>)

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
    button.dispatchEvent(new MouseEvent('click', {bubbles: true}))
  })

  expect(p.textContent).toBe('1')

  act(() => {
    button.dispatchEvent(new MouseEvent('click', {bubbles: true}))
  })

  expect(p.textContent).toBe('0')
})

it('addLink', () => {
  // setup app
  const aClass = 'test/a'
  const bClass = 'test/b'

  const initA = (myID, doMe) => {
    return (dispatch, getState) => {
      dispatch(_init({myID, myClass: aClass, doMe}))
    }
  }

  const initB = (myID, doMe) => {
    return (dispatch, getState) => {
      dispatch(_init({myID, myClass: bClass, doMe}))
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

      doB.addLink(bID1, {id: aID, do: doA, myClass: aClass})
      doB.addLink(bID2, {id: aID, do: doA, myClass: aClass})

    }, [])

    let a = getRoot(stateA)

    if(!a) return (<div></div>)

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
    button.dispatchEvent(new MouseEvent('click', {bubbles: true}))
  })

  expect(p.textContent).toBe('1')

  act(() => {
    button.dispatchEvent(new MouseEvent('click', {bubbles: true}))
  })

  expect(p.textContent).toBe('0')
})

it('removeLink', () => {
  // setup app
  const aClass = 'test/a'
  const bClass = 'test/b'

  const initA = (myID, doMe) => {
    return (dispatch, getState) => {
      dispatch(_init({myID, myClass: aClass, doMe}))
    }
  }

  const initB = (doMe, aID, doA) => {
    return (dispatch, getState) => {
      dispatch(_init({myClass: bClass, doMe, links: [{id: aID, myClass: aClass, do: doA}]}))
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
      doA.init(aID, doA)
      doB.init(doB, aID, doA)
      doB.init(doB, aID, doA)
    }, [])

    let a = getRoot(stateA)

    if(!a) return (<div></div>)

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

  act(() => {
    button.dispatchEvent(new MouseEvent('click', {bubbles: true}))
  })

  expect(p.textContent).toBe('1')
  expect(label.textContent).toBe('2')

  act(() => {
    button.dispatchEvent(new MouseEvent('click', {bubbles: true}))
  })

  expect(p.textContent).toBe('0')
  expect(label.textContent).toBe('2')
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
