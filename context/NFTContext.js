"use client"
import React ,{useState,useEffect} from "react";
import axios from 'axios';
import {ethers} from 'ethers';
import Web3Modal from 'web3modal'
import { MarketAdderess,MarketAdderessAbi } from "./constants";
import { PinataSDK } from "pinata-web3";
import { JsonRpcProvider } from 'ethers';

const pinata = new PinataSDK({
    pinataJwt: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIwMDliYjc2Zi1hMTI2LTQ1NTgtYTk2Ny02NDBmZTA4ODE2YTgiLCJlbWFpbCI6ImFuc2htYWxpazcxOEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiYzY2NjZjOGMyOGUwNzRlM2ZjZTUiLCJzY29wZWRLZXlTZWNyZXQiOiI5NDU1ZTQ5NDA0NDdmMmViZDBmNDQ0ZDY4ZTRkYjI1ZjJlMWMxNmEwN2EyNTE2YzU4ZTBkZTYwZTczNzY0YjkzIiwiZXhwIjoxNzYwMTc1NzcxfQ.UXsS3r3RXY8eN3k3kdPBatDcLxuiqx-c6mTJe5ha2Gk",
    pinataGateway: "plum-glad-mongoose-908.mypinata.cloud",
});


export const NFTContext = React.createContext();

const fetchContract  = (signerOrProvider) => new ethers.Contract(MarketAdderess,MarketAdderessAbi,signerOrProvider)

export const NFTProvider = ({children})=>{
    const [currentAccount,setCurrentAccount] = useState('')
    const nftCurrency = 'ETH'

    const checkIfWalletConnected = async ()=>{
        if(!window.ethereum) return alert("Please install metamask");
        const accounts = await window.ethereum.request({method:'eth_accounts'})

        if(accounts.length){
            setCurrentAccount(accounts[0])
        }
        else{
            console.log("No accounts found")
        }
    }
    useEffect(() => {
        checkIfWalletConnected();
    }, []);

    const connectWallet = async ()=>{
        if (!window.ethereum) {
            return alert('Please install MetaMask');
          }
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          setCurrentAccount(accounts[0]);
          window.location.reload();
    };

    const uploadToIPFS = async (file,setFileUrl)=>{
        try {
            const upload = pinata.upload.file(file)
            return upload 
        } 
        catch (error) {
            console.log(('Error uploading to IPFS', error));
        }
    }

    const createNFT  = async (formInput , fileUrl , router)=>{
        const {name,description,price} = formInput

        if(!name || !description || !price || !fileUrl){
            return alert('Please fill in all fields')
        }

        const data = JSON.stringify({
            name,
            description,
            price,
            image:fileUrl
        })
        try{
            const response = await axios.post('https://api.pinata.cloud/pinning/pinJSONToIPFS', data, {
                headers: {
                  pinata_api_key: 'c6666c8c28e074e3fce5',
                  pinata_secret_api_key: '9455e4940447f2ebd0f444d68e4db25f2e1c16a07a2516c58e0de60e73764b93'
                }
            });
            let url
            url = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`
            await createSale(url,price)
            router.push('/')
        }
        catch(err){
            console.log(err,"error in createNFT function")
        }
    }

    const createSale = async (url,inputPrice)=>{
        try{
            const web3modal = new Web3Modal()
            const connection = await web3modal.connect()
            const provider = new ethers.BrowserProvider(connection)
            const signer = await provider.getSigner()
            const price = ethers.parseUnits(inputPrice,'ether')
            const contract = fetchContract(signer)
            const lprice = await contract.getListingPrice()
            const transaction = await contract.createToken(url,price,{value:lprice.toString()})

            await transaction.wait()
       }
       catch(error){
        console.log(error,'error in createSale')
       }
    } 
    
    const fetchNFTs =  async ()=>{
        try{
            const provider = new JsonRpcProvider()
            const contract = fetchContract(provider)
            const data = await contract.fetchMarketItems()
            const items = await Promise.all(data.map(async({tokenId,seller,owner,price:unformattedPrice})=>{
                const tokenURI = await contract.tokenURI(tokenId)
                const {data} = await axios.get(tokenURI)
                let k = Object.keys(data)
                const result = JSON.parse(k[0])
                const {image,name,description} = result
                const price = ethers.formatUnits(unformattedPrice.toString(),'ether')    
                return {
                    price,
                    tokenId,
                    seller,
                    owner,
                    image,
                    description,
                    name,
                    tokenURI
                }
            }))
            return items
        }
        catch(err){
            console.log(err,"error")
        }
        
    }

    const fetchMyNFTsOrListedNFTs = async (type) =>{
        const web3modal = new Web3Modal()
        const connection = await web3modal.connect()
        const provider = new ethers.BrowserProvider(connection)
        const signer = await provider.getSigner()
        const contract = fetchContract(signer)
        const data = type==='fetchItemsLised'?
        await contract.fetchItemsListed():
        await contract.fetchMyNFTs()
        console.log(data)
        const items = await Promise.all(data.map(async({tokenId,seller,owner,price:unformattedPrice})=>{
            const tokenURI = await contract.tokenURI(tokenId)
            const {data} = await axios.get(tokenURI)
            
            let k = Object.keys(data)
            const result = JSON.parse(k[0])
            const {image,name,description} = result
            const price = ethers.formatUnits(unformattedPrice.toString(),'ether')    
            return {
                price,
                tokenId,
                seller,
                owner,
                image,
                description,
                name,
                tokenURI
            }
        }))
        return items
    }

    const buyNFTs = async (nft)=>{
        console.log(nft.price)
        console.log(nft.tokenId)
        const web3modal = new Web3Modal()
        const connection = await web3modal.connect()
        const provider = new ethers.BrowserProvider(connection)
        const signer = await provider.getSigner()
        const contract = fetchContract(signer)
       
        const price = ethers.parseEther(nft.price.toString())

        const transaction = await contract.createMarketSale(nft.tokenId, { value: price });
        await transaction.wait()

    }

    return(
        <NFTContext.Provider value = {{nftCurrency , connectWallet,currentAccount,uploadToIPFS,createNFT,fetchNFTs,fetchMyNFTsOrListedNFTs,buyNFTs}}>
            {children}
        </NFTContext.Provider>
    )
}