import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/auth';

import firebaseConfig from "./config/firbase.config";
class Fire {
    constructor(){
        firebase.initializeApp(firebaseConfig);
    }

    addPost = async({text, localUrl}) => {
        const remoteUrl = await this.uploadPhotoAsync(localUrl)

        return new Promise ((res, rej) => {
            this.firestore
            .collection("posts")
            .add({
                text,
                uid: this.uid,
                timestamp: this.timestamp,
                image:remoteUrl
            })
            .then(ref => {
                res(ref);
            })
            .catch(error =>{
                ref(error)
            })
        })
    }

    uploadPhotoAsync = async url => {
        const path = `photos/${this.uid}/${Date.now()}.jpeg`
        return new Promise(async (res, rej) => {
            const response = await fetch(url);
            const file=await response.blob();

            let upload = firebase.storage().ref(path).put(file);

            upload.on(
                "state_changed", snapshot => {}, err => {
                    rej(err);
                },
                async () => {
                    const url = awaitupload.snapshot.ref.getDownloadURL();
                    res(url);
                }
            )
        })
    }

    get firestore() {
        return firebase.firestore()
    }

    get uid(){
        return (firebase.auth90.currentUser || {}).uid
    }

    get timestamp(){
        return Date.now()
    }
}

Fire.shared = new Fire()

export default Fire