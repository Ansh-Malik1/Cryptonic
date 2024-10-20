"use client"
import React from 'react'
import { useEffect,useState,useContext } from 'react'
import { NFTContext } from '@/context/NFTContext'
import { Loader, NFTCard,Banner, Button, Input } from '@/components'
import Image from 'next/image'
import images from "../../assets"
import { shortenAddress } from '@/utils/shortenAddress'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import axios from 'axios'
const ResellNFT = () => {
  const {createSale} = useContext(NFTContext)
  const searchParams = useSearchParams()
  const tokenId = searchParams.get('tokenId')
  const tokenURI = searchParams.get('tokenURI')
  const router = useRouter()
  const [price, setPrice] = useState('')
  const [image,setImage] = useState('')
  const [loading,setLoading] = useState(true)
  const fetchNFT = async ()=>{
    const {data} = await axios.get(tokenURI)
    let k = Object.keys(data)
    const result = JSON.parse(k[0])
    setPrice(result.price)
    setImage(result.image)
    setLoading(false)
  }
  useEffect(()=>{
    if(tokenURI) fetchNFT()
  },[tokenURI])

  const resell = async ()=>{
    await createSale(tokenURI,price,true,tokenId)

    router.push('./')
  }
  if(loading){
    return(
        <div className='flexStart min-h-screen pt-10'>
            <Loader/>
        </div>
    )
  }
  return (
    <div className='flex justify-center sm:px-4 p-12'>
      <div className='w-3/5 md:w-full lg:mt-12'>
        <h1 className='font-poppins dark:text-white text-nft-black-1 font-semibold text-2xl'>Resell NFT</h1>
        <Input
          inputType='number'
          title='price'
          placeholder='NFT Price'
          handleClick={(e)=>setPrice(e.target.value)}
        />
        {
          image && <Image src={image} width={350} height={350} className='rounded mt-4'/>
        }
        <div className='mt-7 w-full flex justify-end '>
          <Button
            text='List NFT'
            classStyles='rounded-xl'
            handleClick={resell}
          />
        </div>
      </div>
    </div>
  )
}

export default ResellNFT
