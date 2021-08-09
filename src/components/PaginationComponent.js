import { useSelector , useDispatch } from "react-redux";
import { useEffect, useState , useRef } from "react"
import { changeCurrentPageNumber, changeRowCountPerPage, current_page_number_selector, group_index_selector, lastPageNumber_selector, page_label_count_selector, row_count_per_page_selector } from "../Slices/PaginationSlice";


export default function PaginationComponent(props){

    const rows_count_per_page = useSelector(row_count_per_page_selector);
    const page_label_count = useSelector(page_label_count_selector);
    const current_page_number = useSelector(current_page_number_selector);
    const lastPageNumber = useSelector(lastPageNumber_selector);
    const [group_array , set_group_array] = useState([]);
    const dispatch = useDispatch();
    const row_count_input_ref = useRef(null);

    useEffect(()=>{
        let start_index_factor = Math.floor(current_page_number / page_label_count);
        if(current_page_number % page_label_count === 0){
            start_index_factor = start_index_factor - 1;
        }
        let start_index = start_index_factor * page_label_count + 1;
        const end_index = start_index + page_label_count;

        let group_array_ = [];
        for(let i = start_index ; i<end_index ; i++){
            group_array_.push(i);
            if(i === lastPageNumber){
                break;
            }
        }
        set_group_array(group_array_);
        row_count_input_ref.current.value = rows_count_per_page;
    },[current_page_number])
    
    return (
        <div className="pagination-wrapper">
            <div className="page-limit-input">
                <span>Results Per Page</span>
                <input type="number" ref={row_count_input_ref}/>
                <span onClick={()=>{
                    const value = row_count_input_ref.current.value;
                    if(value !== rows_count_per_page){
                        dispatch(changeRowCountPerPage(value));
                    }
                }}>Change</span>
            </div>
            <div className="page-selector">
                <span onClick={()=>{
                    if(current_page_number !== 1){
                        dispatch(changeCurrentPageNumber(current_page_number - 1));
                    }
                }}>Prev</span>
                    <div className="page-number-preview">
                        {group_array.map((pageLabel , index)=>{
                            if(current_page_number === pageLabel){
                                return (
                                    <span onClick={()=>{
                                        dispatch(changeCurrentPageNumber(pageLabel));
                                    }} key={index} className="currentPage">{pageLabel}</span>
                                )
                            }
                            return (
                                <span onClick={()=>{
                                    dispatch(changeCurrentPageNumber(pageLabel));
                                }} key={index}>{pageLabel}</span>
                            )
                        })}
                    </div> 
                <span onClick={()=>{
                    dispatch(changeCurrentPageNumber(current_page_number + 1));
                }}>Next</span>
            </div>
        </div>
    )
}