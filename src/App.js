import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import BankItem from "./components/BankItem";
import NavBarWithSearch from "./components/NavBarWithSearch";
import PaginationComponent from "./components/PaginationComponent";
import { bank_list, city_name , clearAllBanks, fetchBankListFromStore, getLoadingState} from "./Slices/BankSlice";
import { changeCurrentPageNumber, changeGroupIndex, changeStartIndex, clearIsLastGroup, current_page_number_selector, group_index_selector, page_label_count_selector, row_count_per_page_selector, setIsLastGroup, setLastPageNumber, start_index_selector } from "./Slices/PaginationSlice";

export default function App(props) {
  const list_of_all_banks = useSelector(bank_list);
  const dispatch = useDispatch();

  const [cached_search_results , set_cached_search_results] = useState([]);
  const [search_query, set_search_query] = useState(null);
  const [ignored , set_ignored] = useState(0);
  const load_state = useSelector(getLoadingState);

  const row_count_per_page = useSelector(row_count_per_page_selector);
  const current_page_number = useSelector(current_page_number_selector);
  const page_label_count = useSelector(page_label_count_selector);
  const start_index = useSelector(start_index_selector);
  const city_selected = useSelector(city_name);
  const group_index = useSelector(group_index_selector);


  function refreshSearchResults(){
        //no search query found , so loading all data
        let search_results_new = [];
        if(!list_of_all_banks) {
          return;
        }
        let new_group_index = Math.floor((current_page_number / page_label_count));
        if(current_page_number % page_label_count === 0){
          new_group_index = new_group_index - 1;
        }
    
        if(new_group_index <= group_index && cached_search_results.length > 0){
          return;
        }
    
        for(let i = start_index ; ; i++){
            const bank_item = list_of_all_banks[i];
            if(search_results_new.length === page_label_count * row_count_per_page || bank_item === undefined){
              dispatch(changeStartIndex(i))
              break;
            }
            if(search_query === null){
              search_results_new.push(bank_item);
            } 
            else{
              const [search_prop , search_value] = search_query;
              switch(search_prop){
                case 'bank_id' : 
                  //perform exact match
                  if(bank_item[search_prop] == search_value){
                    search_results_new.push(bank_item);
                  }
                  break;
                default :
                  //perform initial string match
                  if(bank_item[search_prop].startsWith(search_value)){
                    search_results_new.push(bank_item);
                  }
                  break;
              }
            }
        }
    
        dispatch(changeGroupIndex(new_group_index))
        set_cached_search_results([...cached_search_results,  ...search_results_new]);
  }

  useEffect(()=>{
    refreshSearchResults();
  },[current_page_number , ignored])

  useEffect(()=>{
    if(!list_of_all_banks){
      return;
    }
    dispatch(changeStartIndex(0));
    set_cached_search_results([]);
    dispatch(changeGroupIndex(0));
    dispatch(changeCurrentPageNumber(1));
    set_ignored(ignored + 1);
  },[search_query , row_count_per_page , list_of_all_banks])

  useEffect(()=>{
    async function refreshBanks(){
      if(city_selected !== null){
        console.log('fetching data');
        dispatch(await fetchBankListFromStore('https://vast-shore-74260.herokuapp.com/banks' , city_selected));
        }
        console.log(city_selected);
      }
    refreshBanks();

  },[city_selected])

  useEffect(()=>{
    dispatch(clearAllBanks());
  },[])


  if(load_state.loadingType === 'idle' && cached_search_results.slice((current_page_number - 1) * row_count_per_page , current_page_number * row_count_per_page).length === 0){
    return (
      <React.Fragment>
        <NavBarWithSearch set_search_query={set_search_query} search_query={search_query}/>
        {list_of_all_banks ? <div className="bank-item-list" style={{textAlign : 'center'}}>
          Could Not Find Any Results !!!
          <PaginationComponent/>
        </div>  : <div className="bank-item-list" style={{textAlign:'center'}}>
          Loading Your Search Results !!!
        </div> }
      </React.Fragment>
    )
  }
  if(load_state.loadingType === 'load'){
      return <React.Fragment>
        <NavBarWithSearch set_search_query={set_search_query} search_query={search_query}/>
        <div className="bank-item-list" style={{textAlign : 'center'}}>
          Loading Your Search Results !!!
        </div>
      </React.Fragment>
  }
  if(load_state.loadingType === 'error'){
    return (
      <React.Fragment>
        <NavBarWithSearch set_search_query={set_search_query} search_query={search_query}/>
        <div className="bank-item-list" style={{textAlign : 'center'}}>
          Some Error Encountered while loading results, refresh and try again
        </div>
      </React.Fragment>
    )
  }

  return (
      <React.Fragment>
            <NavBarWithSearch set_search_query={set_search_query} search_query={search_query} />
            <div className="bank-item-list">
              {cached_search_results.slice((current_page_number - 1) * row_count_per_page , current_page_number * row_count_per_page).map((single_bank_data) => {
                return <BankItem {...single_bank_data} key={single_bank_data.ifsc} />
              })}

              <PaginationComponent />
            </div>
      </React.Fragment>
  )
}

