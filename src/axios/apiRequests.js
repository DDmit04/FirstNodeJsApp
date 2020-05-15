require('dotenv').config();
const axios = require('axios');

function convertResponse(response) {
    const data = {
        data: response.data,
        status: response.status
    }
    return data
}

export default {

    addTask: async (newTask) => {
        const response = await axios.post('/api', newTask)
        const data = convertResponse(response)
        return data
    },
    getTaskList: async () => {
        const response = await axios.get('/api')
        const data = convertResponse(response)
        return data
    },
    changeTaskType: async (id, newTaskType) => {
        const response = await axios.patch('/api', { id, newTaskType })
        const data = convertResponse(response)
        return data
    },
    deleteTask: async (id) => {
        const response = await axios.delete('/api', { params: { id } })
        const data = convertResponse(response)
        return data
    },
}