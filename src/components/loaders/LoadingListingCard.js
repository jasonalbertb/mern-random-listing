import React from 'react'
import Skeleton from "react-loading-skeleton";
export const LoadingListingCard = () => {
  return (
    <div className='leading-none overflow-hidden h-60 rounded-md mr-4'>
        <Skeleton width="100%" height="100%"/>
    </div>
  )
}
