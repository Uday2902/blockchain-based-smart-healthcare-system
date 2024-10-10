import { ethers } from 'ethers';
import { useDispatch, useSelector } from 'react-redux';
import { setMetaMaskConnectionStatus } from '../state/metaMaskSlice';
import { setAddress, setUserId, setUserData, setDRContract, setHMContract, setPRContract, setProvider, setSigner, setUserType } from '../state/userSlice';
import DRContractABI, { DRContractAddress } from "../../contracts/Doctor Registry/DRContractABI";
import PRContractABI, { PRContractAddress } from "../../contracts/Patient Registry/PRContractABI";
import HMContractABI, { HMContractAddress } from "../../contracts/Healthcare Management/HMContractABI";
import axios from "axios"
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useWallet = () => {

    const navigate = useNavigate();

    const dispatch = useDispatch();
    const signer = useSelector((state) => { return state.user.signer })
    const provider = useSelector((state) => { return state.user.provider })
    const DRcontract = useSelector((state) => { return state.user.DRcontract })
    const PRcontract = useSelector((state) => { return state.user.PRcontract })
    // const HMcontract = useSelector((state) => { return state.user.HMcontract })
    const userType = useSelector((state) => { return state.user.userType })
    const isMetaMaskConnected = useSelector((state) => { return state.metamask.isMetaMaskConnected })

    useEffect(() => {
        console.log("Inside useeffect -> ", userType)
    }, [userType])

    const handleConnectWallet = async () => {
        try {
            if (window.ethereum && window.ethereum.isMetaMask) {

                await window.ethereum.request({ method: 'eth_requestAccounts' });
                const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                const _walletAddress = await signer.getAddress();
                console.log("Signer address -> ", signer);
                console.log("Wallet address -> ", _walletAddress);
                dispatch(setMetaMaskConnectionStatus({isMetaMaskConnected: true}));
                const network = await provider.getNetwork();
                if (network.name !== "sepolia") {
                    alert("Please connect to Sepolia Test network");
                    return;
                } else {
                    // navigate("/");
                }

                const DR_contract = new ethers.Contract(DRContractAddress, DRContractABI, signer);
                const PR_contract = new ethers.Contract(PRContractAddress, PRContractABI, signer);
                // const HM_contract = new ethers.Contract(HMContractAddress, HMContractABI, signer);

                dispatch(setSigner({ signer: _walletAddress }));
                // dispatch(setProvider({ provider: provider }));
                console.log("Before storing to store DRContract")
                dispatch(setDRContract({ DRcontract: DR_contract }));
                dispatch(setPRContract({ PRcontract: PR_contract }));
                // dispatch(setHMContract({ DRcontract: HM_contract }));
                // dispatch(setCurrentNetwork({ currentNetwork: network.name }));
                // dispatch(setMetamaskStatus({ isMetaMaskConnected: true }));

                const filter = {
                    address: "0x8c779cf5830b96222410137a1f5946dc5cb3973f",
                    fromBlock: 0,
                    toBlock: 'latest',
                };
                const logs = await provider.getLogs(filter);
                console.log("Logs -> ", logs);
                let isPatient;
                try{
                    isPatient = await PR_contract.getPatientDetails(_walletAddress);
                }catch(err){
                    
                    console.log("Patient err -> ", err);
                }
                if(isPatient){
                    dispatch(setUserType({ userType: 'Patient' }));
                    dispatch(setUserData({ userData: isPatient }));
                    navigate('/patient-table');
                }
                let isDoctor;
                try{
                    isDoctor = await DR_contract.getDoctorDetails(_walletAddress);
                }catch(err){
                    console.log("ISDOCTOR -> ", isDoctor);
                    console.log("Doctor err -> ", err);
                }
                if(isDoctor){
                    dispatch(setUserType({ userType: 'Doctor' }));
                    dispatch(setUserData({ userData: isDoctor }));
                    navigate('/doctor-table');
                }
                if(isPatient === undefined && isDoctor === undefined) navigate('/register');
                // console.log(await DR_contract.getDoctorDetails(_walletAddress));
                // console.log("From doctor ", await DR_contract.registerDoctor("Uday1", "Special", "0101", "Male"));

                // try{
                //     console.log("Making request");
                //     await axios.post("http://localhost:5000/search", { hash: _walletAddress })
                //         .then(res => {
                //             console.log("userType response -> ", res.data.userType);
                //             dispatch(setUserType({userType: res.data.userType}));
                //             console.log("userType -> ", userType)
                //         })
                //         .catch(err => {
                //             console.log("User not found ", err);
                //             navigate("/register");
                //         });
                //     // let response = await DR_contract.getDoctorDetails(_walletAddress);
                // }catch(err){
                //     console.log("err", err);
                // }   
                // console.log("From doctor response ", response);
                // console.log("From patient ", await PR_contract.patients[_walletAddress])

            } else {
                console.error('MetaMask is not installed or not accessible.');
                alert('MetaMask is not installed or not accessible');
            }
        } catch (error) {
            console.error('Error connecting MetaMask:', error);
        }
    };


    // const getDoctorDetails = async (address) => {
    //     if (signer) {
    //         return await ethers.formatEther(await contract.balanceOf(signer.address));
    //     }
    // };

    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    }


    const getAllContractEvents = async () => {
        try {
            const filter = {
                address: contractAddress,
                fromBlock: 0,
                toBlock: 'latest',
            };
            const logs = await provider.getLogs(filter);

            const allTransactions = await logs.map(async (transaction) => {
                const blockDetails = await provider.getBlock(transaction.blockNumber)
                return {
                    from: (transaction.topics[1]).replace(/^0x0+/, '0x'),
                    to: (transaction.topics[2]).replace(/^0x0+/, '0x'),
                    amount: await ethers.formatEther(transaction.data),
                    date: await formatDate(blockDetails.date)
                }
            });

            return allTransactions;

        } catch (error) {
            console.error('Error fetching contract events:', error);
            return [];
        }
    };

    const getUserTransactions = async (signerAddress) => {
        try {
            const filter = {
                address: contractAddress,
                fromBlock: 0,
                toBlock: 'latest',
            };
            const logs = await provider.getLogs(filter);

            const filteredTransactions = await Promise.all(logs.map(async (transaction) => {
                const blockDetails = await provider.getBlock(transaction.blockNumber);
                const from = transaction.topics[1].replace(/^0x0+/, '0x');
                const to = transaction.topics[2].replace(/^0x0+/, '0x');
                const amount = await ethers.formatEther(transaction.data);
                const date = await formatDate(blockDetails.date);

                // Check if the signerAddress is either the sender or receiver
                // SoR, SoRAddress, amount, date
                if (from.toLowerCase() === signerAddress.toLowerCase()) {
                    return {
                        SoR: "Sent",
                        SoRAddress: to,
                        amount: amount,
                        date: date
                    };
                } else if (to.toLowerCase() === signerAddress.toLowerCase()) {
                    return {
                        SoR: "Received",
                        SoRAddress: from,
                        amount: amount,
                        date: date
                    }
                } else {
                    return null;
                }
            }));

            // Filter out null entries (transactions not involving the signer)
            const allTransactions = filteredTransactions.filter(transaction => transaction !== null);

            return allTransactions;

        } catch (error) {
            console.error('Error fetching contract events:', error);
            return [];
        }
    };

    return { handleConnectWallet, getAllContractEvents, getUserTransactions };
};
