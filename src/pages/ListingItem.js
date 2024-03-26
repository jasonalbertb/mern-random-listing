import React, {useEffect, useState} from 'react'
import {Link, useParams} from "react-router-dom";
import {PageLayout} from "../components/layouts/PageLayout";
import axios from "axios";
import {ReactLoader} from "../components/loaders/ReactLoader";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { FaBed , FaBath, FaParking , FaChair , FaMapMarkerAlt } from "react-icons/fa";
import { ROUTES } from '../helpers/constants/routes';
import {useSelector} from "react-redux";

const ListingItem = () => {
    const {userCred} = useSelector(state=>state.user);
    const {id} = useParams();
    const [listingData, setListingData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(()=>{
        (async()=>{
            try {
                setIsLoading(true)
                const url = `/api/listing/${id}`;
                const response = await axios.get(url);
                if (response.status === 200) {
                    setListingData(response.data.listing)
                }
            } catch (error) {
                console.log(error);
            }
            setIsLoading(false);
        })()
        
    }, [id])

    if (isLoading) {
        return <ReactLoader />
    }

    if(!listingData){
        return <PageLayout>
            Listing not found
        </PageLayout>
    }

    return (
        <PageLayout>
             <Swiper navigation={true} modules={[Navigation]} className="mySwiper">
                {listingData.imageUrls.map((url, index)=>{
                    return (
                        <SwiperSlide key={index}>
                            <div className='h-[300px]'
                                style={{
                                    background: `url(${url}) center no-repeat`,
                                    backgroundSize: 'cover',
                                }}
                            >  
                            </div>
                        </SwiperSlide>
                    )
                })}
             </Swiper>
             <div className='myb-20'>
                <div className='font-bold text-xl my-6 capitalize'>{listingData.name} - $ {listingData.regularPrice -listingData.discountedPrice} {listingData.type === 'rent' && '/ month'}</div>
                <div className='flex gap-1 items-center text-gray-500 '>
                    <FaMapMarkerAlt className='text-green-500'/> {listingData.address}</div>
                <div className='flex gap-4 my-2'>
                    <div className='text-white font-semibold bg-red-800 rounded-md px-8 text-xs flex items-center py-1'>
                        {listingData.type === 'sell'? 'For Sale': 'For Rent'}
                    </div>
                        {listingData.offer &&   
                        <div className='text-white font-semibold bg-green-800 rounded-md px-8 text-xs flex items-center'> $ {listingData.discountedPrice} Discount
                    </div>}
                </div>
                <div className='my-4'>
                    <span className='font-semibold'>Description - </span> 
                    <span className='uppercase'>{listingData?.description[0]}</span>
                    <span >{listingData?.description.slice(1)}</span>
                </div>
                <div className='flex gap-4 text-green-800 my-2'>
                    <div className='flex items-center gap-1'><FaBed /> {listingData.beds || 0} Beds</div>
                    <div className='flex items-center gap-1'><FaBath /> {listingData.baths || 0} Baths</div>
                    <div className='flex items-center gap-1'><FaParking /> {listingData.parkingSpot? 
                        'Available': 'No Parking'}</div>
                    <div className='flex items-center gap-1'><FaChair  /> {listingData.furnished? 
                        'Furnished': 'Not furnished'}</div>
                </div>
                <div className='flex my-12'>
                    {listingData.userRef === userCred._id && 
                        <Link className='text-white font-semibold bg-blue-500 rounded-md px-8 text-xs flex items-center py-1 hover:opacity-80' 
                            to={ROUTES.UPDATE_LISTING(listingData._id)}>
                            Update Listing
                        </Link>
                    }

                </div>
             </div>
        </PageLayout>
    )
}

export default ListingItem