import React, { useState , useEffect} from 'react'
import {PageLayout} from "../components/layouts/PageLayout";
//components
import {FloatingInputs} from "../components/inputs/FloatingInputs";
import {GoogleLoginBtn} from "../components/inputs/GoogleLoginBtn";
import {Link} from "react-router-dom";
import {ROUTES} from "../helpers/constants/routes";
//redux
import {useDispatch} from "react-redux";
import {login} from "../store/userSlice";
import axios from "axios";
//icons
import { FaSpinner } from "react-icons/fa";
const Login = () => {
  const dispatch = useDispatch();
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isLoginBtnDisabled, setisLoginBtnDisabled] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const handleLoginBtn =async (e)=>{
    e.preventDefault();
    setisLoginBtnDisabled(true);
    setIsLoading(true)
    try {
      const response = await axios.post( 
          `${process.env.REACT_APP_proxy}/api/auth/login`,{
            email, password
      })
      if (response.status === 200) {
        dispatch(login(response.data.data))
      }
      
    } catch (error) {
      setErrorMsg(error?.response?.data?.message || error.message)
      console.log('error', error);
    }
    setisLoginBtnDisabled(false)
    setIsLoading(false)
  }

  useEffect(()=>{
    setisLoginBtnDisabled( !password || !email)
  }, [password, email])

  return (
    <PageLayout >
      <div className=' mx-auto max-w-md mt-8 flex flex-col'>
        <div className='font-semibold text-2xl my-6 grid place-content-center'>
          Log In
        </div>
        <div className='mb-3'>
          <FloatingInputs value={email} setValue={setEmail} label="Email"/>
        </div>
        <div className='mb-3'>
          <FloatingInputs value={password} setValue={setPassword} label="Password" type='password'/>
        </div>
        <button 
          disabled={isLoginBtnDisabled}
          onClick={handleLoginBtn}
          className='inline-flex items-center justify-center bg-blue-600 text-white font-semibold py-2 rounded-lg hover:opacity-[.7] 
            transition-all duration-100 ease-in-out mt-4 uppercase disabled:opacity-50'
        >
          {isLoading && <FaSpinner className='animate-spin mr-2'/>}
          <span>Log In</span>
        </button>
        <GoogleLoginBtn />
        {errorMsg && <div className=' mt-4 text-xs text-red-500 capitalize'>{errorMsg}</div>}
        <div className='mt-4'>
          Dont have an account? 
          <Link to={ROUTES.SIGNUP} 
            className='text-blue-500 font-semibold hover:underline'
          > Sign Up</Link>
        </div>
      </div>
    </PageLayout>
  )
}

export default Login