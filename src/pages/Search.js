import React, {useCallback, useEffect, useState} from 'react'
import {PageLayout} from "../components/layouts/PageLayout";
//components
import {ListingCard} from "../components/ListingCard";
import {useNavigate} from "react-router-dom";
import axios from 'axios';
import { ROUTES } from '../helpers/constants/routes';
import {paramsInit} from "../helpers/constants/paramsInit";
import { ImSpinner2 } from "react-icons/im";

const Search = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  
  const [searchParams, setSearchParams] = useState(paramsInit)
  const [listings, setListings] = useState([]);

  const [hasMore, setHasMore] = useState(true);
  const [startIndex, setStartIndex] = useState(0);
  const limit = 6;

  const handleViewMoreBtn = (e)=>{
    e.preventDefault();
    setStartIndex(prev=>prev+limit);
    
  }

  const handleSearchSubmit = useCallback( e=>{
    e.preventDefault();
    const urlParams = new URLSearchParams();
    for (const [key, value] of Object.entries(searchParams)) {
      if (value) urlParams.set(key, value);
    }
    const searchQuery = urlParams.toString();

    navigate(ROUTES.SEARCH_QUERY(searchQuery));
    const fetch = async()=>{
      setIsLoading(true)
      try {
        urlParams.set('limit', limit);
        const searchQuery = urlParams.toString();
        const response = await axios.get(`${process.env.REACT_APP_proxy}/api/listing?${searchQuery}`);
        if (response.status === 200) {
         
          setListings(response.data.listings);
          setHasMore(limit === response.data.listings.length);
          setStartIndex(0)
        }
      } catch (error) {
        setIsError(true)
        console.log(error?.response?.data?.message || error.message);
      }
      setIsLoading(false)
    };
    fetch()
  }, [searchParams, navigate])

  const handleTypeChange = e=>{
    setSearchParams(prev=>{
      if (prev.type === e.target.value) {
        return {...prev, type : ''}
      }else{
        return {...prev, type : e.target.value}
      }
     
    })
  }

  useEffect(()=>{
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('startIndex', startIndex);
    urlParams.set('limit', limit);
    const search = urlParams.get('search') || paramsInit.search;
    const type = urlParams.get('type') || paramsInit.type;
    const parking = urlParams.get('parking')==='true'? true: false;
    const furnished = urlParams.get('furnished') ==='true'? true: false;
    const offer = urlParams.get('offer') ==='true'? true: false;
    const sort = urlParams.get('sort') || paramsInit.sort;
    const order = urlParams.get('order') || paramsInit.order;
    const value = {
      search,
      type,
      parking,
      furnished,
      offer,
      sort,
      order
    };
    setSearchParams(value);

    const fetch = async()=>{
      setIsLoading(true)
      try {
        const searchQuery = urlParams.toString();
        const response = await axios.get(`${process.env.REACT_APP_proxy}/api/listing?${searchQuery}`);
        if (response.status === 200) {
          setHasMore(limit === response.data.listings.length);
          if (startIndex===0) {
            setListings(response.data.listings);
          }else{
            setListings(prev=>[...prev, ...response.data.listings]);
          }
          
        }
      } catch (error) {
        setIsError(true)
        console.log(error?.response?.data?.message || error.message);
      }
      setIsLoading(false)
    };
    fetch()
  }, [startIndex])

  return (
    <PageLayout >
      <div className='flex p-4 flex-col md:flex-row md:p-0'>
        <form  onSubmit={handleSearchSubmit} className='md:w-1/3'>
            <div className='flex items-center gap-2'>
              <div className='flex gap-2 items-center'>
                <span className='font-semibold '>Search :</span>  
                <input type='text' value={searchParams.search} 
                  className='p-2 rounded-md w-[190px]'
                  onChange={e=>setSearchParams(prev=>{
                    return {...prev, search: e.target.value}
                  })}
                  onKeyDown={e=>{
                    if (e.key === 'Enter') {
                      e.preventDefault()
                    }
                  }}
              /></div>
            </div>
            <div className='flex gap-4 my-2'>
              <label className='font-semibold'>Type :</label>
              <label className='flex gap-1'>
                <input type='checkbox' 
                  checked={searchParams.type === 'sell'} 
                  value='sell' onChange={handleTypeChange}/>
                Sale
              </label>
              <label className='flex gap-1'>
                <input type='checkbox' 
                  checked={searchParams.type === 'rent'} 
                  value='rent' onChange={handleTypeChange}/>
                  Rent
              </label>
              <label className='flex gap-1'>
              <input type='checkbox' 
                checked={searchParams.type === 'all'}
                value='all' onChange={handleTypeChange}/>
                  Rent and Sale
              </label>
            </div>
            <div className='flex gap-4 my-2'>
              <label className='font-semibold'>Amenities: </label>
              <label className='flex gap-1'>
                <input type='checkbox' 
                  checked={searchParams.parking} 
                  value='parking' onChange={e=>setSearchParams(prev=>{
                    return {...prev, parking: e.target.checked}
                  })}
                />
                Parking
              </label>
              <label className='flex gap-1'>
                <input type='checkbox'  
                  checked={searchParams.furnished}
                  value='furnished' onChange={e=>setSearchParams(prev=>{
                    return {...prev, furnished: e.target.checked}
                  })}
                />
                Furnished
              </label>
            </div>
            <div className='flex gap-4 my-2'>
              <label className='font-semibold'>Discounts: </label>
              <label className='flex gap-1'>
                <input type='checkbox' 
                  checked={searchParams.offer} 
                  onChange={(e=>setSearchParams(prev=>{
                    return {
                      ...prev, offer: e.target.checked
                    }
                  }))}
                />
                Offer
              </label>
            </div>
            <div className='flex gap-4 my-2'>
              <label className='font-semibold'>Sort: </label>
              <select value={searchParams.sort} 
                onChange={e=>setSearchParams(prev=>({...prev, sort : e.target.value}))}
              >
                <option value='createdAt'>Created At</option>
                <option value='name'>Name</option>
              </select>
            </div>
            <div className='flex gap-4 my-2'>
              <label className='font-semibold'>Order: </label>
              <select value={searchParams.order} 
                onChange={e=>setSearchParams(prev=>({...prev, order : e.target.value}))}
              >
                <option value='asc'>Ascending</option>
                <option value='desc'>Descending</option>
              </select>
            </div>
            <div>
              <button disabled={isLoading} type='submit' 
                className='w-full rounded-md bg-blue-900 text-white font-semibold py-2 disabled:opacity-50'>
                  Search
              </button>
            </div>
          </form>
        <div className='md:w-2/3 p-4'>
          {isError ? 
            <div className='text-xl font-semibold'> Results not Found </div>: 
            <div className='grid sm:grid-cols-2 md:grid-cols-3 gap-4'>
              { listings.map((listing, index)=>{
                  return <ListingCard key={index} {...listing} />
                })
              }
             
            </div>
          }
            {isLoading && <div className='py-4 grid place-content-center'> <ImSpinner2 className='animate-spin'/></div>}
           {hasMore ?<button disabled={isLoading} onClick={handleViewMoreBtn} 
              className='text-sm inline-flex gap-1 items-center text-white font-semibold mt-4
               bg-blue-500 rounded-md p-1 px-4 hover:opacity-50 disabled:opacity-50'>
              View More 
            </button>:
            <div className='text-sm text-gray-500 mt-4'>No more results.</div>
          }
        </div>
      </div>
    </PageLayout>
  )
}

export default Search