"use client"
import React from 'react'
import { useEffect,useState,useContext } from 'react'
import { NFTContext } from '@/context/NFTContext'
import { Loader, NFTCard } from '@/components'
const ListedNFTs = () => {
    const [nfts,setNFTs] = useState([])
    const [loading,setLoading] = useState(true)
    const {fetchMyNFTsOrListedNFTs} = useContext(NFTContext)
    useEffect(()=>{
        fetchMyNFTsOrListedNFTs('fetchItemsLised').then((items)=>{
          setNFTs(items);
          setLoading(false)
        })
      },[])
    if(loading){
        return(
            <div className='flexStart min-h-screen pt-10'>
                <Loader/>
            </div>
        )
    }
    if(!loading && nfts.length===0){
        return(
            <div className='flexCenter sm:p-4 p-16 min-h-screen'>
                <h1 className='font-poppins dark:text-white text-nft-black-1 text-3xl font-extrabold'>No NFTs Listed for Sale</h1>
            </div>
        )
    }
    return (
        <div className='flex justify-center sm:px-4 p-12 min-h-screen'>
            <div className='w-full minmd:w-4/5'>
                <div className='mt-12 '>
                    <h2>NFTs listed for Sale</h2>
                    <div className='mt-3 w-full flex flex-wrap justify-start md:justify-center'>
                    {
                        nfts.map((nft)=><NFTCard key={nft.tokenId} nft={nft}/>)
                    }

                    </div>
                </div>
            </div>
        </div>
    )
}

export default ListedNFTs
