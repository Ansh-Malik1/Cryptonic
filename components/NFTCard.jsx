import React from 'react'
import { useContext } from 'react'
import Image from 'next/image'
import images from "../assets"
import Link from 'next/link'
import { NFTContext } from '@/context/NFTContext'
import { shortenAddress } from '@/utils/shortenAddress'
const NFTCard = ({nft,onProfilePage}) => {
  const {nftCurrency} = useContext(NFTContext)
  return (
    <Link href={{pathname:"/nft-details" , query:{tokenId:nft.tokenId.toString(),name:nft.name,seller:nft.seller,owner:nft.owner,price:nft.price,description:nft.description,image:nft.image,tokenURI:nft.tokenURI}}}>
      <div className='flex-1 min-w-215 max-w-max xs:max-w-full sm:w-full sm:min-w-155 minmd:min-w-256 minlg:min-w-327 xs:min-w-256 dark:bg-nft-black-3 bg-white rounded-2xl p-4 m-4 minlg:m-8 sm:my-2 sm:mx-2 cursor-pointer shadow-md'>
      <div className='relative w-full h-52 sm:h-36 minmd:h-60 minlg:h-300 rounded-2xl overflow-hidden'>
        <Image src={nft.image || images[`nft${nft.i}`]} objectFit="cover" layout="fill" alt='nft' />
      </div>
      <div className='mt-3 flex flex-col'>
        <p className='font-poppins text-nft-black-1 dark:text-white font-semibold text-xs minlg:text-lg'>{nft.name}</p>
        <div className='flexBetween mt-1 minlg:mt-3 flex-row sm:flex-col sm:items-start sm:mt-3'>
          <p className='font-poppins text-nft-black-1 dark:text-white font-semibold text-xs minlg:text-lg'>{nft.price} <span className='normal'>{nftCurrency}</span></p>
          <p className='font-poppins text-nft-black-1 dark:text-white font-semibold text-xs minlg:text-lg'>{nft.seller.length>10 ? shortenAddress(onProfilePage? nft.owner : nft.seller) : nft.seller }</p>
        </div>
      </div>
      </div>
    </Link>
  )
}

export default NFTCard
