import React, {useState} from 'react'
import {googleLogin} from "../../firebase/services";
import axios from 'axios';

import {login} from "../../store/userSlice";
import {useDispatch} from "react-redux";
export const GoogleLoginBtn = () => {
    const dispatch = useDispatch();

    const [isGoogleBtnDisabled, setisGoogleBtnDisabled] = useState(false);
    
    const handleGoogleLoginBtn = async(e)=>{
        e.preventDefault();
        //email pfp
        try {
            setisGoogleBtnDisabled(true)
            const result = await googleLogin();
            
            if (result?.user?.email) {
                const response = await axios.post(
                    '/api/auth/googlelogin',{
                    email: result.user.email,
                    photoURL: result.user?.photoURL || ""
                }) 
                if (response.status === 200) {
                    dispatch(login(response.data.data))
                }
            }
           
            setisGoogleBtnDisabled(false)
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
