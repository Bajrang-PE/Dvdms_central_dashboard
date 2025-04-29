import React, { useContext } from 'react'
import { LoginContext } from '../../../context/LoginContext'

const OutsourceMasterForm = () => {

    const {openPage,setOpenPage}=useContext(LoginContext)
  return (

  <>
        { openPage === "add" &&
            <div className='text-left w-100 fw-bold p-1 heading-text' >Outsource Master&gt;&gt;Add</div>
        }
        { openPage === "modify" &&
            <div className='text-left w-100 fw-bold p-1 heading-text' >Outsource Master&gt;&gt;Modify</div>
        }
 </> 
    
  )
}

export default OutsourceMasterForm