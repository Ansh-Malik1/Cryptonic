"use client"
import { useState,useEffect,useRef,useContext } from "react";
import { Banner , CreatorCard ,NFTCard  } from "@/components";
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
  const [nfts,setNFTs] = useState([])
  useEffect(()=>{
    fetchNFTs().then((items)=>{
      setNFTs(items);
    })
  },[])
  console.log(nfts)
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

  const topCreators = getCreators(nfts)
  console.log(topCreators)


  return (
    <div className="flex justify-center sm:px-4 p-12">
      <div className='w-full minmd:w-4/5'>
      <Banner
        className=''
        text={'Discover,collect and sell extraoridnary NFTs'}
        childStyles='md:text-4xl sm:text-2xl xs:text-xl text-left '
        parentStyles = 'justify-start mb-6 h-72 sm:h-60 p-12 xs:p-4 xs:h-44 rounded-3xl'
      />
      <div>
        <h1 className='font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl font-semibold ml-4 xs:ml-0'>Best Creators</h1>
        <div className='relative flex-1 max-w-full flex mt-3' ref={parentRef}>
          <div className='flex flex-row w-max overflow-x-scroll no-scrollbar select-none' ref={scrollRef}>
            {topCreators.map((creator,i)=>(
              <CreatorCard key={creator.seller} rank={i+1} creatorImage={images[`creator${i+1}`]} 
              creatorName={shortenAddress(creator.seller)} creatorEths={creator.sum}/>
            ))}
            {/* {[6,7,8,9,10].map((i)=>(
              <CreatorCard key={`creator-${i}`} rank={i} creatorImage={images[`creator${i}`]} 
              creatorName={`0x${MakeId(3)}...${MakeId(3)}`} creatorEths={10-i*0.5}/>
            ))} */}
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
          <h1 className='font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl font-semibold xs:ml-0 flex-1 sm:mb-4'>Hot Bids</h1>
          <div>Search Bar</div>
        </div>
        <div className='mt-3 w-full flex flex-wrap justify-start md:justify-center'>
        {
          nfts.map((nft)=><NFTCard key={nft.tokenId} nft={nft}/>)
        }
          {/* {
            [1,2,3,4,5,6,7,8,9,10].map((i)=>(
              <NFTCard
                key={`nft-${i}`}
                nft={{i,name:`Nifty NFT ${i}`,seller:`0x${MakeId(3)}...${MakeId(3)}`,owner:`0x${MakeId(3)}...${MakeId(3)}`,Description:'Cool NFT on sale',price:(10-i*0.4356).toFixed(2)}}
              />
            ))
          } */}
        </div>
      </div>
      </div>
    </div>
  );
}
