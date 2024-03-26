import React, {useState, useEffect, useRef, useCallback} from 'react';
import {Link, useParams} from "react-router-dom";
import axios from 'axios';
import {ReactLoader} from "../components/loaders/ReactLoader";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { PageLayout } from "../components/layouts/PageLayout";
import {LoadingOverlay} from "../components/loaders/LoadingOverlay";
import {uploadPhotos} from "../firebase/services"
import { ROUTES } from '../helpers/constants/routes';

const UpdateListing = () => {
  const ref = useRef();
  const {id} = useParams();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [listingSubmitLoading, setListingSubmitLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [files, setFiles]= useState([]);
  const [submitListingDisabled, setSubmitListingDisabled] = useState(false);

  const handleDeleteBtn = (index)=>{
    return ()=>{
      setFiles(prev=>{
        const arr = [...prev]
        arr.splice(index, 1)
        return arr
      })
    }
  }

  const handleListingSave = useCallback( async (e)=>{
    e.preventDefault();
    setSubmitListingDisabled(true);
    setListingSubmitLoading(true);

    let imageUrls = [];
    try {
      imageUrls = await uploadPhotos([...files].filter(item=> item.type === 'blob'));
      const oldImages = [...files].filter(item=> item.type === 'url').map(item=>item.image)
      imageUrls = [
        ...oldImages, ...imageUrls
      ];

      const response = await axios.patch(`/api/listing/${id}`, {...data, imageUrls})
      if (response.status === 200) {
        setIsSuccess(true)
      }
    } catch (error) {
      console.log(error?.response?.data?.message || error.message);
      setErrorMsg(error?.response?.data?.message || error.message)
    }

    setSubmitListingDisabled(false)
    setListingSubmitLoading(false);
  }, [files, data, id])

  const handleFileInput = useCallback((e)=>{
    const inputFiles = [...e.target.files].map(item=>{
      return {type: 'blob', image: URL.createObjectURL(item), file : item}
    })
    setFiles([...inputFiles, ...files])
  }, [files])

  const handleChooseFiles = useCallback((e)=>{
    e.preventDefault();
    if (ref.current) {
      ref.current.click();
    }
  }, [ref]);


  useEffect(()=>{
      (async()=>{
          try {
            setIsLoading(true)
            const url = `/api/listing/${id}`;
            const response = await axios.get(url);
            if (response.status === 200) {
              const listing = response.data.listing;
              setData(listing)
              setFiles(listing.imageUrls.map(item=>({type: 'url', image : item})))
            }
          } catch (error) {
            console.log(error);
          }
          setIsLoading(false);    
      })()
      
  }, [id])


  if (isLoading) {
    return <ReactLoader />
  }

  if (!data) {
    return <PageLayout>Listing not found</PageLayout>
  }

  return (
    <PageLayout>
        <div >
          {listingSubmitLoading && <LoadingOverlay />}
          <div className='flex justify-center'>Update Listing</div>
          <div className='flex flex-col sm:flex-row'>
            <div className='sm:w-1/2 flex flex-col'>
              <input placeholder='Name' value={data.name} 
                onChange={e=>setData(prev=>{
                  return {...prev, name : e.target.value}
                })}
              />
              <textarea placeholder='Description' rows={5} value={data.description} 
                onChange={e=>setData(prev=>{
                  return {...prev, description : e.target.value}
                  })}
              />
              <input placeholder='address' value={data.address} 
                  onChange={e=>setData(prev=>{
                    return {...prev, address : e.target.value}
                  })}
              />
                <div className='flex gap-5 flex-wrap'>
                  <label>
                    Type : 
                    <select value={data.type} onChange={e=>setData(prev=>{
                      return {...prev, type : e.target.value}
                    })}>
                      <option value="sell">Sell</option>
                      <option value="rent">Rent</option>
                    </select>
                  </label>
                  <div>
                    <input type='checkbox' checked={data.parkingSpot} 
                      onChange={e=>setData(prev=>{
                        return {...prev, parkingSpot : e.target.checked}
                      })}
                    /> Parking Spot
                  </div>
                  <div>
                    <input type='checkbox' checked={data.furnished} 
                      onChange={e=>setData(prev=>{
                        return {...prev, furnished : e.target.checked}
                      })}
                    /> Furnished
                  </div>
                  <div>
                    <input type='checkbox' checked={data.offer} 
                      onChange={e=>setData(prev=>{
                        return {...prev, offer : e.target.checked}
                      })}
                    /> Offer
                  </div>
                </div>
                <div className='flex flex-wrap gap-4'>
                  <div>
                    <input type='number' value={data.beds} 
                      min={1}
                      max={10}
                      onChange={e=>setData(prev=>{
                        return {...prev, beds : e.target.value}
                      })}
                    /> Beds
                  </div>
                  <div>
                    <input type='number' value={data.baths} 
                      min={1}
                      max={10}
                      onChange={e=>setData(prev=>{
                        return {...prev, baths : e.target.value}
                      })}
                    /> Baths
                  </div>
                  <div>
                    <input type='number' value={data.regularPrice} 
                      min={50}
                      onChange={e=>setData(prev=>{
                        return {...prev, regularPrice : e.target.value}
                      })}
                    /> Regular Price (min: 50)
                  </div>
                  {data.offer && 
                    <div>
                      <input type='number' value={data.discountedPrice} 
                        min={0}
                        onChange={e=>setData(prev=>{
                          return {...prev, discountedPrice : e.target.value}
                        })}
                      /> Discounted Price
                    </div>
                  }
                
                </div>
                <div className='mt-4'>
                  Go to Listing :<Link to={ROUTES.LISTING_ITEM(id)} className='font-semibold hover:underline text-blue-500'> {id}</Link>
                </div>
            </div>

          
          <div className='flex flex-col sm:w-1/2'>
              <form className='' onSubmit={handleListingSave}>
                  <div><span className='font-semibold'>Images: </span>First image will be cover (max 6)</div>
                  <div className='flex justify-between'>
                    <button onClick={handleChooseFiles} className='p-1 px-3 my-2 hover:opacity-80 bg-green-500 font-semibold text-white rounded-md'>
                      Add Photos
                    </button>
                    <input ref={ref} type="file" className='hidden' 
                      onChange={handleFileInput}
                      name="filefield" multiple="multiple"
                    />
                  </div>
                  <div className='flex w-full'>
                    <button disabled={submitListingDisabled} type='submit' className='uppercase border w-full p-2 font-semibold bg-slate-500 
                      text-white rounded-md hover:opacity-80 disabled:opacity-50 inline-flex items-center justify-center'>
                      {listingSubmitLoading&& <AiOutlineLoading3Quarters className='animate-spin mr-2'/>}
                        Save Listing
                    </button>
                  </div>
                  {
                    isSuccess ? <div className='text-green-500 text-xs'>Update listing saved!</div>: 
                      errorMsg &&  <div className='text-red-500 text-xs'>
                      {errorMsg}
                    </div>
                  }
              </form> 
              <div className='flex gap-2 flex-col py-2'>
                  { files.map((item, index)=>{
                    return (
                      <div key={index} className='flex justify-between'> 
                        <img src={item.image} alt={`listing-${index}`} className='h-20 w-40 object-cover object-center'/>
                        <button onClick={handleDeleteBtn(index)}>
                          Delete
                        </button>
                      </div>
                    )
                  })}
              </div>   
            </div>            
          </div>
        </div>
    </PageLayout>
  )
}

export default UpdateListing