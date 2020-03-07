importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js');
firebase.initializeApp({
    apiKey: "AIzaSyBPEbhbJqmEtx10J4bqCNkwn-DcWXCiNAU",
    authDomain: "e-commerce-9984b.firebaseapp.com",
    databaseURL: "https://e-commerce-9984b.firebaseio.com",
    projectId: "e-commerce-9984b",
    storageBucket: "e-commerce-9984b.appspot.com",
    messagingSenderId: "1016668624662"
  });
const messaging = firebase.messaging();