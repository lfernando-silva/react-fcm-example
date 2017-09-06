import * as config from '../src/configs/fcm.json'

importScripts('https://www.gstatic.com/firebasejs/4.2.0/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/4.2.0/firebase-messaging.js')

firebase.initializeApp(config)

const Notifier = firebase.messaging()
Notifier.setBackgroundMessageHandler(payload => {
    const title = 'Nova Notificação'
    const options = {
        body: payload.data.notificacao
    }
    //Padronizar formato da notificação
    return self.registration.showNotification(title, options)
})