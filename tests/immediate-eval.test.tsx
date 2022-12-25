import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { act } from 'react-dom/test-utils'
import { init as _init, setData, createReducer, addChild, removeChild, addLink, removeLink, DispatchedAction, ClassState, Action, GetClassState, State, Node, Thunk, Dispatch } from '../src/index'
import { useReducer, getRoot, genUUID, getLinkIDs, getLinkID, getState } from '../src/index'

let container: any
let root: any
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

    // @ts-ignore
    document.body.removeChild(container)
    container = null
})

interface A extends State {
    theStr: string
    theStr2: string
}

interface B extends State {

}

type Props = {

}

it('should immediately evaluate', () => {
    // setup app
    const aClass = 'test/a'

    const initA = (myID: string): Thunk<A> => {
        return async (dispatch, _) => {
            dispatch(_init({ myID, state: { theStr: 'theStr' } }))
            dispatch(dupStr(myID))
        }
    }

    const dupStr = (myID: string): Thunk<A> => {
        return async (dispatch, getClassState) => {
            let classState = getClassState()
            let me = getState(classState, myID)
            dispatch(setData(myID, { theStr2: me?.theStr + '-2' }))
        }
    }

    let DoA = {
        init: initA,
        default: createReducer<A>(),
        myClass: aClass,
    }

    const App = (props: Props) => {
        const [stateA, doA] = useReducer(DoA)

        useEffect(() => {
            let aID = genUUID()
            doA.init(aID)
        }, [])

        let a = getRoot(stateA)
        if (!a) return (<div></div>)

        return (
            <div>
                <p>{a.theStr}</p>
                <p>{a.theStr2}</p>
            </div>
        )
    }

    // do act
    act(() => {
        root.render(<App />)
    })

    const ps = container.querySelectorAll('p')
    expect(ps.length).toBe(2)
    const p = ps[0]
    const p1 = ps[1]

    expect(p.textContent).toBe('theStr')
    expect(p1.textContent).toBe('theStr-2')
})
