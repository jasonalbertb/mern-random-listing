import React, {useEffect, useState} from 'react'
import {PageLayout} from "../components/layouts/PageLayout";
import {Link} from "react-router-dom";
import {ROUTES} from "../helpers/constants/routes";
import axios from "axios";
import {ListingCard} from "../components/ListingCard";
const Dashboard = () => {
  const [sellListings, setSellListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  useEffect(()=>{
    const fetch = async ()=>{
      try {
        const sellUrlParams = new URLSearchParams();
        const rentUrlParams = new URLSearchParams();
        const sellQuery = {
          type : 'sell',
          limit : 5,
          sort : 'createdAt',
          order : 'desc'
        };
        const rentQuery = {
          type : 'rent',
          limit : 5,
          sort : 'createdAt',
          order : 'desc'
        }

        for(const [key, value] of Object.entries(sellQuery)){
          if (value) {
            sellUrlParams.set(key, value)
          }
        }
        for(const [key, value] of Object.entries(rentQuery)){
          if (value) {
            rentUrlParams.set(key, value)
          }
        }
        const sellSearchQuery = sellUrlParams.toString();
        const rentSearchQuery = rentUrlParams.toString();
        const sellResponse = await axios.get(`${process.env.REACT_APP_proxy}/api/listing?${sellSearchQuery}`);
        const rentResponse = await axios.get(`${process.env.REACT_APP_proxy}/api/listing?${rentSearchQuery}`);
        if (sellResponse.status === 200 && sellResponse.data.listings) {
          setSellListings(sellResponse.data.listings)
        }
        if (rentResponse.status === 200 && rentResponse.data.listings) {
          setRentListings(rentResponse.data.listings)
        }
      } catch (error) {
        console.log(error?.response?.data?.message || error.message);
      }

    }
    fetch ()
  } , [])

  return (
    <PageLayout >
        <div className='h-[60vh] flex items-center'>
          <div className='w-3/5'> 
            <div className='text-4xl font-bold text-slate-800'>Find your next <span className='text-slate-500'>random</span> things online with ease</div>
            <div className='mt-4'>
              <Link to={ROUTES.SEARCH_QUERY('')} 
                className='text-white font-bold bg-blue-500 px-3 hover:opacity-60 py-1.5 rounded-lg transition duration-150 ease-in-out'>
                Start now</Link>
            </div>
          </div>
        </div>
        {sellListings?.length >0 && 
          <div className='my-4'>
            <div className='text-lg font-semibold text-slate-700 my-1'> Recent things for sale</div>
            <div className='grid grid-cols-5 gap-4'>
              {sellListings.map((item, index)=>{
                return <ListingCard {...item} key={index} height={50} />
              })}
            </div>
          </div>
        }
        {
          rentListings?.length > 0 && 
            <div className='my-4'>
              <div className='text-lg font-semibold text-slate-700 my-1'> Recent things for rent</div>
              <div className='grid grid-cols-5 gap-4'>
                {rentListings.map((item, index)=>{
                  return <ListingCard {...item} key={index} height={50} />
                })}
              </div>
            </div>
        }
       
    </PageLayout>

  )
}

export default Dashboard