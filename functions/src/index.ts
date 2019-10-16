import * as functions from 'firebase-functions';
import * as express from 'express';
import * as bodyParser from "body-parser";

const app = express();
const main = express();
const cors = require('cors');

// const config = require('config');
const async = require('async');
const nodemailer = require('nodemailer');

var firebase = require("firebase");
//var firestore = require('firebase/firestore');
var firebaseConfig = {
    "apiKey": "AIzaSyCpWAgboJusJqS9EUCRXZc4V7T_DGtH4Q0",
    "authDomain": "ichef-14324.firebaseapp.com",
    "databaseURL": "https://ichef-14324.firebaseio.com",
    "projectId": "ichef-14324",
    "storageBucket": "ichef-14324.appspot.com",
    "messagingSenderId": "629470272511",
    "appId": "1:629470272511:web:68226d0573f15547"
}

firebase.initializeApp(firebaseConfig);

main.use('/api/v1', app);
main.use(bodyParser.json());
main.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    // res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
// webApi is your functions name, and you will pass main as 
// a parameter



app.post('/signIn', (req, res) => {

    console.log("Call initiated : ", JSON.stringify(req.body));
    var retObj = {

    };

    async.parallel([

        function (callback: any) {

            prepareLogin(req.body.email, req.body.password)

                .then((Response: any) => {

                    console.log("Successfull login");
                    retObj = {

                        message: "Successfull login!",
                        code: "200"
                    }

                    callback(null, retObj)

                }).catch((Response: any) => {

                    console.log("=====Login Error====");

                    retObj = {

                        message: Response.message,
                        code: "406"
                    }

                    callback(null, retObj)

                })



        }
    ],
        function (err: any, results: any) {

            var reqResponse = {
                'body': retObj,
                'details': 'success'
            };
            res.status(200).send(reqResponse);
            // return hstatus.ok(reply, reqResponse);
        });



})

app.post('/register', (req, res) => {

    console.log("Call initiated : ", JSON.stringify(req.body));
    var retObj = {

    };

    async.parallel([

        function (callback: any) {

            prepareRegistration(req.body.email, req.body.password)

                .then((Response: any) => {

                    retObj = {

                        message: "Successfull Registration!",
                        code: "200"
                    }

                    console.log("====Registration====");

                    callback(null, retObj)

                }).catch((Response: any) => {

                    console.log("====Error ----  Registration====");
                    console.log(Response.message);
                    retObj = {

                        message: Response.message,
                        code: "406"
                    }

                    callback(null, retObj)

                })

        }
    ],
        function (err: any, results: any) {

            var reqResponse = {
                'body': retObj,
                'details': 'success'
            };
            res.status(200).send(reqResponse);
        });



})

app.post('/passwordReset', (req, res) => {

    console.log("Call initiated : ", JSON.stringify(req.body));
    var retObj = {

    };

    async.parallel([

        function (callback: any) {

            preparePasswordReset(req.body.email)

                .then((Response: any) => {

                    console.log("====Password Reset====");

                    retObj = {

                        message: "A link for password reset has been sent to your email.",
                        code: "200"
                    }



                    callback(null, retObj)

                }).catch((Response: any) => {

                    console.log("====Error ----  Password Reset====");
                    console.log(Response.message);
                    retObj = {

                        message: Response.message,
                        code: "406"
                    }

                    callback(null, retObj)

                })

        }
    ],
        function (err: any, results: any) {

            var reqResponse = {
                'body': retObj,
                'details': 'success'
            };
            res.status(200).send(reqResponse);
        });



})

app.get('/readRecipes', (req, res) => {

    console.log("Initiated a call....");
    var retObj: any = {};

    async.parallel([

        function (callback: any) {

            let res = firebase.firestore().collection('recipes');
            res.onSnapshot((querySnapshot: any) => {
                let boards: any = [];
                querySnapshot.forEach((doc: any) => {
                    let data = doc.data();
                    boards.push({
                        key: doc.id,
                        name: data.userName,
                        userID: data.userId,
                        comments: data.comments,
                        content: data.content,
                        createdOn: data.createdOn,
                        cheffId: data.cheffId,
                        price: data.price
                        //img : data.recipeImage

                    });
                });
                retObj = boards;
                retObj.code = "200";
                callback(null, retObj)

            });


        }
    ],
        function (err: any, results: any) {

            var reqResponse = {
                'body': retObj,
                'details': 'success'
            };
            res.status(200).send(reqResponse);
        });


})

app.get('/readcheffs', (req, res) => {

    console.log("Initiated a call for reading Cheffs....");
    var retObj: any = {};

    async.parallel([

        function (callback: any) {

            let res = firebase.firestore().collection('cheffs');
            res.onSnapshot((querySnapshot: any) => {
                let boards: any = [];
                querySnapshot.forEach((doc: any) => {
                    let data = doc.data();
                    boards.push({
                        key: doc.id,
                        name: data.name,
                        mail: data.mail,
                        profile: data.profile,
						img : data.img

                    });
                });
                retObj = boards;
                retObj.code = "200";
                callback(null, retObj)

            });


        }
    ],
        function (err: any, results: any) {

            var reqResponse = {
                'body': retObj,
                'details': 'success'
            };
            res.status(200).send(reqResponse);
        });


})


app.post('/sendmail', (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');

    console.log("Call initiated : ", JSON.stringify(req.body));

    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            
            user: 'nkagiseng46@gmail.com',
            pass: 'f@cus1sbr1ght21'
        }
    });
 
    var retObj: any = {};

    const mailOptions = {
        from: 'nkagiseng46@gmail.com',
        to: req.body.to,
        subject: req.body.subject,
        html: req.body.html
    };


    async.parallel([

        function (callback: any) {
            console.log("Function Initiated");
            transporter.sendMail(mailOptions, function (error: any, info: any) {
                if (error) {
                    console.log("====There is an ERROR====");
                    console.log(error);
                    console.log(":)====================:)");
                    console.log(error.response);
                    retObj = error.response;
                    callback(null, retObj);
                } else {
                    console.log("==SUCCESS===");
                    console.log('Email sent: ' + info.response);
                    retObj.message = 'Email sent';
                    callback(null, retObj);
                }
            });

        }
    ],
        function (err: any, results: any) {

            console.log("SENDING RESPONSE========");
            var reqResponse = {
                'body': retObj,
                'details': 'success'
            };

            res.status(200).send(reqResponse);

        });

})


function prepareLogin(email: string, password: string) {
    return firebase.auth().signInWithEmailAndPassword(email, password);
}

function prepareRegistration(email: string, password: string) {
    return firebase.auth().createUserWithEmailAndPassword(email, password);
}

function preparePasswordReset(email: string) {
    return firebase.auth().sendPasswordResetEmail(email);
}


export const webApi = functions.https.onRequest(main);

// function onReadRecipes() {
//     return firestore.firestore().collection('recipes').snapshotChanges();
// }








// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
