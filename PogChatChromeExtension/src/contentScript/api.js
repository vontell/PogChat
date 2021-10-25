/*global chrome*/
const axios = require('axios').default;

const URL = "http://localhost:8080";

async function getHeaders() {
    return new Promise(resolve => {
        chrome.storage.sync.get("info", (data) => {
            resolve({
                'Authorization': 'Pogger ' + data.info.access_token
            })
        });
    })

}


const PogApi = {

    async getTopics(stream, category) {
        let headers = await getHeaders();
        let params = {category}
        if (stream) {
            params['stream'] = stream;
        }
        return axios.get(
            `${URL}/topics`,
            {
                headers: headers,
                params
            }
        )
    },

    async getPopularTopics() {
        let headers = await getHeaders();
        return axios.get(
            `${URL}/topics/popular`,
            {
                headers: headers
            }
        )
    },

    async getParticipatingTopics() {
        let headers = await getHeaders();
        return axios.get(
            `${URL}/topics/participant`,
            {
                headers: headers
            }
        )
    },

    async viewTopic(topic_id) {
        let headers = await getHeaders();
        return axios.post(
            `${URL}/topics/view`,
            {
                topic_id
            },
            {headers: headers}
        )
    },

    async createTopic(title, description, category, stream) {
        let headers = await getHeaders();
        return axios.post(
            `${URL}/topics`,
            {
                "title": title,
                "category": category,
                "description": description,
                "stream": stream
            },
            {headers: headers}
        )
    },

    async createMessage(topic_id, message) {
        let headers = await getHeaders();
        return axios.post(
            `${URL}/messages`,
            {
                topic_id, message
            },
            {headers: headers}
        )
    },

    async getMessages(topic_id) {
        let headers = await getHeaders();
        return axios.get(
            `${URL}/messages`,
            {
                headers: headers,
                params: { topic_id }
            }
        )
    },

    async updateUserColor(color) {
        let headers = await getHeaders();
        return axios.post(
            `${URL}/users/color`,
            {
                color
            },
            {headers: headers}
        )
    }

};

export default PogApi;

