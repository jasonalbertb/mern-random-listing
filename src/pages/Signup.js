import React, { useState , useEffect} from 'react'
import {PageLayout} from "../components/layouts/PageLayout";
import axios from 'axios';

//components
import {FloatingInputs} from "../components/inputs/FloatingInputs";
import {GoogleLoginBtn} from "../components/inputs/GoogleLoginBtn";
import {Link} from "react-router-dom";
import {ROUTES} from "../helpers/constants/routes";
import {useNavigate} from "react-router-dom";

//icons
import { FaSpinner } from "react-icons/fa";

const Signup = () => {
  const navigate = useNavigate();
  const [username, setUsername]= useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isSignupBtnDisabled, setIsSignupBtnDisabled] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isSignupBtnLoading, setIsSignupBtnLoading] = useState(false);

  const handleSignupBtn = async(e)=>{
    e.preventDefault();
    setIsSignupBtnDisabled(true);
    setIsSignupBtnLoading(true)
    try {
      await axios.post('/api/auth/register', {
        email, username, password
      })
      return navigate(ROUTES.LOGIN)
    } catch (error) {
      setErrorMsg(error?.response?.data?.message || "Something went wrong")
      console.log(error.response.data.message);
    } 
    setUsername("");
    setEmail("");
    setPassword("");
    setIsSignupBtnDisabled(false);
    setIsSignupBtnLoading(false)
  }

  useEffect(()=>{
    setIsSignupBtnDisabled(!username || !password || !email)
  }, [username, password, email])

  return (
    <PageLayout >
      <div className=' mx-auto max-w-md mt-8 flex flex-col'>
        <div className='font-semibold text-2xl my-6 grid place-content-center'>
          Sign Up
        </div>
        <div className='mb-3'>
          <FloatingInputs value={username} setValue={setUsername} label="Username"/>
        </div>
        <div className='mb-3'>
          <FloatingInputs value={email} setValue={setEmail} label="Email"/>
        </div>
        <div className='mb-3'>
          <FloatingInputs value={password} setValue={setPassword} label="Password" type='password'/>
        </div>
        {errorMsg && <div className=' mx-4 text-xs text-red-500 capitalize'>{errorMsg}</div>}
        
        <button 
          disabled={isSignupBtnDisabled}
          onClick={handleSignupBtn}
          className='inline-flex items-center justify-center bg-blue-600 text-white font-semibold py-2 rounded-lg hover:opacity-[.7] 
            transition-all duration-100 ease-in-out mt-4 uppercase disabled:opacity-50'
        >
          {isSignupBtnLoading && <FaSpinner className='animate-spin mr-2'/>}
           <span>Sign up</span>
        </button>
        <GoogleLoginBtn />

        <div className='mt-4'>
          Have an account? 
          <Link to={ROUTES.LOGIN} 
            className='text-blue-500 font-semibold hover:underline'
          > Log In</Link>
        </div>
      </div>
    </PageLayout>
  )
}

export default Signup