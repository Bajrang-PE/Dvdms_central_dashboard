import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'
import { getAuthUserData } from '../../../../utils/CommonFunction';

const FeedbackForm = ({ onClose }) => {

    const [feedback, setFeedback] = useState('');

    return (
        <>
            <Modal show={true} onHide={onClose} size='lg'>
                <Modal.Header closeButton className='p-2'></Modal.Header>
                <b><h4 className='datatable-header mx-3 py-1 mt-1 px-1'>Feedback Form</h4></b>
                <Modal.Body className='px-3 py-0'>
                    <div className="card m-2">
                        <div className="card-header" style={{ color: "#000e4e" }}>
                            Submit your feedback...
                        </div>
                        <div className="card-body overflow-auto" style={{ maxHeight: "400px" }}>
                            <div className="form-group row" style={{ paddingBottom: "1px" }}>
                                <label className="col-sm-4 col-form-label fix-label">User Name : </label>
                                <div className="col-sm-8 align-content-center">
                                    {getAuthUserData('username')}
                                </div>
                            </div>
                            <div className="form-group row" style={{ paddingBottom: "1px" }}>
                                <label className="col-sm-4 col-form-label fix-label required-label">Feedback : </label>
                                <div className="col-sm-8 align-content-center">
                                    <textarea className='form-control' name="feedback" id="feedback" value={feedback} onChange={(e) => { setFeedback(e.target.value) }}></textarea>
                                </div>
                            </div>
                            <div className='w-100 py-1 my-2 opacity-75 rounded-3' style={{ backgroundColor: "#000e4e" }}>
                            </div>

                            <div className='text-center'>
                                <button className='btn btn-sm new-btn-blue py-0'>
                                    <i className="fa fa-save me-1"></i>
                                    Submit</button>

                                <button className='btn btn-sm new-btn-blue py-0' onClick={(e) => { setFeedback('') }}>  <i className="fa fa-refresh me-1"></i>Reset</button>

                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default FeedbackForm
