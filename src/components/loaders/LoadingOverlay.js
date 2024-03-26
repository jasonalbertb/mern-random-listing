import React from 'react'
import { createPortal } from 'react-dom'

export const LoadingOverlay = () => {
  return (
    <>
        {createPortal(
            <div className='fixed top-0 left-0 w-screen h-screen bg-transparent'>

            </div>,
            document.body
        )}
    </>
  )
}
