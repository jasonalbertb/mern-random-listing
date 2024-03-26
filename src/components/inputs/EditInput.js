import React ,{useState} from 'react'
import { FaEdit } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { FaCheck } from "react-icons/fa";

export const EditInput = ({value, setPrev, onChange, handleSubmit}) => {
    const [isEditMode, setIsEditMode] = useState(false);
    const submit = async(e)=>{
        await handleSubmit(e)
        setIsEditMode(false);
    }

    return (
        <div className='flex w-[250px] relative items-center mt-2 text-lg font-semibold'>
            {isEditMode? 
                <input type='text' value={value} className='flex-1 px-2 bg-white border pl-1'
                onChange={onChange}
            />:
                <h2 className='line-clamp-1 w-full px-2'>{value}</h2>
            }
            {
                isEditMode? 
                    <>
                        <button onClick={submit}>
                            <FaCheck  className={`h-4 w-4 text-green-500 mx-2`}/>
                        </button>
                        <button onClick={setPrev}>
                            <FaXmark  className={`h-5 w-5 text-red-500  `}/>
                        </button>
                    </>:
                     <button onClick={()=>setIsEditMode(true)}>
                        <FaEdit  className={`h-5 w-5 text-blue-500 `}/>
                    </button>
            }
        </div>
    )
}
