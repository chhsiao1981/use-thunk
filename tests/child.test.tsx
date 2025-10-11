import { act, useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { afterEach, beforeEach, expect, test } from 'vitest'
import {
  init as _init,
  addChild,
  addLink,
  type DispatchFuncMap,
  genUUID,
  getChildID,
  getChildIDs,
  getNode,
  remove,
  removeChild,
  removeLink,
  type State,
  setData,
  type Thunk,
  type ThunkModuleToFunc,
  useThunk,
} from '../src/index'

let container: HTMLDivElement | null
let root: ReactDOM.Root | null
beforeEach(() => {
  container = document.createElement('div')
  document.body.appendChild(container)

  root = ReactDOM.createRoot(container)

  // @ts-expect-error globalThis
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

interface Parent extends State {
  theDate?: Date
  // biome-ignore lint/suspicious/noExplicitAny: any in test.
  temp?: any
}

interface Child extends State {}

// biome-ignore lint/complexity/noBannedTypes: {} in test.
type Props = {}

test('children (init and remove)', {}, () => {
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
  }

  type TDoParent = ThunkModuleToFunc<typeof DoParent>

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
  }

  type TDoChild = ThunkModuleToFunc<typeof DoChild>

  const App = (props: Props) => {
    const [stateParent, doParent] = useThunk<Parent, TDoParent>(DoParent)
    const [stateChild, doChild] = useThunk<Child, TDoChild>(DoChild)
    const [parentID, setParentID] = useState('')

    // init
    useEffect(() => {
      const parentID = genUUID()
      console.log('children (init and remove): parentID:', parentID)
      doParent.init(parentID)
      doChild.init(parentID, doParent)
      doChild.init(parentID, doParent)
      setParentID(parentID)
    }, [])

    const parent = getNode(stateParent)

    console.log('children (init and remove): parent:', parent)

    if (!parent) {
      return <div />
    }

    const childIDs = getChildIDs(parent, childClass)
    const childID = getChildID(parent, childClass)

    console.log('children (init and remove): childIDs:', childIDs)

    return (
      <div>
        <p>{childIDs.length}</p>
        <span>{childID}</span>
        {/* biome-ignore lint/a11y/noLabelWithoutControl: test */}
        <label>{childIDs[0]}</label>
        {/* biome-ignore lint/a11y/noLabelWithoutControl: test */}
        <label>{parentID}</label>
        {/* biome-ignore lint/a11y/noLabelWithoutControl: test */}
        <label>{parent.id}</label>
        <button type='button' onClick={() => doChild.remove(childIDs[0])} />
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

  const p = container.querySelector('p')
  const button = container.querySelector('button')
  const labels = container.querySelectorAll('label')
  const label = labels[0]
  const label1 = labels[1]
  const label2 = labels[2]
  const span = container.querySelector('span')
  expect(p).not.toBeNull()
  if (p === null) {
    return
  }
  expect(span).not.toBeNull()
  if (span === null) {
    return
  }
  expect(button).not.toBeNull()
  if (button === null) {
    return
  }

  expect(label1.textContent).toBe(label2.textContent)
  expect(p.textContent).toBe('2')
  expect(label.textContent).toBe(span.textContent)

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

test('removeChild', {}, () => {
  // setup app
  const parentClass = 'test/parent'
  const childClass = 'test/child'

  const initParent = (myID: string): Thunk<Parent> => {
    return async (dispatch, _) => {
      dispatch(_init({ myID, state: {} }))
    }
  }
  const DoParent = {
    init: initParent,
    addChild,
    addLink,
    removeChild,
    removeLink,
    myClass: parentClass,
  }

  type TDoParent = ThunkModuleToFunc<typeof DoParent>

  const initChild = (parentID: string, doParent: DispatchFuncMap<Parent, TDoParent>): Thunk<Child> => {
    return async (dispatch, _) => {
      dispatch(_init({ parentID, doParent, state: {} }))
    }
  }

  const DoChild = {
    init: initChild,
    addChild,
    addLink,
    removeChild,
    removeLink,
    remove,
    setData,
    myClass: childClass,
  }

  type TDoChild = ThunkModuleToFunc<typeof DoChild>

  const App = (props: Props) => {
    const [stateParent, doParent] = useThunk<Parent, TDoParent>(DoParent)
    const [stateChild, doChild] = useThunk<Child, TDoChild>(DoChild)

    // init
    useEffect(() => {
      const parentID = genUUID()
      doParent.init(parentID)
      doChild.init(parentID, doParent)
      doChild.init(parentID, doParent)
    }, [])

    const parent_q = getNode(stateParent)

    if (!parent_q) {
      return <div />
    }
    const parent = parent_q

    const childIDs = getChildIDs(parent, childClass)
    const stateChildIDs = Object.keys(stateChild.nodes)

    console.log('childIDs:', childIDs, 'stateChildIDs:', stateChildIDs)

    return (
      <div>
        <p>{childIDs.length}</p>
        {/* biome-ignore lint/a11y/noLabelWithoutControl: test stateChilds */}
        <label>{stateChildIDs.length}</label>
        <button type='button' onClick={() => doParent.removeChild(parent.id, childIDs[0], childClass, false)} />
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

  const p = container.querySelector('p')
  const label = container.querySelector('label')
  const button = container.querySelector('button')
  expect(p).not.toBeNull()
  if (p === null) {
    return
  }
  expect(label).not.toBeNull()
  if (label === null) {
    return
  }
  expect(button).not.toBeNull()
  if (button === null) {
    return
  }
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

test('removeParent', {}, () => {
  // setup app
  const parentClass = 'test/parent'
  const childClass = 'test/child'

  const initParent = (myID: string): Thunk<Parent> => {
    return async (dispatch, _) => {
      dispatch(_init({ myID, state: {} }))
    }
  }

  const DoParent = {
    init: initParent,
    addChild,
    addLink,
    removeChild,
    removeLink,
    remove,
    setData,
    myClass: parentClass,
  }

  type TDoParent = ThunkModuleToFunc<typeof DoParent>

  const initChild = (parentID: string, doParent: DispatchFuncMap<Parent, TDoParent>): Thunk<Child> => {
    return async (dispatch, _) => {
      dispatch(_init({ parentID, doParent, state: {} }))
    }
  }

  const DoChild = {
    init: initChild,
    addChild,
    addLink,
    removeChild,
    removeLink,
    remove,
    setData,
    myClass: childClass,
  }

  type TDoChild = ThunkModuleToFunc<typeof DoChild>

  const App = (props: Props) => {
    const [stateParent, doParent] = useThunk<Parent, TDoParent>(DoParent)
    const [stateChild, doChild] = useThunk<Child, TDoChild>(DoChild)
    const [stateParentID, setParentID] = useState('')

    // init
    useEffect(() => {
      const parentID = genUUID()
      doParent.init(parentID)
      doChild.init(parentID, doParent)
      doChild.init(parentID, doParent)
      setParentID(parentID)
    }, [])

    console.log('removeParent: to getNode: parentID:', stateParentID)
    const parent = getNode(stateParent)

    const childIDs = parent ? getChildIDs(parent, childClass) : []
    const stateChildIDs = stateChild?.nodes ? Object.keys(stateChild.nodes) : '(undefined)'

    console.log('childIDs:', childIDs, 'stateChildIDs:', stateChildIDs)

    return (
      <div>
        <p>{childIDs ? childIDs.length : ''}</p>
        {/* biome-ignore lint/a11y/noLabelWithoutControl: in test. */}
        <label>{stateChildIDs.length}</label>
        {/* biome-ignore lint/a11y/noLabelWithoutControl: in test. */}
        <label>{stateChildIDs ? stateChildIDs[0] : ''}</label>
        <span>{stateParentID}</span>
        <button type='button' onClick={() => (parent ? doParent.remove(parent.id) : null)} />
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

  const p = container.querySelector('p')
  const labels = container.querySelectorAll('label')
  const label = labels[0]
  const label1 = labels[1]
  const button = container.querySelector('button')
  expect(p).not.toBeNull()
  if (p === null) {
    return
  }
  expect(label).not.toBeNull()
  if (label === null) {
    return
  }
  expect(button).not.toBeNull()
  if (button === null) {
    return
  }

  expect(p.textContent).toBe('2')
  expect(label.textContent).toBe('2')

  // click button (1st)
  act(() => {
    button.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  })

  expect(p.textContent).toBe('0')
  expect(label.textContent).toBe('0')
  expect(label1.textContent).toBe('')
})

test('removeChild', {}, () => {
  // setup app
  const parentClass = 'test/parent'
  const childClass = 'test/child'

  const initParent = (myID: string): Thunk<Parent> => {
    return async (dispatch, _) => {
      dispatch(_init({ myID, state: {} }))
    }
  }

  const DoParent = {
    init: initParent,
    addChild,
    addLink,
    removeChild,
    removeLink,
    myClass: parentClass,
  }

  type TDoParent = ThunkModuleToFunc<typeof DoParent>

  const initChild = (parentID: string, doParent: DispatchFuncMap<Parent, TDoParent>): Thunk<Child> => {
    return async (dispatch, _) => {
      dispatch(_init({ parentID, doParent, state: {} }))
    }
  }

  const DoChild = {
    init: initChild,
    addChild,
    addLink,
    removeChild,
    removeLink,
    remove,
    setData,
    myClass: childClass,
  }

  type TDoChild = ThunkModuleToFunc<typeof DoChild>

  const App = (props: Props) => {
    const [stateParent, doParent] = useThunk<Parent, TDoParent>(DoParent)
    const [stateChild, doChild] = useThunk<Child, TDoChild>(DoChild)

    // init
    useEffect(() => {
      const parentID = genUUID()
      doParent.init(parentID)
      doChild.init(parentID, doParent)
      doChild.init(parentID, doParent)
    }, [])

    const parent_q = getNode(stateParent)

    if (!parent_q) {
      return <div />
    }
    const parent = parent_q

    const childIDs = getChildIDs(parent, childClass)
    const stateChildIDs = Object.keys(stateChild.nodes)

    console.log('childIDs:', childIDs, 'stateChildIDs:', stateChildIDs)

    return (
      <div>
        <p>{childIDs.length}</p>
        {/* biome-ignore lint/a11y/noLabelWithoutControl: in test. */}
        <label>{stateChildIDs.length}</label>
        <button type='button' onClick={() => doParent.removeChild(parent.id, childIDs[0], childClass, false)} />
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

  const p = container.querySelector('p')
  const label = container.querySelector('label')
  const button = container.querySelector('button')
  expect(p).not.toBeNull()
  if (p === null) {
    return
  }
  expect(label).not.toBeNull()
  if (label === null) {
    return
  }

  expect(p.textContent).toBe('2')
  expect(label.textContent).toBe('2')

  // click button (1st)
  act(() => {
    // @ts-ignore
    button.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  })

  expect(p.textContent).toBe('1')
  expect(label.textContent).toBe('1')

  // click button (2nd)
  act(() => {
    // @ts-ignore
    button.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  })

  expect(p.textContent).toBe('0')
  expect(label.textContent).toBe('0')
})

test('removeParent', {}, () => {
  // setup app
  const parentClass = 'test/parent'
  const childClass = 'test/child'

  const initParent = (myID: string): Thunk<Parent> => {
    return async (dispatch, _) => {
      dispatch(_init({ myID, state: {} }))
    }
  }

  const DoParent = {
    init: initParent,
    addChild,
    addLink,
    removeChild,
    removeLink,
    remove,
    setData,
    myClass: parentClass,
  }

  type TDoParent = ThunkModuleToFunc<typeof DoParent>

  const initChild = (parentID: string, doParent: DispatchFuncMap<Parent, TDoParent>): Thunk<Child> => {
    return async (dispatch, _) => {
      dispatch(_init({ parentID, doParent, state: {} }))
    }
  }

  const DoChild = {
    init: initChild,
    addChild,
    addLink,
    removeChild,
    removeLink,
    remove,
    setData,
    myClass: childClass,
  }

  type TDoChild = ThunkModuleToFunc<typeof DoChild>

  const App = (props: Props) => {
    const [stateParent, doParent] = useThunk<Parent, TDoParent>(DoParent)
    const [stateChild, doChild] = useThunk<Child, TDoChild>(DoChild)
    const [stateParentID, setParentID] = useState('')

    // init
    useEffect(() => {
      const parentID = genUUID()
      doParent.init(parentID)
      doChild.init(parentID, doParent)
      doChild.init(parentID, doParent)
      setParentID(parentID)
    }, [])

    console.log('removeParent: to getNode: parentID:', stateParentID)
    const parent = getNode(stateParent)

    const childIDs = parent ? getChildIDs(parent, childClass) : []
    const stateChildIDs = stateChild?.nodes ? Object.keys(stateChild.nodes) : '(undefined)'

    console.log('childIDs:', childIDs, 'stateChildIDs:', stateChildIDs)

    return (
      <div>
        <p>{childIDs ? childIDs.length : ''}</p>
        {/* biome-ignore lint/a11y/noLabelWithoutControl: in test. */}
        <label>{stateChildIDs.length}</label>
        {/* biome-ignore lint/a11y/noLabelWithoutControl: in test. */}
        <label>{stateChildIDs ? stateChildIDs[0] : ''}</label>
        <span>{stateParentID}</span>
        <button type='button' onClick={() => (parent ? doParent.remove(parent.id) : null)} />
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

  const p = container.querySelector('p')
  const labels = container.querySelectorAll('label')
  const label = labels[0]
  const label1 = labels[1]
  const button = container.querySelector('button')
  expect(p).not.toBeNull()
  if (p === null) {
    return
  }
  expect(button).not.toBeNull()
  if (button === null) {
    return
  }

  expect(p.textContent).toBe('2')
  expect(label.textContent).toBe('2')

  // click button (1st)
  act(() => {
    button.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  })

  expect(p.textContent).toBe('0')
  expect(label.textContent).toBe('0')
  expect(label1.textContent).toBe('')
})
