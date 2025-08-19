import { act, useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { afterEach, beforeEach, expect, test } from 'vitest'
import { cleanShared, genUUID, getRootID, type ModuleToFunc, useReducer } from '../src/index'
import Parent from './TheSharedHavingChildParent'
import * as DoChild from './theChild'
import * as DoParent from './theParent'

type TDoParent = ModuleToFunc<typeof DoParent>
type TDoChild = ModuleToFunc<typeof DoChild>

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

  console.info('module-no-default-shared: afterEach: to CleanSharedState')
  cleanShared()
})

type Props = {}

test.sequential('module-no-default-shared-having-child (init and remove)', {}, () => {
  const App = (props: Props) => {
    const [stateParent, doParent] = useReducer<DoParent.State, TDoParent>(DoParent)
    const [stateChild, doChild] = useReducer<DoChild.State, TDoChild>(DoChild)
    const [parentID, _1] = useState(genUUID())
    const [childID1, _2] = useState(genUUID())
    const [childID2, _3] = useState(genUUID())

    // init
    useEffect(() => {
      doParent.init(parentID)
      doChild.init(childID1, DoParent.myClass, parentID, doParent)
      doChild.init(childID2, DoParent.myClass, parentID, doParent)
    }, [doParent.init, doChild.init])

    const parentRootID = getRootID(stateParent)

    console.info('module-no-default-shared: to render: parentRootID:', parentRootID, 'parentID:', parentID)

    return (
      <>
        <span className='parent-root-id'>{parentRootID}</span>
        <span className='parent-id'>{parentID}</span>
        <Parent myID={parentID} />
      </>
    )
  }

  console.info('module-no-default-shared: to act')

  // do act
  act(() => {
    root?.render(<App />)
  })
  if (container === null) {
    return
  }

  const parentDivs = container.getElementsByClassName('parent-div')
  const parentButtons = container.getElementsByClassName('parent-button')

  const childDivs = container.getElementsByClassName('child-div')
  const childButtons = container.getElementsByClassName('child-button')

  const parentRootIDs = container.getElementsByClassName('parent-root-id')
  const parentIDs = container.getElementsByClassName('parent-id')

  expect(parentRootIDs.length).toBe(1)
  expect(parentIDs.length).toBe(1)
  expect(parentDivs.length).toBe(1)
  expect(parentButtons.length).toBe(1)
  expect(childDivs.length).toBe(2)
  expect(childButtons.length).toBe(2)

  expect(parentRootIDs[0].textContent).toBe(parentIDs[0].textContent)
  expect(parentDivs[0].textContent).toBe('0')
  expect(childDivs[0].textContent).toBe('0')
  expect(childDivs[1].textContent).toBe('0')

  // click parent button (1st)
  act(() => {
    parentButtons[0].dispatchEvent(new MouseEvent('click', { bubbles: true }))
  })

  expect(parentRootIDs[0].textContent).toBe(parentIDs[0].textContent)
  expect(parentDivs[0].textContent).toBe('1')
  expect(childDivs[0].textContent).toBe('0')
  expect(childDivs[1].textContent).toBe('0')

  // click parent button (2st)
  act(() => {
    parentButtons[0].dispatchEvent(new MouseEvent('click', { bubbles: true }))
  })

  expect(parentRootIDs[0].textContent).toBe(parentIDs[0].textContent)
  expect(parentDivs[0].textContent).toBe('2')
  expect(childDivs[0].textContent).toBe('0')
  expect(childDivs[1].textContent).toBe('0')

  // click child button1 (1st)
  act(() => {
    childButtons[0].dispatchEvent(new MouseEvent('click', { bubbles: true }))
  })

  expect(parentRootIDs[0].textContent).toBe(parentIDs[0].textContent)
  expect(parentDivs[0].textContent).toBe('2')
  expect(childDivs[0].textContent).toBe('1')
  expect(childDivs[1].textContent).toBe('0')

  // click child button1 (2nd)
  act(() => {
    childButtons[0].dispatchEvent(new MouseEvent('click', { bubbles: true }))
  })

  expect(parentRootIDs[0].textContent).toBe(parentIDs[0].textContent)
  expect(parentDivs[0].textContent).toBe('2')
  expect(childDivs[0].textContent).toBe('2')
  expect(childDivs[1].textContent).toBe('0')

  // click child button1 (3rd)
  act(() => {
    childButtons[0].dispatchEvent(new MouseEvent('click', { bubbles: true }))
  })

  expect(parentRootIDs[0].textContent).toBe(parentIDs[0].textContent)
  expect(parentDivs[0].textContent).toBe('2')
  expect(childDivs[0].textContent).toBe('3')
  expect(childDivs[1].textContent).toBe('0')

  // click child button2 (1st)
  act(() => {
    childButtons[1].dispatchEvent(new MouseEvent('click', { bubbles: true }))
  })

  expect(parentRootIDs[0].textContent).toBe(parentIDs[0].textContent)
  expect(parentDivs[0].textContent).toBe('2')
  expect(childDivs[0].textContent).toBe('3')
  expect(childDivs[1].textContent).toBe('1')
})
