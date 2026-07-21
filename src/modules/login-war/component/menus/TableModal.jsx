import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import GlobalTable from '../GlobalTable';

const GlobalTableModal = (props) => {

    const { onClose, title, size, column, data } = props;
    const [searchInput, setSearchInput] = useState("");
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        if (searchInput) {
            const lowercasedText = searchInput?.toLowerCase() || "";
            const filteredData = lowercasedText
                ? data?.filter(row =>
                    Object.values(row).some(val =>
                        val?.toString()?.toLowerCase()?.includes(lowercasedText)
                    )
                )
                : data;

            setTableData(filteredData);
        } else {
            setTableData(data);
        }
    }, [searchInput])

    return (
        <Modal show={true} onHide={onClose} size={size ? size : 'lg'} dialogClassName="dialog-min">
            <Modal.Header closeButton className='py-1 px-2 datatable-header cms-login'>
                <b><h6 className='m-1 p-0'>
                    {`${title}`}</h6></b>

            </Modal.Header>
            <Modal.Body className='px-2 py-1'>
                <GlobalTable
                    column={column}
                    data={tableData}
                    setSearchInput={setSearchInput}
                    isShowBtn={true}
                    isAdd={false}
                    isModify={false}
                    isDelete={false}
                    isView={false}
                    isReport={true}
                    onAdd={null}
                    onModify={null}
                    onDelete={null}
                    onView={null}
                    onReport={null}
                    setOpenPage={() => { }}
                />
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

export default GlobalTableModal
