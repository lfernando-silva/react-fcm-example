import * as Firebase from 'firebase'
import axios from 'axios'

import * as config from '../configs/fcm.json'

Firebase.initializeApp(config)
const Notifier = Firebase.messaging()

Notifier.onMessage(message => {
    //Fazer alguma coisa com a mensagem
    console.log(message)
})

export const notifyFCM = () => {
    return Notifier
        .requestPermission()
        .then(() => Notifier.getToken())
        .then(token => {
            return axios({
                method: 'post',
                url: `https://iid.googleapis.com/iid/v1/${token}/rel/topics/inerge_info`,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `key=${config.apiKey}`
                }
            }).then(response => {
                console.log(response)
            }).catch(err => {
                console.log(err)
            })
        })
        .catch(err => console.log("Sem permissão " + err))
}
