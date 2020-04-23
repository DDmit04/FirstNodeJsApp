import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        currentTasks: [
            {id: 1, taskText: 'lulaaaaaaaaaaaaaaaaaaaaaaaa/naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'},
            {id: 2, taskText: 'zulul'}
        ],
        completedTasks: [],
        stopedTasks: [],
        deletedTasks: []
    },
    mutations: {
        addTaskMutation(state, newTask) {
            state.currentTasks.push(newTask)
        },
        continueTaskMutation(state, index) {
            state.currentTasks.push(state.stopedTasks[index])
            state.stopedTasks.splice(index, 1)
        },
        stopTaskMutation(state, index) {
            state.stopedTasks.push(state.currentTasks[index])
            state.currentTasks.splice(index, 1)
        },
        completeTaskMutation(state, index) {
            state.completedTasks.push(state.currentTasks[index])
            state.currentTasks.splice(index, 1)
        },
        deleteTaskFomCurrentMutation(state, index) {
            state.deletedTasks.push(state.currentTasks[index])
            state.currentTasks.splice(index, 1)
        },
        deleteTaskFromStoppedMutation(state, index) {
            state.deletedTasks.push(state.stopedTasks[index])
            state.stopedTasks.splice(index, 1)
        },
    },
    actions: {
        async addTaskAction({commit}, newTask) {
            commit('addTaskMutation', newTask)
        },
        async continueTaskAction({state, commit}, id) {
            let index = state.stopedTasks.findIndex(task => task.id == id)
            if (index != -1) {
                commit('continueTaskMutation', index)
            }
        },
        async stopTaskAction({state, commit}, id) {
            let index = state.currentTasks.findIndex(task => task.id == id)
            if (index != -1) {
                commit('stopTaskMutation', index)
            }
        },
        async completeTaskAction({commit, state}, id) {
            let index = state.currentTasks.findIndex(task => task.id == id)
            if (index != -1) {
                commit('completeTaskMutation', index)
            }
        },
        async deleteTaskAction({commit, state}, id) {
            let index = state.currentTasks.findIndex(task => task.id == id)
            if (index != -1) {
                commit('deleteTaskFomCurrentMutation', index)
            } else if (state.stopedTasks.findIndex(task => task.id == id) != -1) {
                index = state.stopedTasks.findIndex(task => task.id == id)
                commit('deleteTaskFromStoppedMutation', index)
            }
        },
    },
    modules: {}
})
