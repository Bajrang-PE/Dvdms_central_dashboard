import React, { useContext, useEffect, useState } from 'react'
import { LoginContext } from '../../../context/LoginContext';
import { fetchDeleteData } from '../../../../../utils/ApiHooks';
import InputSelect from '../../InputSelect';
import GlobalTable from '../../GlobalTable';
import { functionalityData } from '../../../localData/HomeData';
import { capitalizeFirstLetter, ToastAlert } from '../../../utils/CommonFunction';
import ProgrammeMasterForm from '../forms/admin/ProgrammeMasterForm';
import ViewPage from '../ViewPage';

const ProgrammeMaster = () => {

    const { selectedOption, setSelectedOption, openPage, setOpenPage, setShowConfirmSave,confirmSave,setConfirmSave, getProgrammeListData, programmeListData } = useContext(LoginContext);
    const [searchInput, setSearchInput] = useState('');
    const [recordStatus, setRecordStatus] = useState('1');
    const [filterData, setFilterData] = useState(programmeListData);


    useEffect(() => {

        getProgrammeListData(recordStatus)

    }, [recordStatus])

    console.log(programmeListData,'programmeListData')

    const handleRowSelect = (row) => {
       
        setSelectedOption((prev) => {
            if (prev.length > 0 && prev[0]?.cwhnumProgrammeId === row?.cwhnumProgrammeId) {
                return [];
            }
            return [row];
        });
    };

    useEffect(() => {
        if (!searchInput) {
            setFilterData(programmeListData);
        } else {
            const lowercasedText = searchInput.toLowerCase();
            const newFilteredData = programmeListData.filter(row => {
                const paramName = row?.cwhstrProgrammeName?.toLowerCase() || "";

                return paramName.includes(lowercasedText);
            });
            setFilterData(newFilteredData);
        }
    }, [searchInput, programmeListData]);


    const deleteRecord = () => {
        fetchDeleteData(`api/v1/programmes?programmeId=${selectedOption[0]?.cwhnumProgrammeId}`).then(data => {
            //http://10.226.17.20:8025/api/v1/programmes?programmeId=74
            if (data) {
                ToastAlert("Record Deleted Successfully", "success")
                getProgrammeListData();
                setSelectedOption([]);
                setConfirmSave(false);
                onClose();
            } else {
                ToastAlert('Error while deleting record!', 'error')
            }
        })
    }

    const handleDeleteRecord = () => {
        if (selectedOption?.length > 0) {
            setOpenPage('delete');
            setShowConfirmSave(true);
        } else {
            ToastAlert("Please select a record", "warning");
        }
    }

    useEffect(() => {
        if (confirmSave && openPage === 'delete') {
            deleteRecord();
        }
    }, [confirmSave])

    const column = [
        {
            name: <input
                type="checkbox"
                // checked={selectAll}
                // onChange={(e) => handleSelectAll(e.target.checked, "gnumUserId")}
                className="form-check-input log-select"
                disabled
            />,
            cell: row =>
                <div style={{ position: 'absolute', top: 4, left: 10 }}>
                    <span className="btn btn-sm text-white px-1 py-0 mr-1" >
                        <input
                            type="checkbox"
                            checked={selectedOption.length > 0 && selectedOption[0]?.cwhnumProgrammeId === row?.cwhnumProgrammeId}
                            onChange={(e) => { handleRowSelect(row) }}
                        />
                    </span>
                </div>,
            width: "8%"
        },
        {
            name: 'Programme Name',
            selector: row => row.cwhstrProgrammeName,
            sortable: true,
        }

    ]

    const onClose = () => {
        setOpenPage('home');
        setSelectedOption([]);
    }

    return (

        <div className='masters mx-3 my-2'>
            <div className='masters-header row'>
                <span className='col-6'><b>{'Programme Master >>'}</b></span>
                <span className='col-6 text-end'>Total Records : 12</span>

            </div>
            {(openPage === "home" || openPage === 'view' || openPage === 'delete') && (
                <>
                    <div className='row pt-2'>
                        <div className='col-sm-6'>
                            <div className="form-group row" style={{ paddingBottom: "1px" }}>
                                <label className="col-sm-5 col-form-label fix-label">Record Status : </label>
                                <div className="col-sm-7 align-content-center">
                                    <InputSelect
                                        id="hintquestion"
                                        name="hintquestion"
                                        placeholder="Select Status"
                                        options={[{ value: "1", label: 'Active' }, { value: "0", label: 'InActive' }]}
                                        className="aliceblue-bg border-dark-subtle"
                                        value={recordStatus}
                                        onChange={(e) => setRecordStatus(e.target.value)}
                                    />

                                </div>
                            </div>
                        </div>
                    </div>
                    <hr className='my-2' />

                    <GlobalTable column={column} data={programmeListData} onAdd={null} onModify={null} onDelete={handleDeleteRecord} onView={null} onReport={null} setSearchInput={setSearchInput} isShowBtn={true} isAdd={true} isModify={true} isDelete={true} isView={true} isReport={true} setOpenPage={setOpenPage} />

                    {openPage === 'view' &&
                        <ViewPage data={[{ value: selectedOption[0]?.cwhstrProgrammeName, label: "Pro Name" }]} onClose={onClose} title={"Programme Master"} />
                    }

                </>
            )}

            {(openPage === "add" || openPage === 'modify') && (<>
                <ProgrammeMasterForm />
            </>)}
        </div>

    )
}

export default ProgrammeMaster
