"use client"
import React ,{useState,useEffect} from "react";
import {axios} from 'axios';
import {ethers} from 'ethers';
import Web3Modal from 'web3modal'
import { MarketAdderess,MarketAdderessAbi } from "./constants";

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
    

    return(
        <NFTContext.Provider value = {{nftCurrency , connectWallet,currentAccount}}>
            {children}
        </NFTContext.Provider>
    )
}