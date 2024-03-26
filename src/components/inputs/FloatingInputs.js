import React from 'react'

export const FloatingInputs = ({value, setValue, label, type}) => {
  return (
    // scale-[70%] translate-y-[-8px] 
    <div className='border flex relative floatingInput m-1 '>
      <input 
        type={type? type : 'text'}
        placeholder=''
        className='w-full pt-5 py-1 px-3 focus-within:outline-blue-500 '
        value={value} onChange={e=>setValue(e.target.value)}
      />
      <label 
        className='absolute left-3 top-3 text-gray-500 origin-[0] transition-all duration-200 ease-in-out pointer-events-none'
      >{label}</label>
    </div>
  )
}
