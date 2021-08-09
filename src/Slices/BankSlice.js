import { createSlice } from "@reduxjs/toolkit";
export const __ALL__ = 0, __FAVOURITES__ = 1;

export const BankSlice = createSlice({
    name: 'bankList',
    initialState: {
        bankListData: {},
        citySelected: null,
        filter: __ALL__,
        lastRefreshed: null,
        loading: { loadingType: 'idle', errorString: null }
    },
    reducers: {
        changeCity : (state ,action) => {
            if(action.payload !== state.citySelected){
                state.citySelected = action.payload;
            }
        },
        stopLoading: (state) => {
            state.loading.loadingType = 'idle';
            state.loading.errorString = null;
        },
        startLoading: (state) => {
            state.loading.loadingType = 'load';
            state.loading.errorString = null;
        },
        errorLoading: (state, action) => {
            state.loading.loadingType = 'error';
            state.loading.errorString = action.payload;
        },
        refreshBankList : (state , action) => {
            state.bankListData[state.citySelected] = action.payload;
        },
        clearAllBanks : (state) =>{
            state.bankListData = {};
        }
    }
},
)

export const fetchBankListFromStore = (url , city) => async (dispatch, getState) => {

    console.log('hello fetching data');
    dispatch(startLoading());
    
    if (typeof getState().bankList.bankListData[city] !== typeof undefined) {
        console.log(getState());
        dispatch(changeCity(city))
        dispatch(stopLoading());
        return;
    }

    const response = await fetch(url + '?city=' + city , {
        mode : 'cors',
        cache : 'default'
    });
    if (response.status >= 200 && response.status <= 299) {

        const jsonResponse = await response.json();

        dispatch(refreshBankList(jsonResponse));

        dispatch(changeCity(city))
        dispatch(stopLoading());
        console.log('fetch complete');

    }
    else {
        dispatch(errorLoading(response.statusText));
    }
}

export const bank_list = (state) => {
    return state.bankList.bankListData[state.bankList.citySelected];
}

export const city_name = (state) => {
    return state.bankList.citySelected;
}

export const all_cities_bank_list_selector = (state) => {
    return state.bankList.bankListData;
}

export const getLoadingState = (state) => {
    return state.bankList.loading;
}

export const {changeCity , clearAllBanks , stopLoading , startLoading , errorLoading , refreshBankList} = BankSlice.actions;
export default BankSlice.reducer;