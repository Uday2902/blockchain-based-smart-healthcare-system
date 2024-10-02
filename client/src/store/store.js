
import {configureStore} from "@reduxjs/toolkit"
import metaMaskReducer from "../state/metaMaskSlice";
import userReducer from "../state/userSlice";

const store = configureStore({
    reducer: {
        metamask: metaMaskReducer,
        user: userReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false})
})

export default store;