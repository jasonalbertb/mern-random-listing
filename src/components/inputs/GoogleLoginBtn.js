import React, {useState, useEffect} from 'react'
import {googleLogin} from "../../firebase/services";
import axios from 'axios';
import {onAuthStateChanged, getAuth} from "firebase/auth"

import {login} from "../../store/userSlice";
import {useDispatch} from "react-redux";
export const GoogleLoginBtn = () => {
    const dispatch = useDispatch();

    const [isGoogleBtnDisabled, setisGoogleBtnDisabled] = useState(false);
    
    useEffect(()=>{
        const unsub = onAuthStateChanged(getAuth(), (user)=>{
            const fetch = async ()=>{
                try {
                    if (user) {
                        const response = await axios.post(
                            '/api/auth/googlelogin',{
                            email: user.email,
                            photoURL: user.photoURL || ""
                        }) 
                        if (response.status === 200) {
                            dispatch(login(response.data.data))
                        }
                        setisGoogleBtnDisabled(false)
                    }
                } catch (error) {
                    console.log(error);
                }
            }
            fetch ()
        })
        return unsub;
    }, [dispatch])

    const handleGoogleLoginBtn = async(e)=>{
        e.preventDefault();
        try {
            setisGoogleBtnDisabled(true)
            await googleLogin();
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <button 
            disabled={isGoogleBtnDisabled}
            onClick={handleGoogleLoginBtn}
            className='bg-red-800 text-white font-semibold py-2 rounded-lg hover:opacity-[.7] 
            transition-all duration-100 ease-in-out mt-4 uppercase disabled:opacity-50'
        >Continue with google</button>
    )
}
