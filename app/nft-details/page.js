"use client"
import React from 'react'
import { useEffect,useState,useContext } from 'react'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import { NFTContext } from '@/context/NFTContext'
import { Loader, NFTCard,Button, Modal } from '@/components'
import Image from 'next/image'
import images from "../../assets"
import { shortenAddress } from '@/utils/shortenAddress'

const PaymentBodyComp = ({nft,currency})=>(
  <div className='flex flex-col'>
    <div className='flexBetween'>
      <p className='font-poppins dark:text-white text-nft-black-1 font-semibold text-base minlg:text-xl'>Item</p>
      <p className='font-poppins dark:text-white text-nft-black-1 font-semibold text-base minlg:text-xl'>Sub Total</p>
    </div>
    <div className='flexBetweenStart my-5'>
      <div className='flex-1 flexStartCenter'>
        <div className='relative w-28 h-28'>
          <Image src={nft.image} layout='fill' objectFit='cover' />
        </div>
        <div className='flexCenterStart flex-col ml-5'>
          <p className='font-poppins dark:text-white text-nft-black-1 font-semibold text-sm minlg:text-xl'>{shortenAddress(nft.seller)}</p>
          <p className='font-poppins dark:text-white text-nft-black-1 font-semibold text-sm minlg:text-xl'>{nft.name}</p>
        </div>
      </div>
      <div>
        <p className='font-poppins dark:text-white text-nft-black-1 font-normal text-sm minlg:text-xl'>{nft.price} <span className='font-semibold'>{currency}</span></p>
      </div>
    </div>
    <div className='flexBetween mt-10 '>
        <p className='font-poppins dark:text-white text-nft-black-1 font-base text-sm minlg:text-xl'>Total</p>
        <p className='font-poppins dark:text-white text-nft-black-1 font-normal text-sm minlg:text-xl'>{nft.price} <span className='font-semibold'>{currency}</span></p>      </div>
  </div>
)

const NFTDetails = () => {
  const {currentAccount , nftCurrency, buyNFTs} = useContext(NFTContext)
  const [loading,setLoading] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()
  const [paymentModal,setPaymentModal] = useState(false)
  const [nft ,setNFT] = useState({image:"",tokenId:"",name:"",description:"",owner:"",seller:"",price:"",tokenURI:""})
  const [successModal , setSuccessModal] = useState(false)
  const checkout = async ()=>{
    await buyNFTs(nft)
    setPaymentModal(false)
    setSuccessModal(true)
  }

  useEffect(()=>{
    setNFT({
      image:searchParams.get('image'),
      tokenId:searchParams.get('tokenId'),
      name:searchParams.get('name'),
      description:searchParams.get('description'),
      owner:searchParams.get('owner'),
      seller:searchParams.get('seller'),
      price:searchParams.get('price'),
      tokenURI:searchParams.get('tokenURI')
    })
    setLoading(false)
  },[searchParams])
  return ( 
    <div className='flex relative justify-center md:flex-col min-h-screen '>
      <div className='lg:mt-12 relative flex-1 flexCenter sm:px-4 p-12 border-r md:border-r-0 md:border-b dark:border-nft-black-1 border-nft-gray-1 '>
        <div className='relative w-557 minmd:w-2/3 minmd:h-2/3 sm:w-full sm:h-300 h-557 '>
          <Image src={nft.image} alt='nftImage' objectFit='cover' className='rounded-xl shadow-lg' layout='fill' />
        </div>
      </div>
      <div className='lg:mt-16 flex-1 justify-start sm:px-4 p-12 sm:pb-4'>
        <div className='flex flex-row sm:flex-col'>
          <h2 className='font-poppins text-nft-dark-black-1 dark:text-nft-gray-1 font-semibold text-2xl minlg:text-3xl'>{nft.name}</h2>
        </div>
        <div className='mt-10'>
          <p className='font-poppins text-nft-dark-black-1 dark:text-nft-gray-1 text-xs minlg:text-base font-normal'>Creator</p>
          <div className='flex flex-row items-center mt-3'>
            <div className='relative w-12 h-12 minlg:w-20 minlg:h-20 mr-2 '>
              <Image src={images.creator1} objectFit='cover' className='rounded-full'/>
            </div>
            <p className='font-poppins text-nft-dark-black-1 dark:text-nft-gray-1 text-xs minlg:text-base font-semibold'>{shortenAddress(nft.seller)}</p>
          </div>
        </div>
        <div className='mt-10 flex flex-col'>
          <div className='w-full border-b flex flex-row border-nft-gray-1 dark:border-nft-black-1'>
            <p className='font-poppins text-nft-dark-black-1 dark:text-nft-gray-1 text-base minlg:text-lg mb-2 font-medium'>Details</p>
          </div>
          <div className='mt-3'>
            <p className='font-poppins text-nft-dark-black-1 dark:text-nft-gray-1 text-base mb-2 font-normal '>{nft.description}</p>
          </div>
        </div>
        <div className='flex flex-row sm:flex-col mt-10'>
        {
          currentAccount === nft.seller.toLowerCase() ?
          (<p className='font-poppins text-nft-dark-black-1 dark:text-nft-gray-1 text-base mb-2 font-normal border border-gray p-2'>You Cannot buy your own NFTs</p>)
          :
          currentAccount===nft.owner.toLowerCase() ? 
          (<Button text={'List on MarketPlace'} classStyles='mr-5 sm:mr-0 sm:mb-5 rounded-xl' handleClick={()=> router.push(`/resell-nft?tokenId=${nft.tokenId}&tokenURI=${nft.tokenURI}`)}/>) :
          (
            <Button text={`Buy for ${nft.price} ${nftCurrency}`} 
              classStyles='mr-5 sm:mr-0 rounded-xl'
              handleClick={()=> setPaymentModal(true)}
            />
          )
        }
        </div>
      </div>
      {
        paymentModal && 
          <Modal header='Check Out' body={<PaymentBodyComp nft={nft} currency={nftCurrency}/>} 
          footer={(
            <div className='flex flex-row sm:flex-col'>
              <Button text='Check Out' classStyles='mr-5 sm:mb-5 sm:mr-0 rounded-xl' handleClick={checkout}/>
              <Button text="Cancel" classStyles="rounded-xl" handleClick={() => setPaymentModal(false)} />
            </div>
          )} 
          handleClose={()=>setPaymentModal(false)}/>
      }
      {
        successModal && 
        <Modal
          header="Payment Successful"
          body={(
            <div className="flexCenter flex-col text-center" onClick={() => setSuccessModal(false)}>
              <div className="relative w-52 h-52">
                <Image src={nft.image} objectFit="cover" layout="fill" />
              </div>
              <p className="font-poppins dark:text-white text-nft-black-1 mt-10 text-sm minlg:text-xl font-normal">You successfully purchased <span className="font-semibold">{nft.name} </span>from <span className="font-semibold">{shortenAddress(nft.seller)}</span></p>
            </div>
          )}
          footer={(
            <div className="flexCenter flex-col">
              <Button
                text="Check it out"
                classStyles="sm:mb-5 sm: mr-0 rounded-xl"
                handleClick={() => router.push('/my-nfts')}
              />
            </div>
          )}
          handleClose={() => setSuccessModal(false)}
        />
      }
    </div>
  )
}

export default NFTDetails
