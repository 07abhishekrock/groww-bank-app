import { combineReducers, configureStore } from "@reduxjs/toolkit";
import BankSlice from "../Slices/BankSlice";
import PaginationSlice from "../Slices/PaginationSlice";

const store = configureStore({
    reducer : combineReducers({
        bankList : BankSlice,
        pagination : PaginationSlice
    })
})

export default store;