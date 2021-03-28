import firebase from 'firebase/app'
import 'firebase/storage'
import { upload } from './upload'

const firebaseConfig = {
  apiKey: "AIzaSyChQ4f7_tuvtt-vSMlXaS-WBXH20BCwIk0",
  authDomain: "sf-file-uploader-bedbd.firebaseapp.com",
  projectId: "sf-file-uploader-bedbd",
  storageBucket: "sf-file-uploader-bedbd.appspot.com",
  messagingSenderId: "391708534517",
  appId: "1:391708534517:web:26fafbd6a14d8d665887bc"
};

firebase.initializeApp(firebaseConfig);

const storage = firebase.storage()

upload('#file', {
  multiple: true,
  accept: ['.png', '.jpg', '.jpeg', '.gif'],
  onUpload(files, previewInfo) {
    files.forEach((file, index) => {
      const ref = storage.ref(`images/${file.name}`)
      const task = ref.put(file)

      task.on('state_changed', snapshot => {
        const currentProgress = previewInfo[index].querySelector('.preview-progress')
        const percentage = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0)
        currentProgress.textContent = `${percentage}%`
        currentProgress.style.width = `${percentage}%`
      }, error => {
        //
      }, complete => {
        task.snapshot.ref.getDownloadURL()
          .then(response => {
            console.log('response', response)
          })
      })
    })
  }
})
