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
                    return []
                }
            }
        }
    },
    mutations: {
        updateUserMutation(state, newUser) {
            state.user = newUser
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
        changeTaskTypeMutation(state, {index, taskType}) {
            state.tasks[index].taskType = taskType
        },
        initTaskArrayMutation(state) {
            state.tasks = []
        },
        logoutMutation(state) {
            state.user = null
        }
    },
    actions: {
        async addTaskAction({state, commit}, newTask) {
            let actionSuccess = true
            if (state.user != null) {
                const response = await apiRequests.addTask(newTask)
                if (!response.ok()) {
                    actionSuccess = false
                }
            }
            if (actionSuccess) {
                commit('addTaskMutation', newTask)
            }
        },
        async deleteTaskAction({state, commit}, dateTime) {
            let actionSuccess = true
            let index = state.tasks.findIndex(task => task.dateTime == dateTime)
            if (state.user != null && index != -1) {
                const response = await apiRequests.deleteTask(state.tasks[index]._id)
                if (!response.ok()) {
                    actionSuccess = false
                }
            }
            if (actionSuccess && index != -1) {
                commit('deleteTaskMutation', index)
            }
        },
        async pullAllTasksAction({state, commit}) {
            let taskListResponse = await apiRequests.getTaskList()
            if (taskListResponse.ok() && taskListResponse.data.length > 0) {
                commit('initTaskArrayMutation')
                taskListResponse.data
                    .filter(t => !state.tasks.includes(t))
                    .forEach(t => commit('addTaskMutation', t))
            }
        },
        async changeTaskTypeAction({state, commit}, {dateTime, newType}) {
            let actionSuccess = true
            let index = state.tasks.findIndex(task => task.dateTime == dateTime)
            if (state.user != null && index != -1 && ('_id' in state.tasks[index])) {
                const response = await apiRequests.changeTaskType(state.tasks[index]._id, newType)
                if (!response.ok()) {
                    actionSuccess = false
                }
            }
            if (actionSuccess && index != -1) {
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
                throw response.data
            }
        },
        async mergeUserTasksAction({state, dispatch}) {
            state.tasks
                .filter(t => !('_id' in t))
                .forEach(t => {
                    dispatch('deleteTaskAction', t.dateTime)
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
