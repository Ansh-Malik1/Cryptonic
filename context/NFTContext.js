"use client"
import React ,{useState,useEffect} from "react";
import {axios} from 'axios';
import {ethers} from 'ethers';
import Web3Modal from 'web3modal'
import { MarketAdderess,MarketAdderessAbi } from "./constants";
import { PinataSDK } from "pinata-web3";


const pinata = new PinataSDK({
    pinataJwt: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIwMDliYjc2Zi1hMTI2LTQ1NTgtYTk2Ny02NDBmZTA4ODE2YTgiLCJlbWFpbCI6ImFuc2htYWxpazcxOEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiYzY2NjZjOGMyOGUwNzRlM2ZjZTUiLCJzY29wZWRLZXlTZWNyZXQiOiI5NDU1ZTQ5NDA0NDdmMmViZDBmNDQ0ZDY4ZTRkYjI1ZjJlMWMxNmEwN2EyNTE2YzU4ZTBkZTYwZTczNzY0YjkzIiwiZXhwIjoxNzYwMTc1NzcxfQ.UXsS3r3RXY8eN3k3kdPBatDcLxuiqx-c6mTJe5ha2Gk",
    pinataGateway: "plum-glad-mongoose-908.mypinata.cloud",
});


export const NFTContext = React.createContext();

export const NFTProvider = ({children})=>{
    const [currentAccount,setCurrentAccount] = useState('')
    const nftCurrency = 'MATIC'

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
            return upload;
        } 
        catch (error) {
            console.log(('Error uploading to IPFS', error));
        }
    }
    
    return(
        <NFTContext.Provider value = {{nftCurrency , connectWallet,currentAccount,uploadToIPFS}}>
            {children}
        </NFTContext.Provider>
    )
}