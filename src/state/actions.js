import {SET_USER, ADD_TODO, DELETE_TODO} from './Constants'

export const setUser = payload => ({
    type: SET_USER,
    payload
})

export const addTodo = payload => ({
    type: ADD_TODO,
    payload
})

export const deleteTodo = payload => ({
    type: DELETE_TODO,
    payload
})