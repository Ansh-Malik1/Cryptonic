"use client"
import { useState,useEffect,useContext } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import Link from 'next/link'
import images from "../assets"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faSun,faMoon} from "@fortawesome/free-solid-svg-icons";
import { Button } from '.'
import { NFTContext } from '@/context/NFTContext'

const MenuItems  = ({isMobile , active , setActive})=>{
    const generateLink = (i) => {
        switch (i) {
          case 0: return '/';
          case 1: return '/listed-nfts';
          case 2: return '/my-nfts';
          default: return '/';
        }
    }
    return (
        <ul className = {`list-none flexCenter flex-row ${isMobile && 'flex-col h-full'}`}>
        {['Explore NFTs' , 'Listed NFTs', 'My NFTs'].map((ele,i)=>(
            <li key={i}
            onClick={()=>setActive(ele)}
            className={`flex flex-row items-center font-poppins font-semibold text-base dark:hover:text-white hover:text-nft-dark mx-3
            ${active===ele ? 'dark:text-white text-nft-black-1' : 'dark:text-nft-gray-3 text-nft-gray-2'}`}
            >
            <Link href={generateLink(i)}>{ele}</Link>
            </li>
        ))}
        </ul>
    )
}

const ButtonGroup = ({setActive,router})=>{
    const hasConnected = true
    const {connectWallet,currentAccount} = useContext(NFTContext)
    return currentAccount ? (
        <Button text={"Create"} classStyles="mx-2 rounded-xl" handleClick = {()=>{
        setActive('')
        router.push('/create-nfts')
        }}></Button>
    ) :
    (
        <Button text={"Connect"} classStyles="mx-2 rounded-xl" handleClick={connectWallet}></Button>
    )

}

const Navbar = () => {
    const{theme,setTheme} = useTheme()
    console.log({theme})
    const [active , setActive] = useState('Explore NFTs')
    const router = useRouter()
    const [isOpen , setIsOpen] = useState(false)
    return (
        <nav className='flex-between w-full fixed flex z-10 p-4 flex-row items-center border-b dark:bg-nft-dark bg-white dark:border-nft-black-1 border-nft-gray-1'>
        <div className="flex flex-1 flex-row justify-start">
            <Link href="/">
            <div className='flex items-center md:hidden cursor-pointer'>
                <Image src={images.logo02} objectFit='contain' width={32} height={32} alt="logo"/>
                <p className="dark:text-white text-nft-black-1 font-semibold text-lg ml-1 ">Cryptonic</p>
            </div>
            </Link>
            <Link href="/">
            <div className='hidden md:flex' onClick={()=>{}}>
            <Image src={images.logo02} objectFit='contain' width={32} height={32} alt="logo"/>
            </div>
            </Link>
        </div>
        <div className='flex flex-initial justify-end flex-row items-center'>
            <div className=' flex-end items-center mr-2'>
            <input type='checkbox' className='checkbox' id='checkbox' onChange={()=> setTheme(theme==='light' ? 'dark' : 'light' )}/>
            <label htmlFor="checkbox" className="flexBetween cursor-pointer w-8 h-4 bg-black rounded-2xl p-1 relative label  ">
                <FontAwesomeIcon icon={faSun} />
                <FontAwesomeIcon icon={faMoon} />
                <div className='w-3 h-3 absolute bg-white rounded-full ball'/>
            </label> 
            </div>
            <div className='md:hidden flex'>
            <MenuItems active={active} setActive={setActive}/>  
            <div className='ml-4'>
                <ButtonGroup setActive={setActive} router={router}/>
            </div>  
             </div>
        </div>
        <div className = 'hidden md:flex ml-2'>
        {
            isOpen ? (<Image height={25} width={25} src={images.cross} onClick={()=>setIsOpen(false)} className={theme === 'light' && 'filter invert'}/>) : 
            (<Image height={25} width={25} src={images.menu} onClick={()=>setIsOpen(true)} className={theme === 'light' && 'filter invert'}/>)
        }
        {
            isOpen && (
            <div className='fixed inset-0 top-65 dark:bg-nft-dark bg-white z-10 nav-h flex justify-between flex-col'>
                <div className='flex-1 p-4'>
                <MenuItems active={active} setActive={setActive} isMobile/>
                </div>
                <div className='p-4 border-t dark:border-ntf-black-1 border-nft-gray-1'>
                <ButtonGroup setActive={setActive} router={router}/>
                </div>
            </div>
            )
        }
        </div>
        </nav>
    )
}

export default Navbar
