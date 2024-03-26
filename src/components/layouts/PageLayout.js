import React, { useEffect, useState } from 'react'
import {Link} from "react-router-dom";
import {ROUTES} from "../../helpers/constants/routes";
import {PICS} from "../../helpers/constants/pics";
import {useSelector} from "react-redux";
import {paramsInit} from "../../helpers/constants/paramsInit";

//icons
import { FaSearch } from "react-icons/fa";
import { AiOutlineMenu } from "react-icons/ai";

import {useNavigate} from "react-router-dom";

export const PageLayout = ({children, home}) => {
  const navigate = useNavigate();

  const [searchInput, setSearchInput] = useState("");
  const {userCred} = useSelector(state=>state.user);
  const handleSearchSubmit = (e)=>{
    e.preventDefault();
    if (!searchInput) {
      return
    }
    const urlParams = new URLSearchParams();
    urlParams.set('search', searchInput);
    urlParams.set('sort', paramsInit.sort);
    urlParams.set('order', paramsInit.order)
    const searchQuery = urlParams.toString();
    navigate(ROUTES.SEARCH_QUERY(searchQuery))
  }

  useEffect(()=>{
    const urlParams = new URLSearchParams(window.location.search)
    const search = urlParams.get('search') || '';
    setSearchInput(search)
  }, [] )

  return (
    <div className='bg-gray-50 '>
        <div className={` relative max-w-4xl  mx-auto`}>
          <div className='  flex justify-between items-center p-3 border mb-4 bg-slate-200 absolute top-0 w-full'>
              <Link 
                to={ROUTES.DASHBOARD}
                className='text-xl font-semibold'>Random Listing </Link>
              <div className='flex gap-2'>
                <form onSubmit={handleSearchSubmit} className='bg-slate-100 relative rounded-md overflow-hidden'>
                  <input 
                    value={searchInput}
                    onChange={e=>setSearchInput(e.target.value)}
                    type='text' placeholder='Search...' 
                    className='border px-2 py-1 bg-transparent pr-8' 
                  />
                  <button className='absolute right-2 top-1/2 translate-y-[-50%]'>
                    <FaSearch />
                  </button>
                </form>
                <button className='inline-flex md:hidden hover:bg-gray-100 rounded-md'>
                  <AiOutlineMenu className='w-6 h-6 m-1'/></button>
              </div>
              
              <div className='font-semibold gap-2 hidden md:flex'>
                <Link to={ROUTES.DASHBOARD} 
                  className='px-2 py-1 rounded-md hover:bg-gray-100 transition-all duration-300 ease-in-out'
                >Home</Link>
                <Link to={ROUTES.ABOUT}
                  className='px-2 py-1 rounded-md hover:bg-gray-100 transition-all duration-300 ease-in-out'
                >About</Link>
                {userCred ?
                   <Link
                    to={ROUTES.PROFILE(userCred._id)}
                   >
                      <img 
                        className='w-8 h-8 rounded-full object-center '
                        src={`${userCred.photoURL || PICS.DEFAULT_PFP}`}
                        alt='profile'
                      />
                   </Link>:
                   <Link to={ROUTES.LOGIN}
                      className='px-2 py-1 rounded-md hover:bg-gray-100 transition-all duration-300 ease-in-out'
                  >Login</Link>
                }
               
                
              </div>

          </div>
          <div className='min-h-screen pt-20'>
             {children}
          </div>
        </div>
       
    </div>
  )
}
