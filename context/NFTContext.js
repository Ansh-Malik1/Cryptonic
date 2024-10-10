"use client"
import React ,{useState,useEffect} from "react";
import {axios} from 'axios';
import {ethers} from 'ethers';
import Web3Modal from 'web3modal'
import { MarketAdderess,MarketAdderessAbi } from "./constants";

export const NFTContext = React.createContext();

export const NFTProvider = ({children})=>{
    const nftCurrency = 'MATIC'
    return(
        <NFTContext.Provider value = {{nftCurrency}}>
            {children}
        </NFTContext.Provider>
    )
}