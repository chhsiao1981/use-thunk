import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { act } from 'react-dom/test-utils'
import { init as _init, remove, setData, createReducer, addChild, removeChild, addLink, removeLink, DispatchedAction, ClassState, Action, GetClassState, State, Node, Thunk, Dispatch } from '../src/index'
import { useReducer, getRootNode, getLinkIDs, getLinkID } from '../src/index'

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

}

interface B extends State {

}

type Props = {

}


it('link (init and remove)', () => {
    // setup app
    const aClass = 'test/a'
    const bClass = 'test/b'

    const initA = (myID: string): Thunk<A> => {
        return async (dispatch, _) => {
            dispatch(_init({ myID }))
        }
    }

    const initB = (myID: string): Thunk<B> => {
        return async (dispatch, _) => {
            dispatch(_init({ myID }))
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
        myClass: aClass,
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
        myClass: bClass,
    }

    const App = (props: Props) => {
        const [stateA, doA] = useReducer(DoA)
        const [stateB, doB] = useReducer(DoB)

        console.log('doA:', doA)

        // init
        useEffect(() => {
            let aID = 'aID0'
            let bID0 = 'bID0'
            let bID1 = 'bID1'
            doA.init(aID)
            doB.init(bID0)
            doB.init(bID1)

            let link = { id: aID, do: doA, theClass: aClass }

            doB.addLink(bID0, link)
            doB.addLink(bID1, link)

        }, [])

        let a = getRootNode(stateA)
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
        root.render(<App />)
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

    const initA = (myID: string): Thunk<A> => {
        return async (dispatch, _) => {
            dispatch(_init({ myID }))
        }
    }

    const initB = (myID: string): Thunk<B> => {

        return async (dispatch, _) => {
            dispatch(_init({ myID }))
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
        myClass: aClass,
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
        myClass: bClass,
    }

    const App = (props: Props) => {
        const [stateA, doA] = useReducer(DoA)
        const [stateB, doB] = useReducer(DoB)

        // init
        useEffect(() => {
            let aID = 'aID'
            let bID1 = 'bID1'
            let bID2 = 'bID2'
            doA.init(aID)
            doB.init(bID1)
            doB.init(bID2)

            doB.addLink(bID1, { id: aID, do: doA, theClass: aClass })
            doB.addLink(bID2, { id: aID, do: doA, theClass: aClass })
        }, [])

        let a = getRootNode(stateA)

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
        root.render(<App />)
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

    const initA = (myID: string): Thunk<A> => {
        return async (dispatch, _) => {
            dispatch(_init({ myID }))
        }
    }

    const initB = (myID: string): Thunk<B> => {

        return async (dispatch, _) => {
            dispatch(_init({
                myID,
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
        myClass: aClass,
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
        myClass: bClass,
    }

    const App = (props: Props) => {
        const [stateA, doA] = useReducer(DoA)
        const [stateB, doB] = useReducer(DoB)

        // init
        useEffect(() => {
            let aID = 'aID'
            let bID0 = 'bID0'
            let bID1 = 'bID1'
            doA.init(aID)
            doB.init(bID0)
            doB.init(bID1)

            let link = { id: aID, do: doA, theClass: aClass }

            doB.addLink(bID0, link)
            doB.addLink(bID1, link)

        }, [])

        let a_q = getRootNode(stateA)

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
        root.render(<App />)
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
