import React from 'react'

const Button = ({text , classStyles,handleClick}) => {
  return (
    <button
    type='button' onClick={handleClick} className = {`nft-gradient  text-sm minlg:text-lg py-2 px-6 minlg:px-8 font-poppins font-semibold text-white ${classStyles}`}
    >
    {text}
    </button>   
  )
}

export default Button
