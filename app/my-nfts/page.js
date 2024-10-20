"use client"
import React from 'react'
import { useEffect,useState,useContext } from 'react'
import { NFTContext } from '@/context/NFTContext'
import { Loader, NFTCard,Banner, SearchBar } from '@/components'
import Image from 'next/image'
import images from "../../assets"
import { shortenAddress } from '@/utils/shortenAddress'

const MyNFTs = () => {
    const [nfts,setNFTs] = useState([])
    const [nftsCopy,setNftCopy] = useState([])
    const [loading,setLoading] = useState(true)
    const {fetchMyNFTsOrListedNFTs , currentAccount} = useContext(NFTContext)
    const [activeSelect,setActiveSelect] = useState("Recently Added")
    useEffect(()=>{
        fetchMyNFTsOrListedNFTs('').then((items)=>{
          setNFTs(items);
          setNftCopy(items)
          setLoading(false)
        })
    },[])

    useEffect(()=>{
      const sortedNfts = [...nfts]
      switch(activeSelect){
        case 'Price(low to high)':
          setNFTs(sortedNfts.sort((a,b) => a.price-b.price)) 
          break;
        case 'Price(high to low)':
          setNFTs(sortedNfts.sort((a, b) => b.price - a.price));
          break;
        case 'Recently Added':
          setNFTs(sortedNfts.sort((a, b) => parseInt(b.tokenId) - parseInt(a.tokenId)));
          break;
        default:
          setNFTs(nfts)
          break;
      }
    },[activeSelect])

    if(loading){
      return(
          <div className='flexStart min-h-screen pt-10'>
              <Loader/>
          </div>
      )
    }

    const onHandleSearch = (value)=>{
      const filteredNFTs = nfts.filter(({name})=> name.toLowerCase().includes(value.toLowerCase()))
      if(filteredNFTs.length>0){
        setNFTs(filteredNFTs)
      }
      else{
        setNFTs(nftsCopy)
      }
    }

    const onClearSearch = ()=>{
      if(nfts.length && nftsCopy.length){
        setNFTs(nftsCopy)
      }
    }

    // if(!loading && nfts.length===0){
    //     return(
    //         <div className='flexCenter sm:p-4 p-16 min-h-screen'>
    //             <h1 className='font-poppins dark:text-white text-nft-black-1 text-3xl font-extrabold'>User has no NFTs</h1>
    //         </div>
    //     )
    // }
  
  return (
    <div className='w-full flex justify-start items-center flex-col min-h-screen'>
      <div className='w-full flexCenter flex-col mt-4'>
        <Banner text="You Nifty NFTs" parentStyles={'px-4 h-80 justify-center'} childStyles={'text-center mb-4'}/>
        <div className='flexCenter flex-col -mt-20 z-0'>
        <div className='flexCenter w-40 h-40 sm:w-36 sm:h-36 p-1 bg-nft-black-2 rounded-full'>
          <Image src={images.creator1} objectFit='cover' className='rounded-full object-cover'/>
        </div>
        <p className='font-poppins dark:text-white text-nft-black-1 font-semibold text-2xl mt-6'>{shortenAddress(currentAccount)}</p>
        </div>
      </div>
      {
        !loading && !nfts.length && !nftsCopy.length ? (
          <div className='flexCenter sm:p-4 p-16 '>
            <h1 className='font-poppins dark:text-white text-nft-black-1 font-extrabold text-2xl'>No NFTs Owned</h1>
          </div>
        ) :
        (
          <div className='flexCenter flex-col sm:px-4 p-12 w-full minmd:w-4/5'>
            <div className='flex-1 w-full flex-row sm:flex-col px-4 xs:px-0 minlg:px-8 flex'><SearchBar activeSelect={activeSelect} setActiveSelect={setActiveSelect} handleSearch={onHandleSearch} handleClearSearch={onClearSearch} /></div>
            <div className='mt-4 flex w-full flex-wrap '>
              {
                nfts.map((nft)=><NFTCard key={nft.token} nft={nft} onProfilePage={true}/>)
              }
            </div>
          </div> 
        )
      }
    </div>
  )
}

export default MyNFTs
