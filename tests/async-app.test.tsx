import { act, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { afterEach, beforeEach, expect, it } from 'vitest'
import { getMod, registerThunk, useThunk } from '../src/index'
import { resetThunkModuleMap } from '../src/thunkContext/thunkModuleMap'
import { resetID } from '../src/utils/genID'
import * as ModChild2 from './child2'
import { sleep } from './utils'

let container: HTMLDivElement | null
let root: ReactDOM.Root | null

beforeEach(() => {
  resetThunkModuleMap()
  resetID()

  registerThunk(ModChild2)

  container = document.createElement('div')
  document.body.appendChild(container)

  root = ReactDOM.createRoot(container)

  // @ts-expect-error set IS_REACT_ACT_ENVIRONMENT
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

it('async-app', async () => {
  const App = () => {
    const [child2, doChild2] = useThunk<ModChild2.State, typeof ModChild2>(ModChild2)

    // init
    useEffect(() => {
      doChild2.asyncIncrement1(7, 80)
      doChild2.asyncIncrement2(6, 100)
    }, [])

    return (
      <>
        <p className='count1'>{child2.count1}</p>
        <p className='count2'>{child2.count2}</p>
        <p className='count'>{child2.count}</p>
      </>
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
    console.info('start: time:', new Date().getMilliseconds())
    root?.render(<App2 />)
  })

  if (container === null) {
    return
  }

  await sleep(650)

  const count1s = container.querySelectorAll('.count1')
  const count2s = container.querySelectorAll('.count2')
  const counts = container.querySelectorAll('.count')

  const count1 = count1s[0]
  const count2 = count2s[0]
  const count = counts[0]

  expect(count1.textContent).toBe('14')
  expect(count2.textContent).toBe('12')
  expect(count.textContent).toBe('26')

  const child2Module = getMod(ModChild2.name)
  console.info('child2Module:', child2Module)
  const child2ModuleNodeKeys = Object.keys(child2Module.nodes)
  expect(child2ModuleNodeKeys.length).toBe(1)
  const child2ID = child2ModuleNodeKeys[0]
  expect(child2ID).toBe(child2Module.defaultID)
  const {
    count: count_s,
    count1: count1_s,
    count2: count2_s,
  } = child2Module.nodes[child2ID].stateAndDefaultState.state
  expect(count1_s).toBe(14)
  expect(count2_s).toBe(12)
  expect(count_s).toBe(26)
})
