import React from 'react'
import { FaSpinner } from "react-icons/fa";


 export const ReactLoader = () => {
  return (
    <div className='w-screen h-screen grid place-content-center bg-gray-100'>
      <FaSpinner className="w-8 h-8 text-gray-400 animate-spin" />
    </div>
  )
}
