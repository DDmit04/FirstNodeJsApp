import Vue from 'vue'
import Vuex from 'vuex'
import apiRequests from "../axios/apiRequests"
import userRequests from "../axios/userRequests";
import createPersistedState from 'vuex-persistedstate'
import * as Cookie from 'js-cookie'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        tasks: [],
        chosenTab: 0,
        user: null
    },
    plugins: [
        createPersistedState({
            paths: ['tasks', 'chosenTab'],
            getState: (key) => Cookie.getJSON(key),
            setState: (key, state) => Cookie.set(key, state, {expires: 1, secure: false})
        })
    ],
    getters: {
        getTasks(state) {
            return type => {
                if (state.tasks != null) {
                    return state.tasks.filter(t => t.taskType == type)
                } else {
                    return [{}]
                }
            }
        }
    },
    mutations: {
        updateUserMutation(state, newUser) {
            state.user = newUser
        },
        logoutMutation(state) {
            state.user = null
        },
        changeChosenTabMutation(state, newTab) {
            state.chosenTab = newTab
        },
        addTaskMutation(state, newTask) {
            state.tasks.push(newTask)
        },
        deleteTaskMutation(state, index) {
            state.tasks.splice(index, 1)
        },
        updateTaskMutation(state, {index, updatedTask}) {
            state.tasks[index] = updatedTask
        },
        changeTaskTypeMutation(state, {index, taskType}) {
            let currentDate = Date.now()
            if (taskType == "CURRENT") {
                state.tasks[index].continuedDate = currentDate
            } else if (taskType == "STOPPED") {
                state.tasks[index].stoppedDate = currentDate
            } else if (taskType == "DISCARDED") {
                state.tasks[index].discardedDate = currentDate
            } else if (taskType == "COMPLETED") {
                state.tasks[index].completedDate = currentDate
            }
            state.tasks[index].taskType = taskType
        },
        initTaskArrayMutation(state) {
            state.tasks = []
        },
    },
    actions: {
        async addTaskAction({state, commit}, newTask) {
            if (state.user != null) {
                const response = await apiRequests.addTask(newTask)
                if (!response.ok()) {
                    throw response.errors()
                }
                newTask.localStored = false
            } else {
                newTask.localStored = true
            }
            commit('addTaskMutation', newTask)
        },
        async deleteTaskAction({state, commit}, creationDate) {
            let index = state.tasks.findIndex(task => task.creationDate == creationDate)
            if (index != -1) {
                if (state.user != null && index != -1 && ('_id' in state.tasks[index])) {
                    const response = await apiRequests.deleteTask(state.tasks[index]._id)
                    if (!response.ok()) {
                        throw response.errors()
                    }
                }
                commit('deleteTaskMutation', index)
            }
        },
        async pullAllTasksAction({state, commit, dispatch}) {
            if (state.user != null) {
                dispatch('mergeUserTasksAction')
                let taskListResponse = await apiRequests.getTaskList()
                if (taskListResponse.ok() && taskListResponse.data.length > 0) {
                    commit('initTaskArrayMutation')
                    taskListResponse.data
                        .filter(t => !state.tasks.includes(t))
                        .forEach(t => {
                            commit('addTaskMutation', t)
                        })
                }
            }
        },
        async changeTaskTypeAction({state, commit}, {creationDate, newType}) {
            let index = state.tasks.findIndex(task => task.creationDate == creationDate)
            if (index != -1 && state.user != null && ('_id' in state.tasks[index])) {
                const response = await apiRequests.changeTaskType(state.tasks[index]._id, newType)
                if (!response.ok()) {
                    throw response.errors()
                }
                commit('updateTaskMutation', {
                    index,
                    updatedTask: response.data
                })
            } else if (index != -1) {
                commit('changeTaskTypeMutation', {
                    index,
                    taskType: newType
                })
            }
        },
        async loginUserWithCommonAction({commit, dispatch}, {username, password}) {
            const response = await userRequests.loginCommon(username, password)
            if (response.ok()) {
                await commit('updateUserMutation', response.data)
                await dispatch('mergeUserTasks')
            } else {
                throw response.errors()
            }
        },
        async mergeUserTasksAction({state, dispatch}) {
            state.tasks
                .filter(t => t.localStored)
                .forEach(t => {
                    dispatch('deleteTaskAction', t.creationDate)
                    dispatch('addTaskAction', t)
                })
        },
        async getUserAction({state, commit}) {
            if (state.user == null || state.user == '') {
                const response = await userRequests.getCurrentUser()
                if (response.ok() && response.data != null) {
                    commit('updateUserMutation', response.data)
                }
            }
        },
    },
    modules: {}
})
