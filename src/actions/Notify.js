import Promise from 'bluebird'
import * as Firebase from 'firebase'
import axios from 'axios'

import * as config from '../configs/fcm.json'

Firebase.initializeApp(config)
const Notifier = Firebase.messaging()

Notifier.onMessage(message => {
    console.log(message) //Fazer alguma coisa com a mensagem
})

const getToken = () => {
    return Notifier
        .requestPermission()
        .then(() => Notifier.getToken())
        .catch(err => console.log("Sem permissão " + err))
}

const makeRequest = (path,data) => {
    let request = Object.assign({
        method: 'post',
        url: `https://iid.googleapis.com/iid/v1${path}`,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `key=${config.apiKey}`
        }
    }, data)
    return axios(request)
}

const makeTopicRequest = (token,topic) => makeRequest(`/${token}/rel/topics/${topic}`)

const makeUnsubscribeRequest = (tokens, topic) => makeRequest(`:batchRemove`,{
    "to": topic,
    "registration_tokens": tokens, //ARRAY DE TOKENS
})

const listenSometopic = () => getToken().then(token => makeTopicRequest(token,'some_topic'))

const listenSomeOthertopic = () => getToken().then(token => makeTopicRequest(token,'some_other_topic'))

export const unsubscribe = topic => getToken().then(token => makeUnsubscribeRequest([token], topic))

export const listenFCM = params => {
    return Promise.all([
        listenSometopic(),
        listenSomeOthertopic()
    ])
}
