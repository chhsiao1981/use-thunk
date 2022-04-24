react-reducer-utils
==========

[![codecov](https://codecov.io/gh/chhsiao1981/react-reducer-utils/branch/main/graph/badge.svg)](https://codecov.io/gh/chhsiao1981/react-reducer-utils)

Utilities to help construct "normalized" states when using useReducer in react-hook.

Adopting concept of [redux-duck](https://github.com/PlatziDev/redux-duck)

React-Reducer-Utils is with the following additional features:

1. The development of the reducers follows the concept of redux-duck.
2. Similar to mapDispatchToProps, the bound-dispatch-actions are generated through useActionDispatchReducer().

Install
-----

    npm install react-reducer-utils

Usage
-----

Reducer able to do increment (reducers/increment.js):

    import {init as _init, setData, createReducer} from 'react-reducer-utils'
    const myClass = 'demo/Increment'

    export const init = (doMe, parentID, doParent) => {
      return (dispatch, getState) => {
        dispatch(_init({myClass, doMe, parentID, doParent, count: 0}))
      }
    }

    export const increment = (myID) => {
      return (dispatch, getState) => {
        let me = getState()[myID]
        if(!me) return

        dispatch(setData(myID, {count: me.count + 1}))
      }
    }

    export default createReducer()

App.js:

    import * as DoIncrement from './reducers/increment'
    import {useActionDispatchReducer, getRoot} from 'react-reducer-utils'

    export default (props) => {
      // reducer
      const [stateIncrement, doIncrement] = useActionDispatchReducer(DoIncrement)

      //init
      useEffect(() => {
        doIncrement.init(doIncrement)
      }, [])

      // to render
      let increment = getRoot(stateIncrement)

      return (
        <div>
          <p>count: {increment.count}</p>
          <button onClick={() => doIncrement.increment(increment.id)}>increase</button>
        </div>
      )
    }

Normalized State
-----

The general concept of normalized state can be found in [Normalizing State Shape](https://redux.js.org/recipes/structuring-reducers/normalizing-state-shape)
with the following features:

1. It is easy to separate out the states of different reducer-classes to different variables by using useReducer() (or useActionDispatcherReducer()).
   One state represents the state of all objects in one reducer-class and no need to embed reducer-classname in the first layer of the state.
2. "myClass", "doMe", "ids" and "root" are reserved words and can not be ids.
3. The concept of "parent" and "children" and "links" is embedded in the state.
    * remove (me):
        - initiate "remove" for all the children.
        - remove from the parent.
        - remove from all the links.
    * remove child:
        - the child initiate "remove".
    * remove link:
        - the link initiate "remove link" on me.
4. To avoid complication, currently there is only 1 parent.

For example, the example in the link is represented as:

    statePost = {
        myClass: 'post',
        doMe: func(),
        [uuid-post1] : {
            id: uuid-post1,
            author : uuid-user1,
            body : "......",
            _parent: {
                id: uuid-user1,
                do: doUser
            },
            _links: {
                comment : {
                    list: [uuid-comment1, uuid-comment2],
                    do: doComment
                }
            }
        },
        [uuid-post2] : {
            id : uuid-post2,
            author : uuid-user2,
            body : "......",
            _parent: {
                id: uuid-user2,
                do: doUser
            },
            _links: {
                comment : {
                    list: [uuid-comment3, uuid-comment4, uuid-comment5],
                    do: doComment
                }
            }
        },
        ids : [uuid-post1, uuid-post2]
    }

and:

    stateComment = {
        myClass: 'comment',
        doMe: func(),
        [uuid-comment1] : {
            id : uuid-comment1,
            author : uuid-user2,
            comment : ".....",
            _parent: {
                id: uuid-user2,
                do: doUser
            },
            _links: {
                post: {
                    list: [uuid-post1],
                    do: doPost
                }
            }
        },
        [uuid-comment2] : {
            id : uuid-comment2,
            author : uuid-user3,
            comment : ".....",
            _parent: {
                id: uuid-user3,
                do: doUser
            },
            _links: {
                post: {
                    list: [uuid-post1],
                    do: doPost
                }
            }
        },
        [uuid-comment3] : {
            id : uuid-comment3,
            author : uuid-user3,
            comment : ".....",
            _parent: {
                id: uuid-user3,
                do: doUser
            },
            _links: {
                post: {
                    list: [uuid-post2],
                    do: doPost
                }
            }
        },
        [uuid-comment4] : {
            id : uuid-comment4,
            author : uuid-user1,
            comment : ".....",
            _parent: {
                id: uuid-user1,
                do: doUser
            },
            _links: {
                post: {
                    list: [uuid-post2],
                    do: doPost
                }
            }
        },
        [uuid-comment5] : {
            id : uuid-comment5,
            author : uuid-user3,
            comment : ".....",
            _parent: {
                id: uuid-user3,
                do: doUser
            },
            _links: {
                post: {
                    list: [uuid-post2],
                    do: doPost
                }
            }
        },
        ids : [uuid-comment1, uuid-comment2, uuid-comment3, uuid-commment4, uuid-comment5]
    }

and:

    stateUser = {
        myClass: 'comment',
        doMe: func(),
        [uuid-user1] : {
            id: uuid-user1,
            username : "user1",
            name : "User 1",
            _children: {
                post: {
                    list: [uuid-post1],
                    do: doPost,
                },
                comment: {
                    list: [uuid-comment4],
                    do: doComment,
                }
            }
        },
        [uuid-user2] : {
            id: uuid-user2,
            username : "user2",
            name : "User 2",
            _children: {
                post: {
                    list: [uuid-post2],
                    do: doPost,
                },
                comment: {
                    list: [uuid-comment1],
                    do: doComment,
                }
            }
        },
        [uuid-user3] : {
            id: uuid-user3,
            username : "user3",
            name : "User 3",
            _children: {
                post: {
                    list: [uuid-post1],
                    do: doPost,
                },
                comment: {
                    list: [uuid-comment2, uuid-comment3, uuid-comment5],
                    do: doComment,
                }
            }
        },
        ids : [uuid-user1, uuid-user2, uuid-user3]
    }

[APIs](https://github.com/chhsiao1981/react-reducer-utils/blob/main/types/index.d.ts)
-----

useActionDispatchReducer(action)
---

Similar to useReducer, but we use useThunkReducer, and we also bind the actions with dispatch (similar concept as mapDispatchToProps).

return: [state, boundDispatchAction]

init({myID, myClass, doMe, parentID, doParent, links, ...params})
---

initializing the react-object.

params:
* links: `[{id, myClass, do}]`

addLink(myID, link, isFromLink=false)
---

params:
* link: `{id, theClass, do}`

remove(myID, isFromParent=false)
---

remove the react-object.

removeChild(myID, childID, childClass, isFromChild=false)
---

remove the child (and delete the child) from myID.

removeLink(myID, linkID, linkClass, isFromLink=false)
---

remove the link from myID (and remove the link from linkID).

setData(myID, data)
---

set the data to myID.

createReducer(reduceMap)
---

params:
* reduceMap: `{}` representing the mapping of the additional reduce-map. referring to [theReduceMap](https://github.com/chhsiao1981/react-reducer-utils/blob/master/src/index.js#L323).

getRoot(state)
---

get the root-object in the state.

getMe(state, myID)
---

get my-object in the state.

getChildIDs(me, childClass)
---
get the child-ids from the childClass in me.

getChildID(me, childClass)
---

get the only child-id (childIDs[0]) from the childClass in me.

getLinkIDs(me, linkClass)
---

get the link-ids from the linkClass in me.

getLinkID(me, linkClass)
---

get the only link-id (linkIDs[0]) from the linkClass in me.

genUUID()
---

generate uuid for react-object.

\<Empty \/\>
---
return empty react-object.
