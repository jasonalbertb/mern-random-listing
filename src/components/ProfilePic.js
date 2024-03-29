import React , {useRef, useCallback, useState, useContext} from 'react'
import { FaCamera } from "react-icons/fa";
import {PICS} from "../helpers/constants/pics";
import Skeleton from "react-loading-skeleton";
import {useNavigate} from "react-router-dom";
import axios from 'axios';
//constants
import { ROUTES } from "../helpers/constants/routes";

//services
import {uploadPhoto} from "../firebase/services";
//context
import {ProfileContext} from "../context/ProfileContext";

export const ProfilePic = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {userCred, userdata, setUserdata} = useContext(ProfileContext);
  const navigate = useNavigate();
  const ref = useRef();
  const handleCameraBtn = useCallback(()=>{
    if (ref.current) {
      ref.current.click();
    }
  }, [ref])

  const handleFileInput = useCallback((e)=>{
    e.preventDefault()
    if (!userdata._id) return
    const file = e.target.files[0];
    setIsLoading(true)

    uploadPhoto({
      file, 
      onFileUploding: setIsLoading,
      onFileError : (error)=>{
        console.log(error);
        setIsLoading(false)
      },
      onFileSelect: async(url)=>{
        try {
          const response = await axios.patch(`${process.env.REACT_APP_proxy}/api/user/${userdata._id}`, {
            photoURL : url
          })
          if (response.status === 200) {
            setUserdata(response.data.data);
            setIsLoading(false)
          }
        } catch (error) {
          console.log(error?.response?.data?.message || error.message);
        }
      }
    })
  }, [userdata, navigate])

  if (isLoading) {
    return <div className='w-20 h-20 relative'>
        <div className='w-20 h-20 rounded-full leading-none overflow-hidden'>
            <Skeleton width={"100%"} height={"100%"} />
        </div>
    </div>
  }

  return (
    <div className='w-20 h-20 relative'>
       <img 
        alt='profile-pic'
        className='w-full h-full rounded-full object-cover object-center'
        src={userdata?.photoURL || PICS.DEFAULT_PFP}
      />
      {userCred && userCred._id === userdata?._id && 
        <>
          <input 
            accept='image/*'
            ref={ref}
            onChange={handleFileInput}
            type='file' className='hidden'/>
          <button className='absolute bottom-0 right-1'
            disabled={isLoading}
            onClick={handleCameraBtn}
          >
              <FaCamera  className='w-5 h-5 text-gray-500 opacity-50 hover:opacity-100'/>
          </button>
        </>
      }
      
  </div>
      
  )
}
