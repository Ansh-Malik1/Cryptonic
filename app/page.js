"use client"
import { useState,useEffect,useRef,useContext } from "react";
import { Banner , CreatorCard ,Loader,NFTCard, SearchBar  } from "@/components";
import { MakeId } from "@/utils/makeId";
import images from "../assets"
import Image from "next/image";
import { useTheme } from "next-themes";
import { NFTContext } from "@/context/NFTContext";
import { getCreators } from "@/utils/getTopCreators";
import { shortenAddress } from "@/utils/shortenAddress";
export default function Home() {
  const parentRef = useRef(null)
  const scrollRef = useRef(null)
  const [hideButtons, setHideButtons] = useState(false);
  const {theme} = useTheme()
  const {fetchNFTs} = useContext(NFTContext)
  const [nftsCopy,setNftCopy] = useState([])
  const [nfts,setNFTs] = useState([])
  const [activeSelect,setActiveSelect] = useState("Recently Added")
  const [loading,setLoading] = useState(true)
  useEffect(()=>{
    fetchNFTs().then((items)=>{
      setNFTs(items);
      setNftCopy(items)
      setLoading(false)
    })
  },[])
  const handleScroll = (direction)=>{
    const {current} = scrollRef
    const scrollAmount = window.innerWidth > 1800 ? 270 : 210;
    if(direction==='left'){
      current.scrollLeft-=scrollAmount
    }
    else{
      current.scrollLeft+=scrollAmount
    }
  }
  
  const isScrollable = ()=>{
    const {current} = scrollRef
    const {current:parentRefCurrent} = parentRef
    if(current?.scrollWidth >= parentRefCurrent?.offsetWidth){
      setHideButtons(false)
    }
    else{
      setHideButtons(true)
    }
  }
  useEffect(()=>{
    isScrollable() 
    window.addEventListener('resize',isScrollable)
    return ()=>{
      window.removeEventListener('resize',isScrollable)
    }
  })

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


  const topCreators = getCreators(nftsCopy)


  return (
    <div className="flex justify-center sm:px-4 p-12">
      <div className='w-full minmd:w-4/5'>
      <Banner
        className=''
        text={<>Discover,collect and sell <br/>extraoridnary NFTs</>}
        childStyles='md:text-4xl sm:text-2xl xs:text-xl text-left '
        parentStyles = 'justify-start mb-6 h-72 sm:h-60 p-12 xs:p-4 xs:h-44 rounded-3xl'
      />
      {
        !loading && !nfts.length ? (<h1 className="font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl font-semibold ml-4 xs:ml-0">No NFTs for sale</h1>) : loading ? <Loader/> : 
        (
          <>
            <div>
              <h1 className='font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl font-semibold ml-4 xs:ml-0'>Top Sellers</h1>
              <div className='relative flex-1 max-w-full flex mt-3' ref={parentRef}>
              <div className='flex flex-row w-max overflow-x-scroll no-scrollbar select-none' ref={scrollRef}>
              {topCreators.map((creator,i)=>(
                <CreatorCard key={creator.seller} rank={i+1} creatorImage={images[`creator${i+1}`]} 
                creatorName={shortenAddress(creator.seller)} creatorEths={creator.sum}/>
              ))}
              {!hideButtons && <>
                <div className='absolute w-8 h-8 minlg:w-12 minglg:h-12 top-45 cursor-pointer left-0' onClick={()=>handleScroll('left')}>
                  <Image src={images.left} layout="fill" objectFit="contain" alt="leftArrow" className={theme === 'light' && 'filter invert'} />
                </div>
                <div className='absolute w-8 h-8 minlg:w-12 minglg:h-12 top-45 cursor-pointer right-0' onClick={()=>handleScroll('right')}>
                  <Image src={images.right} layout="fill" objectFit="contain" alt="rightArrow" className={theme === 'light' && 'filter invert'} />
                </div>
              </>}
            </div>
          </div>
        </div>
        <div className='mt-10'>
          <div className='flexBetween mx-4 xs:mx-0 minglg:mx-8 sm:flex-col sm:items-start'>
            <h1 className='font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl font-semibold xs:ml-0 flex-1 sm:mb-4'>TOP NFTs</h1>
            <div className="flex-2 sm:w-full flex flex-row sm:flex-col "><SearchBar activeSelect={activeSelect} setActiveSelect={setActiveSelect} handleSearch={onHandleSearch} handleClearSearch={onClearSearch} /></div>
          </div>
          <div className='mt-3 w-full flex flex-wrap justify-start md:justify-center'>
          {
            nfts.map((nft)=><NFTCard key={nft.tokenId} nft={nft}/>)
          }
          </div>
        </div>
          </>
        )
      }
      </div>
    </div>
  );
}
