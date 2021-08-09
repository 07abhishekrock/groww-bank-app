import { createSlice } from "@reduxjs/toolkit";

export const PaginationSlice = createSlice({
    name : 'pagination',
    initialState : {
        current_page_number : 1,
        start_index : 0,
        page_label_count : 4,
        row_count_per_page : 10,
        group_index : 0,
        isLastGroup : false,
        lastPageNumber :-1 
    },
    reducers : {
        changeCurrentPageNumber : (state , action)=>{
            state.current_page_number = action.payload;
        },
        changeRowCountPerPage : (state , action)=>{
            state.row_count_per_page = action.payload;
        },
        changeStartIndex : (state, action)=>{
            state.start_index = action.payload;
        },
        changeGroupIndex : (state , action)=>{
            state.group_index = action.payload;
        },
        setIsLastGroup : (state)=>{
            state.isLastGroup = true;
        },
        clearIsLastGroup : (state)=>{
            state.isLastGroup = false;
        },
        setLastPageNumber : (state , action)=>{
            state.lastPageIndex = action.payload;
        }
    }
})

export const row_count_per_page_selector = (state) => state.pagination.row_count_per_page;
export const current_page_number_selector = (state) => state.pagination.current_page_number;
export const start_index_selector = (state) => state.pagination.start_index;
export const page_label_count_selector = (state) => state.pagination.page_label_count;
export const group_index_selector = (state) => state.pagination.group_index;
export const is_last_group_selector = (state) => state.pagination.isLastGroup;
export const lastPageNumber_selector = (state) => state.pagination.lastPageNumber;

export const {changeCurrentPageNumber , changeRowCountPerPage , changeStartIndex , changeGroupIndex , setIsLastGroup , clearIsLastGroup , setLastPageNumber, setLastPageIndex} = PaginationSlice.actions;
export default PaginationSlice.reducer;