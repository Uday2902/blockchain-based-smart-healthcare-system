import {createSlice} from "@reduxjs/toolkit"

const initialState = {
    isMetaMaskConnected: false
}

export const metaMaskSlice = createSlice({
    name: "metamask",
    initialState,
    reducers: {
        setMetaMaskConnectionStatus: (state, action) => {
            state.isMetaMaskConnected = action.payload.isMetaMaskConnected
            console.log("Setting up isMetaMaskConnected in store");
        }
    }
});

export const {setMetaMaskConnectionStatus} = metaMaskSlice.actions;
export default metaMaskSlice.reducer;