import firebase from "firebase";

export const initializeFirebase = () => {
    firebase.initializeApp({
        apiKey: "AIzaSyDnmpCJ5ZNyIf_ylwkU2s4yPYfGDlcXoeI",
        authDomain: "waterborne.firebaseapp.com",
        databaseURL: "https://waterborne.firebaseio.com",
        projectId: "waterborne",
        storageBucket: "waterborne.appspot.com",
        messagingSenderId: "816644377710",
        appId: "1:816644377710:web:095fb9cb1b24feb8132a7f"
    });
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('/firebase-sw.js')
            .then((registration) => {
                firebase.messaging().useServiceWorker(registration);
            });
    }


};
export const askForPermissionToReceiveNotifications = async () => {
    try {
        const messaging = firebase.messaging();
        await messaging.requestPermission();
        const token = await messaging.getToken();
        console.log('user token:', token);
        return token;
    } catch (error) {
        console.error(error);
    }
};
export const sendMessageUserToSeller = async (username, message, shopname) => {
    firebase.database().ref('users/' + username + '/sellers/' + shopname).push({
        message: message,
        author: 'me',
    }, function (error) {
        if (error) {
            console.log("error", error);
        } else {
            console.log("success");
        }
    });
    firebase.database().ref('sellers/' + shopname + '/users/' + username).push({
        message: message,
        author: 'them',
        read: false
    });
};
export const sendMessageUserToUser = async (username, message, otherusername) => {
    firebase.database().ref('users/' + username + '/users/' + otherusername).push({
        message: message,
        author: 'me',
    }, function (error) {
        if (error) {
            console.log("error", error);
        } else {
            console.log("success");
        }
    });
    firebase.database().ref('users/' + otherusername + '/users/' + username).push({
        message: message,
        author: 'them',
        read: false
    });
};

export const checkIntialized = () => {
    return firebase.apps.length;
};

export function getMessages(username, shopname) {

    let getChatData = firebase.database().ref('users/' + username + '/sellers/' + shopname);
    return getChatData;
}

export function getMessagesFromUser(username, otheruser) {

    let getChatData = firebase.database().ref('users/' + username + '/users/' + otheruser);
    return getChatData;
}

export const getfirebase = () => {
    return firebase;
}
