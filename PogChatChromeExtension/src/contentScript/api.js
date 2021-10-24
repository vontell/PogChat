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
            "http://localhost:8080/topics",
            {
                headers: headers,
                params
            }
        )
    },

    async getPopularTopics() {
        let headers = await getHeaders();
        return axios.get(
            "http://localhost:8080/topics/popular",
            {
                headers: headers
            }
        )
    },

    async viewTopic(topic_id) {
        let headers = await getHeaders();
        return axios.post(
            "http://localhost:8080/topics/view",
            {
                topic_id
            },
            {headers: headers}
        )
    },

    async createTopic(title, description, category, stream) {
        let headers = await getHeaders();
        return axios.post(
            "http://localhost:8080/topics",
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
            "http://localhost:8080/messages",
            {
                topic_id, message
            },
            {headers: headers}
        )
    },

    async getMessages(topic_id) {
        let headers = await getHeaders();
        return axios.get(
            "http://localhost:8080/messages",
            {
                headers: headers,
                params: { topic_id }
            }
        )
    },

    async updateUserColor(color) {
        let headers = await getHeaders();
        return axios.post(
            "http://localhost:8080/users/color",
            {
                color
            },
            {headers: headers}
        )
    }

};

export default PogApi;

