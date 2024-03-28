
import {auth} from "./clientApp";
import {GoogleAuthProvider, getAuth, signInWithPopup, signOut} from "firebase/auth";
import {getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject, uploadBytes} from "firebase/storage";
import {v4 as uuidv4} from 'uuid';
export const firebaseMaxFileSize = 5242880;
export const fileTypes = [
    "image/apng",
    "image/bmp",
    "image/gif",
    "image/jpeg",
    "image/pjpeg",
    "image/png",
    "image/svg+xml",
    "image/tiff",
    "image/webp",
    "image/x-icon"
  ];

  export const googleLogin = async()=>{
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider)
}
export const appSignOut = async()=>{
    await signOut(auth)
}

export const uploadPhoto = ({file, onFileUploding, onFileError, onFileSelect})=>{

    if (!file) {
        return
    }

    if (!(file.type && fileTypes.includes(file.type))) {
        throw new Error("Invalid File");
    }

    if(!(file.size && firebaseMaxFileSize > file.size)){
        throw new Error('Image file size must not exceed 5MB');
    }

    const storage = getStorage();
    const path = `images/${uuidv4()}${file.name}`;
    const storageRef = ref(storage, path);

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
        'state_changed', 
        (snapshot)=>{
            if (snapshot.state === 'running') {
                onFileUploding(true);
            }
        },
        async (error)=>{
            await deletePhoto(path)
            onFileError(error)
        }, 
        async()=>{
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            await onFileSelect(url)
        }
    )

}

export const uploadPhotos = async(files)=>{

    if (!files && files?.length === 0) {
        return
    }

    if (!files.length > 6) {
        throw new Error("Max file number must not exceed to 6.")
    }


    [...files].forEach(({file})=>{
        if (!(file.type && fileTypes.includes(file.type))) {
            throw new Error("Invalid File");
        }
    })

    files.forEach(({file})=>{
        if(!(file.size && firebaseMaxFileSize > file.size)){
            throw new Error('Image/s file size must not exceed 5MB');
        }
    })

    const promises = files.map(async({file})=>{
        const storage = getStorage();
        const path = `images/${uuidv4()}${file.name}`;
        const storageRef = ref(storage, path);
    
        const response = await uploadBytes(storageRef, file);
        const url = await getDownloadURL(response.ref);
        return url;
    })

    const imageUrls = await Promise.all(promises)
       return imageUrls;
    
}

export const deletePhoto = async (path)=>{
    if (!path) return
    try {
        const storage = getStorage();
        const storageRef = ref(storage, path);
        if (storageRef)  await deleteObject(storageRef)
    } catch (error) {
        console.log(error);
    }
}