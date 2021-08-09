import { useSelector , useDispatch } from "react-redux";
import { getLoadingState , fetchBankListFromStore, city_name, bank_list } from "../Slices/BankSlice";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import {useState , useEffect} from 'react';


const SingleBankItem = (props)=>{
    return(
        <div className="single-bank-item" style={{textAlign : 'center'}}>
            <h2>Individual Bank Details</h2>
            <h1 className="single-bank-ifsc">{props.ifsc}</h1>
            <div className="single-bank-id-and-name">
                <span>BANK ID : {props.bank_id}</span>
                <h1>{props.bank_name}</h1>
            </div>
            <h3>{props.branch}</h3>
            <div className="single-bank-item-address" style={{
                borderTop : "2px solid black",
                marginTop : '2em',
                paddingTop : '1em',
            }}>
                <h2>Address</h2>
                <p>{props.address}</p>
            </div>
            <div className="single-bank-item-buttons" style={{
                display:'flex',
                gap:'0.5em',
                justifyContent:'center'
            }} className="styled-anchor-container">
                <a>Mark as Favourite</a>
                <Link to="/all-banks">Go Home</Link>
            </div>
        </div>
    )
}

const SingleBankItemPage = (props)=>{
  const {ifsc} = useParams();
  const list_of_all_banks = useSelector(bank_list);
  const [bank_item , set_bank_item] = useState(null);
  const dispatch = useDispatch();
  const loading = useSelector(getLoadingState);
  const [load_more_cities , toggle_load_more_cities] = useState(true);
  useEffect(()=>{
    async function getDataForAllCities(){
      if(!ifsc){
        return;
      }
      const all_cities = ['MUMBAI' , 'PUNE' , 'LUCKNOW' , 'RANCHI', 'DELHI'] 
      for(let city of all_cities){
        dispatch(await fetchBankListFromStore('https://vast-shore-74260.herokuapp.com/banks' , city));
      }
    }
    if(load_more_cities){
        getDataForAllCities();
    }
  },[])

  useEffect(()=>{
    if(!list_of_all_banks){
        return;
    }
    for(let bank of list_of_all_banks){
            let found = false;
            if(bank['ifsc'] == ifsc){
                set_bank_item(bank);
                toggle_load_more_cities(false);
                found = true;
                break;
            }
            if(found === true) break;
        }
    },[list_of_all_banks])

    if(loading.loadingType === 'load'){
      return (
        <h2>Loading Your Bank ...</h2>
      )
    }
    else if(loading.loadingType === 'idle'){
      if(bank_item){
        return <SingleBankItem {...bank_item}/> 
      }
      else{
        return <h2 error="1">Could Not Find Your Bank !!</h2>
      }
    }
    else if(loading.loadingType === 'error'){
      return <h2 error="1">{"Some Error With Your Network !!!"}</h2>
    }
    else{
      return <h2>Loading Your Bank ...</h2>
    }
}


export default SingleBankItem;
export {SingleBankItemPage};