import { faPiggyBank, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ComboBox from './ComboBox';
import {useDispatch, useSelector} from 'react-redux';
import { useRef, useState } from "react";
import { changeCity , city_name } from "../Slices/BankSlice";

const categories = [
    {
        label : 'BANK ID',
        param : 'bank_id'
    },
    {
        label : 'IFSC CODE',
        param : 'ifsc'
    },
    {
        label : 'BRANCH',
        param : 'branch'
    },
    {
        label : 'BANK NAME',
        param : 'bank_name'
    },
    {
        label : 'ADDRESS',
        param : 'address'
    },
];

function NavBarWithSearch({search_query , set_search_query}){
    const dispatch = useDispatch();
    const city_selected = useSelector(city_name);


    const [current_category , set_current_category] = useState(0);
    const interval_ref = useRef(-1);



    return (
        <div className="navbar-wrapper">
            <div className="navbar-search-container">
                <div className="navbar-logo">
                    <FontAwesomeIcon icon={faPiggyBank}></FontAwesomeIcon>
                    Find Your Bank
                </div>
                <div className="navbar-search">
                    <div onClick={()=>{
                        set_current_category((current_category + 1) % categories.length);
                    }}>
                        <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>
                        <span>
                            <i>CATEGORY</i>
                           {categories[current_category].label} 
                        </span>
                    </div>
                    <input type="text" placeholder={"Enter Your Search Query Here ..."} onChange={(e)=>{
                        clearInterval(interval_ref.current);
                        interval_ref.current = setTimeout(()=>{
                            if(e.target.value.trim() !== ''){
                                set_search_query([
                                    categories[current_category].param , 
                                    e.target.value.trim()
                                ]);
                            }
                            else{
                                set_search_query(
                                    null
                                )
                            }
                        } , 800)
                    }}/>
                </div>
            </div>
            <div className="navbar-city-dropdown-wrapper">
                <span>SELECT CITY</span>
                <ComboBox options={['Mumbai' , 'Pune' , 'Lucknow' , 'Ranchi' , 'Delhi']} currentOption={city_selected} changeOption={(option_name)=>{
                    dispatch(changeCity(option_name))
                }}/>
            </div>
            <div className="navbar-nav-options">
                <a href="#" select={"1"}>All Banks</a>
                <a href="#">Favourites</a>
            </div>
        </div>
    )
}

export default NavBarWithSearch;