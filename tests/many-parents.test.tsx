import { act, useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { afterEach, beforeEach, expect, it } from 'vitest'
import {
  init as _init,
  addChild,
  addLink,
  createReducer,
  type DispatchFuncMap,
  genUUID,
  getChildID,
  getChildIDs,
  getRootNode,
  type ModuleToFunc,
  remove,
  removeChild,
  removeLink,
  type State,
  setData,
  type Thunk,
  useReducer,
} from '../src/index'

let container: HTMLDivElement | null
let root: ReactDOM.Root | null
beforeEach(() => {
  // @ts-ignore
  container = document.createElement('div')
  // @ts-ignore
  document.body.appendChild(container)

  root = ReactDOM.createRoot(container)

  // @ts-ignore
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

interface Parent extends State {
  theDate?: Date
  // biome-ignore lint/suspicious/noExplicitAny: any in test.
  temp?: any
}

interface Child extends State {}

// biome-ignore lint/complexity/noBannedTypes: {} in test.
type Props = {}

it('many-parents (init and remove)', () => {
  // setup app
  const parentClass = 'test/parent'
  const childClass = 'test/child'

  const initParent = (myID: string): Thunk<Parent> => {
    const theDate = new Date()
    return async (dispatch, _) => {
      dispatch(_init<Parent>({ myID, state: { theDate } }))
    }
  }

  const DoParent = {
    init: initParent,
    addChild,
    addLink,
    removeChild,
    removeLink,
    myClass: parentClass,
    default: createReducer<Parent>(),
  }

  type TDoParent = ModuleToFunc<typeof DoParent>

  const initChild = (parentID: string, doParent: DispatchFuncMap<Parent, TDoParent>): Thunk<Child> => {
    return async (dispatch, _) => {
      dispatch(_init({ parentID, doParent, state: {} }))
    }
  }

  const DoChild = {
    init: initChild,
    addChild: addChild,
    addLink: addLink,
    removeChild: removeChild,
    removeLink: removeLink,
    remove: remove,
    setData: setData,
    myClass: childClass,
    default: createReducer<Child>(),
  }

  type TDoChild = ModuleToFunc<typeof DoChild>

  let globalCount = 0

  const App = (props: Props) => {
    const [stateParent, doParent] = useReducer<Parent, TDoParent>(DoParent)
    const [stateParent2, doParent2] = useReducer<Parent, TDoParent>(DoParent)
    const [stateChild, doChild] = useReducer<Child, TDoChild>(DoChild)
    const [parentID, setParentID] = useState('')
    const [parentID2, setParentID2] = useState('')

    // init
    useEffect(() => {
      const parentID = genUUID()
      const parentID2 = genUUID()

      console.log('many-parents (init and remove): parentID:', parentID)
      doParent.init(parentID)
      doParent2.init(parentID2)

      doChild.init(parentID, doParent)
      doChild.init(parentID, doParent)
      setParentID(parentID)
      setParentID2(parentID2)

      globalCount++
    }, [doParent.init, doParent2.init, doChild.init])

    const parent = getRootNode(stateParent)
    const parent2 = getRootNode(stateParent2)

    console.log('many-parents (init and remove): parent:', parent)
    console.log('many-parents (init and remove): parent2:', parent2)

    if (!parent) {
      return <div />
    }
    if (!parent2) {
      return <div />
    }

    const childIDs = getChildIDs(parent, childClass)
    const childID = getChildID(parent, childClass)

    const parentNodeKeys = Object.keys(stateParent.nodes)
    const parent2NodeKeys = Object.keys(stateParent2.nodes)
    const isSameParent = parentNodeKeys.every((each) => {
      const ret = parent2NodeKeys.findIndex((each2) => each2 === each)
      return ret !== -1
    })
    const isSameParentStr = isSameParent ? 'true' : 'false'

    console.log('many-parents (init and remove): childIDs:', childIDs)

    return (
      <div>
        <p>{childIDs.length}</p>
        <span>{childID}</span>
        <span>{childIDs[0]}</span>

        <span>{parentID}</span>
        <span>{parent.id}</span>

        <span>{parentID2}</span>
        <span>{parent2.id}</span>

        <span>{isSameParentStr}</span>
        <button type='button' onClick={() => doChild.remove(childIDs[0])} />
      </div>
    )
  }

  const App2 = () => {
    return (
      <>
        <App />
        <App />
      </>
    )
  }

  // do act
  act(() => {
    root?.render(<App2 />)
  })
  if (container === null) {
    return
  }

  const p = container.querySelector('p')
  const button = container.querySelector('button')
  const spans = container.querySelectorAll('span')

  console.info('spans:', spans.length)

  // child
  const span0 = spans[0]
  const span1 = spans[1]

  // parent1-1
  const span2 = spans[2]
  const span3 = spans[3]

  // parent1-2
  const span4 = spans[4]
  const span5 = spans[5]

  // is-same-parent-1
  const span6 = spans[6]

  // child2
  const span7 = spans[7]
  const span8 = spans[8]

  // parent2-1
  const span9 = spans[9]
  const span10 = spans[10]

  // parent2-2
  const span11 = spans[11]
  const span12 = spans[12]

  // is-same-parent-2
  const span13 = spans[13]

  expect(globalCount).toBe(2)

  expect(p).not.toBeNull()
  if (p === null) {
    return
  }
  expect(span0).not.toBeNull()
  if (span0 === null) {
    return
  }
  expect(button).not.toBeNull()
  if (button === null) {
    return
  }

  expect(spans.length).toBe(14)

  expect(span4.textContent).toBe(span5.textContent)
  expect(span2.textContent).toBe(span3.textContent)
  expect(span2.textContent).not.toBe(span4.textContent)
  expect(p.textContent).toBe('2')
  expect(span0.textContent).toBe(span1.textContent)

  console.info('span6.textContent:', span6.textContent)
  expect(span6.textContent).toBe('false')

  expect(span11.textContent).toBe(span12.textContent)
  expect(span9.textContent).toBe(span10.textContent)

  expect(span9.textContent).not.toBe(span11.textContent)
  expect(span9.textContent).not.toBe(span4.textContent)
  expect(span9.textContent).not.toBe(span2.textContent)

  expect(span11.textContent).not.toBe(span4.textContent)
  expect(span11.textContent).not.toBe(span2.textContent)

  expect(span13.textContent).toBe('false')

  console.log('many-parents: to click button (1st)')
  act(() => {
    button.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  })

  expect(p.textContent).toBe('1')

  console.log('many-parents: to click button (2nd)')
  act(() => {
    button.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  })

  expect(p.textContent).toBe('0')
})

it('many-parents-no-dep (init and remove)', () => {
  // setup app
  const parentClass = 'test/parent'
  const childClass = 'test/child'

  const initParent = (myID: string): Thunk<Parent> => {
    const theDate = new Date()
    return async (dispatch, _) => {
      dispatch(_init<Parent>({ myID, state: { theDate } }))
    }
  }

  const DoParent = {
    init: initParent,
    addChild,
    addLink,
    removeChild,
    removeLink,
    myClass: parentClass,
    default: createReducer<Parent>(),
  }

  type TDoParent = ModuleToFunc<typeof DoParent>

  const initChild = (parentID: string, doParent: DispatchFuncMap<Parent, TDoParent>): Thunk<Child> => {
    return async (dispatch, _) => {
      dispatch(_init({ parentID, doParent, state: {} }))
    }
  }

  const DoChild = {
    init: initChild,
    addChild: addChild,
    addLink: addLink,
    removeChild: removeChild,
    removeLink: removeLink,
    remove: remove,
    setData: setData,
    myClass: childClass,
    default: createReducer<Child>(),
  }

  type TDoChild = ModuleToFunc<typeof DoChild>

  let globalCount = 0

  const App = (props: Props) => {
    const [stateParent, doParent] = useReducer<Parent, TDoParent>(DoParent)
    const [stateParent2, doParent2] = useReducer<Parent, TDoParent>(DoParent)
    const [stateChild, doChild] = useReducer<Child, TDoChild>(DoChild)
    const [parentID, setParentID] = useState('')
    const [parentID2, setParentID2] = useState('')

    // init
    useEffect(() => {
      const parentID = genUUID()
      const parentID2 = genUUID()

      console.log('many-parents-no-dep (init and remove): parentID:', parentID)
      doParent.init(parentID)
      doParent2.init(parentID2)

      doChild.init(parentID, doParent)
      doChild.init(parentID, doParent)
      setParentID(parentID)
      setParentID2(parentID2)

      globalCount++
    }, [])

    const parent = getRootNode(stateParent)
    const parent2 = getRootNode(stateParent2)

    console.log('many-parents-no-dep (init and remove): parent:', parent)
    console.log('many-parents-no-dep (init and remove): parent2:', parent2)

    if (!parent) {
      return <div />
    }
    if (!parent2) {
      return <div />
    }

    const childIDs = getChildIDs(parent, childClass)
    const childID = getChildID(parent, childClass)

    const parentNodeKeys = Object.keys(stateParent.nodes)
    const parent2NodeKeys = Object.keys(stateParent2.nodes)
    const isSameParent = parentNodeKeys.every((each) => {
      const ret = parent2NodeKeys.findIndex((each2) => each2 === each)
      return ret !== -1
    })
    const isSameParentStr = isSameParent ? 'true' : 'false'

    console.log('many-parents-no-dep (init and remove): childIDs:', childIDs)

    return (
      <div>
        <p>{childIDs.length}</p>
        <span>{childID}</span>
        <span>{childIDs[0]}</span>

        <span>{parentID}</span>
        <span>{parent.id}</span>

        <span>{parentID2}</span>
        <span>{parent2.id}</span>

        <span>{isSameParentStr}</span>
        <button type='button' onClick={() => doChild.remove(childIDs[0])} />
      </div>
    )
  }

  const App2 = () => {
    return (
      <>
        <App />
        <App />
      </>
    )
  }

  // do act
  act(() => {
    root?.render(<App2 />)
  })
  if (container === null) {
    return
  }

  const p = container.querySelector('p')
  const button = container.querySelector('button')
  const spans = container.querySelectorAll('span')

  console.info('spans:', spans.length)

  // child
  const span0 = spans[0]
  const span1 = spans[1]

  // parent1-1
  const span2 = spans[2]
  const span3 = spans[3]

  // parent1-2
  const span4 = spans[4]
  const span5 = spans[5]

  // is-same-parent-1
  const span6 = spans[6]

  // child2
  const span7 = spans[7]
  const span8 = spans[8]

  // parent2-1
  const span9 = spans[9]
  const span10 = spans[10]

  // parent2-2
  const span11 = spans[11]
  const span12 = spans[12]

  // is-same-parent-2
  const span13 = spans[13]

  expect(globalCount).toBe(2)

  expect(p).not.toBeNull()
  if (p === null) {
    return
  }
  expect(span0).not.toBeNull()
  if (span0 === null) {
    return
  }
  expect(button).not.toBeNull()
  if (button === null) {
    return
  }

  expect(spans.length).toBe(14)

  expect(span4.textContent).toBe(span5.textContent)
  expect(span2.textContent).toBe(span3.textContent)
  expect(span2.textContent).not.toBe(span4.textContent)
  expect(p.textContent).toBe('2')
  expect(span0.textContent).toBe(span1.textContent)

  console.info('span6.textContent:', span6.textContent)
  expect(span6.textContent).toBe('false')

  expect(span11.textContent).toBe(span12.textContent)
  expect(span9.textContent).toBe(span10.textContent)

  expect(span9.textContent).not.toBe(span11.textContent)
  expect(span9.textContent).not.toBe(span4.textContent)
  expect(span9.textContent).not.toBe(span2.textContent)

  expect(span11.textContent).not.toBe(span4.textContent)
  expect(span11.textContent).not.toBe(span2.textContent)

  expect(span13.textContent).toBe('false')

  console.log('many-parents-no-dep: to click button (1st)')
  act(() => {
    button.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  })

  expect(p.textContent).toBe('1')

  console.log('many-parents-no-dep: to click button (2nd)')
  act(() => {
    button.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  })

  expect(p.textContent).toBe('0')
})
