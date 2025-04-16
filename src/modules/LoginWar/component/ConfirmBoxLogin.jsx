import React, { useContext } from 'react'
import Modal from 'react-bootstrap/Modal';
import { LoginContext } from '../context/LoginContext';


const ConfirmBoxLogin = () => {
   
    const { showConfirmSave, setShowConfirmSave, confirmSave, setConfirmSave, } = useContext(LoginContext)

    return (
        <>
            {showConfirmSave &&
                <Modal show={true} className="input-box">
                    <Modal.Body>
                        <h6 className='text-center'>{"Confirm to perform this action?"}</h6>
                        <div className="box text-center">
                            <button type="button" className="btn btn-sm btn-success text-white me-1" data-dismiss="modal" onClick={() => { setConfirmSave(true); setShowConfirmSave(false); }}>Ok</button>
                            <button type="button" className="btn btn-sm btn-danger text-white ms-2" data-dismiss="modal" onClick={() => { setShowConfirmSave(false); setConfirmSave(false); }}> Cancel</button>
                        </div>
                    </Modal.Body>
                </Modal>
            }
        </>
    )
}

export default ConfirmBoxLogin
