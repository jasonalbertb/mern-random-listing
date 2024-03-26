import React, {useCallback, useEffect, useState} from 'react'
import {PageLayout} from "../components/layouts/PageLayout";
import {useParams} from "react-router-dom";
import axios from 'axios';
import {logout} from "../store/userSlice";
import {appSignOut} from "../firebase/services";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, Link} from "react-router-dom";
import {ROUTES} from "../helpers/constants/routes";
//context
import {ProfileContext} from "../context/ProfileContext";
//components
import {ReactLoader} from "../components/loaders/ReactLoader";
import {EditInput} from "../components/inputs/EditInput";
import { ProfilePic } from '../components/ProfilePic';

const Profile = () => {

  const navigate = useNavigate();
  const {userId} = useParams();
  const [pageIsLoading, setPageIsLoading] = useState(true);
  const [errMessage, setErrorMsg] = useState(null);
  const [userdata, setUserdata] = useState(null);
  const {userCred} = useSelector(state=>state.user);

  const dispatch = useDispatch();
  const handleLogout = async(e)=>{
    e.preventDefault();
    try {
      await axios.post('/api/auth/logout', {})
      await appSignOut();
      dispatch(logout())
      navigate(ROUTES.DASHBOARD)
    } catch (error) {
      console.log(error);
    }
  }




  const setPrev = useCallback(()=>{
    (async()=>{
      setPageIsLoading(true);
      if (userId) {
        try {      
          const response = await axios.get(`/api/user/${userId}`);
          if (response.status === 200) {
            setUserdata(response.data.data);
          }
        } catch (error) {
          console.log(error?.response?.data?.message || error.message);
        }
      }
      setPageIsLoading(false)
    })()
  }, [userId])

  const handleEditUser = useCallback(()=>{
    return (async(e)=>{
      e.preventDefault();
      const {username, photoURL} = userdata;
      if (userCred) {
        try {
          const response = await axios.patch(`/api/user/${userCred._id}`, {
            username, photoURL
          });
          if (response.status === 200) {
            setUserdata(response.data.data);
          }
        } catch (error) {
          console.log(error);
          setErrorMsg(error?.response?.data?.message || error.message)
        }
      }

    })
  }, [ userCred, userdata]);

  useEffect(()=>{
    (async()=>{
      
      setPageIsLoading(true);
      if (userId) {
        try {      
          const response = await axios.get(`/api/user/${userId}`);
          if (response.status === 200) {
            setUserdata(response.data.data);
          }
        } catch (error) {
          console.log(error?.response?.data?.message || error.message);
        }
      }
      setPageIsLoading(false)
    })()
  }, [userId])


  if (pageIsLoading) {
    return <ReactLoader />
  }

  if (!userdata) {
    return (
      <PageLayout >
        <div className='grid place-content-center h-full font-semibold text-lg'>Not Found</div>
        
      </PageLayout>

    )
  }

  return (
    <ProfileContext.Provider
      value={{userCred, userdata, setUserdata}}
    >
      <PageLayout >
        <div className='flex flex-col items-center justify-center max-w-lg mx-auto'>
          <div className='text-3xl font-semibold mb-4'>Profile</div>
          <ProfilePic/>
          <EditInput 
            value={userdata.username}
            setPrev={setPrev}
            onChange={e=>setUserdata(prev=>({...prev, username: e.target.value}))}
            handleSubmit={handleEditUser()}
          />
          <Link to={ROUTES.CREATE_LISTING} className='text-center my-2 py-2 bg-blue-500 rounded-md text-white w-full font-semibold'>
            Create Listing
          </Link>
          {userCred &&  userCred._id === userdata?._id && (
            <div className='flex justify-between items-center w-full text-blue-500 font-semibold'>
              <button className='p-2 py-1 hover:bg-blue-100 rounded-md'>Delete account</button>
              <button className='p-2 py-1 hover:bg-blue-100 rounded-md' onClick={handleLogout}>Logout</button>
            </div>
          )}
          
          {errMessage &&(
              <div className='ml-4 w-full text-xs text-red-500'>
                {errMessage}
              </div>
          )}
        </div>
      </PageLayout>
    </ProfileContext.Provider>

  )
}

export default Profile