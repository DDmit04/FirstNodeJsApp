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

    checkUsername: async (username) => {
        const response = await axios.get('/user/check/username', {
            params: {
                username: username
            }
        })
        const data = convertResponse(response)
        const usernameExists = data.data.userExists
        return usernameExists
    },
    checkEmail: async (email) => {
        const response = await axios.get('/user/check/email', {
            params: {
                email: email
            } })
        const data = convertResponse(response)
        const emailExists = data.data.userExists
        return emailExists
    },
    getCurrentUser: async () => {
        const response = await axios.get('/user')
        const data = convertResponse(response)
        return data
    },
    regUser: async ({username, email, password, passwordConf}) => {
        const response = await axios.post('/user/register', {username, email, password, passwordConf}).catch(e => {return e.response})
        const data = convertResponse(response)
        return data
    },
    loginCommon: async (username, password) => {
        const response = await axios.post('/auth/login', {username, password}).catch(e => {return e.response})
        const data = convertResponse(response)
        return data
    },
    // mergeUserTasks: async (...tasks) => {
    //
    // }

}