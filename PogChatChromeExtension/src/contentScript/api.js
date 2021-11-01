/*global chrome*/
const axios = require('axios').default;

const BASE_URL = "http://localhost:8080";

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
            `${BASE_URL}/topics`,
            {
                headers: headers,
                params
            }
        )
    },

    async getPopularTopics() {
        let headers = await getHeaders();
        return axios.get(
            `${BASE_URL}/topics/popular`,
            {
                headers: headers
            }
        )
    },

    async getParticipatingTopics() {
        let headers = await getHeaders();
        return axios.get(
            `${BASE_URL}/topics/participant`,
            {
                headers: headers
            }
        )
    },

    async getStartingTopics(stream, category) {
        let headers = await getHeaders();
        let url = new URL(`${BASE_URL}/topics/startup`);
        let params = url.searchParams;
        if (stream) {
            params.append("stream", stream);
        }
        if (category) {
            params.append("category", category);
        }

        return axios.get(url.toString(),
            {
                headers: headers
            }
        )
    },

    async viewTopic(topic_id) {
        let headers = await getHeaders();
        return axios.post(
            `${BASE_URL}/topics/view`,
            {
                topic_id
            },
            {headers: headers}
        )
    },

    async createTopic(title, description, category, stream) {
        let headers = await getHeaders();
        return axios.post(
            `${BASE_URL}/topics`,
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
        message = message.trim()
        return axios.post(
            `${BASE_URL}/messages`,
            {
                topic_id, message
            },
            {headers: headers}
        )
    },

    async getMessages(topic_id) {
        let headers = await getHeaders();
        return axios.get(
            `${BASE_URL}/messages`,
            {
                headers: headers,
                params: { topic_id }
            }
        )
    },

    async updateUserColor(color) {
        let headers = await getHeaders();
        return axios.post(
            `${BASE_URL}/users/color`,
            {
                color
            },
            {headers: headers}
        )
    }

};

export default PogApi;

