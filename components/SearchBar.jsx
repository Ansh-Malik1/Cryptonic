"use client"
import {useState,useEffect} from 'react'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import images from "../assets"
const SearchBar = ({activeSelect,setActiveSelect,handleSearch,handleClearSearch }) => {
    const [search , setSearch] = useState('')
    const [debouncedSearch , setDebouncedSearch] = useState(search)
    const {theme} = useTheme()
    const [toggle,setToggle] = useState(false)
    useEffect(()=>{
        const timer = setTimeout(() => { setSearch(debouncedSearch)},1000)
        return ()=> clearTimeout(timer)
    },[debouncedSearch])

    useEffect(()=>{
        if(search){
            handleSearch(search)
        }
        else{
            handleClearSearch()
        }
    },[search])


    return (
        <>
            <div className='flex-1 flexCenter dark:bg-nft-black-2 bg-white border dark:border-nft-black-2 border-nft-gray-2 px-4 rounded-md py-3'>
                <Image src={images.search} objectFit='contain' width={20} height={20} alt='search' className={theme==='light' && 'filter invert'}/>
                <input type='text' placeholder='Search NFTs Here' className='dark:bg-nft-black-2 bg-white mx-4 w-full dark:text-white text-nft-black-1 font-normal text-xs outline-none'
                    onChange={(e) => setDebouncedSearch(e.target.value)} value={debouncedSearch}
                />
            </div>
            <div onClick={()=>setToggle((prevState)=>!prevState)} className="relative flexBetween ml-4 sm:ml-0 sm:mt-2 min-w-190 cursor-pointer dark:bg-nft-black-2 bg-white border dark:border-nft-black-2 border-nft-gray-2 px-4 sm:py-3 rounded-md">
                <p className='font-poppins text-nft-black-1 dark:text-white font-normal text-xs'>{activeSelect}</p>
                <Image src={images.arrow} objectFit='contain' width={15} height={15} alt='arrow-image' className={theme==='light' && 'filter invert'}/>
                {
                toggle && (
                    <div className='absolute top-full left-0 right-0 w-full mt-3 z-10 dark:bg-nft-black-2 bg-white border dark:border-nft-black-2 border-nft-gray-2 p-4 rounded-md'>{['Recently Added','Price(low to high)','Price(high to low)'].map((item,i)=>(
                        <p onClick={()=>setActiveSelect(item)} key={i} className='font-poppins text-nft-black-1 dark:text-white font-normal text-xs my-3 cursor-pointer'>{item}</p>
                    ))}</div>
                )
                } 
            </div>
           
        </>

    )
}

export default SearchBar
