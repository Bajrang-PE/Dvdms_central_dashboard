import React, { useContext } from 'react'
import { LoginContext } from '../../context/LoginContext';

const GlobalButtons = (props) => {
    const { onSave, onClear,setSearchInput } = props;
    const { openPage, setOpenPage, setSelectedOption } = useContext(LoginContext);

    return (
        <div className='row my-1'>
            <div className='col-12 col-md-7 mb-1 d-flex flex-wrap'>
                <>
                    {(openPage === 'add' || openPage === 'modify') && (<>
                        <button className='btn btn-sm datatable-btns py-0' onClick={onSave}>
                            <i className="fa fa-save me-1 fs-13 text-success"></i>Save</button>

                        <button className='btn btn-sm datatable-btns py-0' onClick={() => { setOpenPage('home'); setSelectedOption([]); setSearchInput('') }}>
                            <i className="fa fa-close me-1 fs-13 text-danger"></i>Cancel</button>

                    </>)}
                    {openPage === 'add' &&
                        <button className='btn btn-sm datatable-btns py-0' onClick={onClear} >
                            <i className="fa fa-broom me-1 fs-13 text-warning"></i>Clear</button>

                    }

                    {openPage === 'view' &&
                        <button className='btn btn-sm datatable-btns py-0' onClick={() => { setOpenPage('home'); setSelectedOption([]); }}>
                            <i className="fa fa-close me-1 fs-13 text-danger"></i>Close</button>
                    }
                </>
            </div>
        </div >
    )
}

export default GlobalButtons
