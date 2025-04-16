import React from 'react'
import { Modal } from 'react-bootstrap'

const ViewPage = (props) => {

    const { data, onClose, title } = props;

    return (
        <Modal show={true} onHide={onClose} size='lg' dialogClassName="dialog-min">
            <Modal.Header closeButton className='py-1 px-2 datatable-header cms-login'>

                <b><h6 className='m-1 p-0'>
                    {`${title} >> View`}</h6></b>

            </Modal.Header>
            <Modal.Body className='px-2 py-1'>
                {data?.length > 0 && data?.map((dt, index) => (
                    <div className="form-group text-center" key={index}>
                        <label className="fix-label"> <span className='me-1' style={{ color: "#013157", fontWeight: "bold" }}>{dt?.label}</span> : <span className='ms-1'>{dt?.value}</span> </label>
                    </div>
                ))}
                <hr className='my-2' />
                <div className='text-center'>
                    <button className='btn cms-login-btn m-1 btn-sm' onClick={onClose}>
                        <i className="fa fa-broom me-1"></i> Close
                    </button>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default ViewPage
