import React from 'react'
import {FaMapMarkerAlt} from "react-icons/fa";
import {useNavigate} from "react-router-dom";
import {ROUTES} from "../../helpers/constants/routes";
export const ListingCard = ({height=60, _id, imageUrls, name, address, description, beds, baths, type, regularPrice, discountedPrice}) => {
  const navigate = useNavigate();


  return ( 
    <div
      onClick={()=> navigate(ROUTES.LISTING_ITEM(_id))}
     className={`h-60 rounded-md bg-white shadow-md overflow-hidden`}>
      <img src={imageUrls ? imageUrls[0] : 'https://static.vecteezy.com/system/resources/previews/004/141/669/original/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg'}
        alt='n/a' className='h-[40%] w-full  object-cover object-center '/>
      <div className='p-2 text-xs  flex flex-col justify-between text-gray-500'>
        <div className=' font-bold text-black text-sm line-clamp-1 capitalize'>{name} </div>
        <div className=' flex py-1 items-center gap-1'> 
         <FaMapMarkerAlt className='text-green-500 '/> <span className='line-clamp-1'>{address}</span>
        </div>
        <div className=' line-clamp-2 leading-4'> 
         <span className='uppercase'>{description[0]}</span>{description.slice(1)}
        </div>
        <div className=' line-clamp-1 text-sm font-bold py-2'>
          $ {regularPrice - discountedPrice}.00 {type === 'rent' && '/ month'}
        </div>
        <div className='flex items-center gap-2 font-bold capitalize text-black'>
          <span>{beds} Beds </span>
          <span>{baths} Baths</span>
        </div>
      </div> 
    </div>
  )
}
