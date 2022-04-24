import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import { act } from 'react-dom/test-utils'
import { init as _init, remove, setData, createReducer, addChild, removeChild, addLink, removeLink, DispatchedAction, ClassState, Action, GetClassState, State, Node, Thunk, Dispatch } from '../src/index'
import { useReducer, getRoot, genUUID, getLinkIDs, getLinkID } from '../src/index'

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

interface A extends State {

}

interface B extends State {

}

type Props = {

}


it('link (init and remove)', () => {
  // setup app
  const aClass = 'test/a'
  const bClass = 'test/b'

  const initA = (myID: string, doMe: DispatchedAction<A>): Thunk<A> => {
    return (dispatch: Dispatch<A>, _: GetClassState<A>) => {
      dispatch(_init({ myID, myClass: aClass, doMe }))
    }
  }

  const initB = (myID: string, doMe: DispatchedAction<B>, aID: string, doA: DispatchedAction<A>): Thunk<B> => {
    let links: Node<A>[] = [
      { id: aID, do: doA, theClass: aClass },
    ]
    return (dispatch: Dispatch<B>, _: GetClassState<B>) => {
      dispatch(_init({ myID, myClass: bClass, doMe, links: links }))
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

  const App = (props: Props) => {
    const [stateA, doA] = useReducer(DoA)
    const [stateB, doB] = useReducer(DoB)

    console.log('doA:', doA)

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
    // @ts-ignore
    button.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  })

  expect(p.textContent).toBe('1')
  expect(span.textContent).toBe(label.textContent)
  expect(span.textContent).not.toBe('')

  // click button (2nd)
  act(() => {
    // @ts-ignore
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

  const initA = (myID: string, doMe: DispatchedAction<A>): Thunk<A> => {
    return (dispatch: Dispatch<A>, _: GetClassState<A>) => {
      dispatch(_init({ myID, myClass: aClass, doMe }))
    }
  }

  const initB = (myID: string, doMe: DispatchedAction<B>): Thunk<B> => {

    return (dispatch: Dispatch<B>, _: GetClassState<B>) => {
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

  const App = (props: Props) => {
    const [stateA, doA] = useReducer(DoA)
    const [stateB, doB] = useReducer(DoB)

    // init
    useEffect(() => {
      let aID = genUUID()
      let bID1 = genUUID()
      let bID2 = genUUID()
      doA.init(aID, doA)
      doB.init(bID1, doB)
      doB.init(bID2, doB)

      doB.addLink(bID1, { id: aID, do: doA, theClass: aClass })
      doB.addLink(bID2, { id: aID, do: doA, theClass: aClass })

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
    // @ts-ignore
    button.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  })

  expect(p.textContent).toBe('1')

  act(() => {
    // @ts-ignore
    button.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  })

  expect(p.textContent).toBe('0')
})

it('removeLink', () => {
  // setup app
  const aClass = 'test/a'
  const bClass = 'test/b'

  const initA = (myID: string, doMe: DispatchedAction<A>): Thunk<A> => {
    return (dispatch: Dispatch<A>, _: GetClassState<A>) => {
      dispatch(_init({ myID, myClass: aClass, doMe }))
    }
  }

  const initB = (myID: string, doMe: DispatchedAction<B>, aID: string, doA: DispatchedAction<A>): Thunk<B> => {

    return (dispatch: Dispatch<B>, _: GetClassState<B>) => {
      dispatch(_init({
        myID,
        myClass: bClass,
        doMe,
        links: [
          { id: aID, do: doA, theClass: aClass },
        ]
      }))
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

  const App = (props: Props) => {
    const [stateA, doA] = useReducer(DoA)
    const [stateB, doB] = useReducer(DoB)

    // init
    useEffect(() => {
      let aID = genUUID()
      let bID0 = genUUID()
      let bID1 = genUUID()
      doA.init(aID, doA)
      doB.init(bID0, doB, aID, doA)
      doB.init(bID1, doB, aID, doA)
    }, [])

    let a_q = getRoot(stateA)

    if (!a_q) {
      return (<div></div>)
    }
    let a = a_q

    let bIDs = getLinkIDs(a, bClass)
    let stateBIDs = Object.keys(stateB.nodes)

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
    // @ts-ignore
    button.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  })

  expect(p.textContent).toBe('1')
  expect(label.textContent).toBe('2')

  // click button (2nd)
  act(() => {
    // @ts-ignore
    button.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  })

  expect(p.textContent).toBe('0')
  expect(label.textContent).toBe('2')
})
