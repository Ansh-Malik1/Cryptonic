import React from 'react'

const Banner = ({parentStyles,childStyles,text}) => {
  return (
    <div className={`relative w-full flex items-center z-0 overflow-hidden nft-gradient mt-12 ${parentStyles}`}>
      <p className={`font-bold text-5xl font-poppins leading-70 ${childStyles}`}>{text}</p>
      <div className='absolute w-48 h-48 sm:w-32 sm:h-32 rounded-full white-bg -top-9 -left-16 -z-5'/>
      <div className='absolute w-72 h-72 sm:w-48 sm:h-48 rounded-full white-bg -bottom-24 -right-16 -z-5'/>
    </div>
  )
}

export default Banner
