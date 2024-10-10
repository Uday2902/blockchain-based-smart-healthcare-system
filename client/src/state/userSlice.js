import {createSlice} from "@reduxjs/toolkit"

const initialState = {
    signer: null,
    PRcontract: null,
    DRcontract: null,
    HMcontract: null,
    provider: null,
    userAddress: "",
    userId: "",
    userData: null,
    userType: ""
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setSigner: (state, action) => {
            state.signer = action.payload.signer;
        },
        setProvider: (state, action) => {
            state.provider = action.payload.provider;
        },
        setDRContract: (state, action) => {
            state.DRcontract = action.payload.DRcontract;
        },
        setPRContract: (state, action) => {
            state.PRcontract = action.payload.PRcontract;
        },
        setHMContract: (state, action) => {
            state.HMcontract = action.payload.HMcontract;
        },
        setAddress: (state, action) => {
            state.userAddress = action.payload.userAddress;
            console.log("Setting up userAddressw in store");
        },
        setUserId: (state, action) => {
            state.userId = action.payload.userId;
            console.log("Setting up userId in store");
        },
        setUserData: (state, action) => {
            state.userData = action.payload.userData;
            console.log("Setting up userData in store", state.userData);
        },
        setUserType: (state, action) => {
            state.userType = action.payload.userType;
            console.log("Setting up userType in store", state.userType);
        }
    }
})

export const {setAddress, setUserId, setUserData, setDRContract, setHMContract, setPRContract, setProvider, setSigner, setUserType} = userSlice.actions;
export default userSlice.reducer;