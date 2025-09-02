import React, { useContext, useEffect, useState } from 'react'
import { capitalizeFirstLetter, ToastAlert } from '../../../../utils/CommonFunction'
import { LoginContext } from '../../../../context/LoginContext';
import InputSelect from '../../../InputSelect';
import GlobalTable from '../../../GlobalTable';
import { fetchData, fetchDeleteData } from '../../../../../../utils/ApiHooks';
import IphsMedicineMasterForm from '../../forms/admin/iphsAdmin/IphsMedicineMasterForm';

const IphsMedicineMaster = () => {

    const { openPage, setOpenPage, iphsGroupDrpData, getIphsGroupDrpData, selectedOption, setSelectedOption, confirmSave,
        setShowConfirmSave, setConfirmSave } = useContext(LoginContext);
    const [listData, setListData] = useState([]);
    const [record, setRecord] = useState("1");
    const [searchInput, setSearchInput] = useState('');
    const [filterData, setFilterData] = useState(listData);

    useEffect(()=>{
        getListData();
    },[record])

    const getListData=()=>{
        fetchData(`/api/v1/IphsMoleculeMedicineMaster/getMoleculeMedicineNames?isActive=${record}`).then(data=>{
            if(data.status == 1){
                setListData(data.data);
            }else{
                setListData([])
            }
        })
    }

      useEffect(() => {
            if (!searchInput) {
                setFilterData(listData);
            } else {
                const lowercasedText = searchInput.toLowerCase();
                const newFilteredData = listData.filter(row => {
                    const paramName = row?.moleculeName?.toLowerCase() || "";
    
                    return paramName.includes(lowercasedText);
                });
                setFilterData(newFilteredData);
            }
        }, [searchInput, listData]);

    
    const columns = [
        {
            name: (
                <input
                    type="checkbox"
                    checked={""}
                    //onChange={(e) => handleSelectAll(e.target.checked)}
                    disabled={listData.length === 0}
                    className="form-check-input log-select"
                />
            ),
            cell: row => (
                <div style={{ position: 'absolute', top: 4, left: 10 }}>
                    <input
                        type="checkbox"
                        checked={selectedOption[0]?.packID === row.packID}
                        onChange={() => setSelectedOption([row])}
                    />
                </div>
            ),
            width: "8%"
        },
        {
            name: 'Molecule Medicine Name',
            selector: row => row.moleculeName,
            sortable: true,
        },
    ];

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
                    handleDelete();
                }
            }, [confirmSave])
        
            const handleDelete = () => {
        
                fetchDeleteData(`/api/v1/IphsMoleculeMedicineMaster/deleteMoleculeMedicine?packID=${selectedOption[0].packID}&isActive=0`).then(data => {
                    if (data?.status === 1) {
                        ToastAlert("Data deleted successfully", "success")
                        setConfirmSave(false);
                        setSelectedOption([]);
                        setOpenPage("home");
                        setRecord("1")
                        getListData();
                    } else {
                        ToastAlert('Error while deleting record!', 'error')
                        setOpenPage("home")
                    }
        
                })
        
            }

    return (
        <>
            <div className='masters mx-3 my-2'>
                <div className='masters-header row'>
                    <span className='col-6'><b>{`Molecule Medicine Master >>${capitalizeFirstLetter(openPage)}`}</b></span>
                    {openPage === "home" && <span className='col-6 text-end'>Total Records : {listData?.length}</span>}
                </div>


                { (openPage === "home" || openPage === "delete") && 
                <>
                <div className="form-group col-sm-6 row" style={{ paddingBottom: "1px" }}>
                    <label className="col-sm-4 col-form-label fixed-label required-label">Record Status</label>
                    <div className="col-sm-8 align-content-center">
                        <InputSelect
                            id="record"
                            name="record"
                            options={[{ label: "Active", value: "1" },
                            { label: "Inactive", value: "0" }]}
                            onChange={(e) => setRecord(e.target.value)}
                            value={record}
                        />

                    </div>

                </div>

                <hr className='my-2' />

                <div>
                    <GlobalTable column={columns} data={filterData} onAdd={null} onModify={null} onDelete={handleDeleteRecord} View={null}
                        onReport={null} setSearchInput={setSearchInput} searchInput={searchInput} isShowBtn={true} isAdd={true} isModify={true} isDelete={true} isView={false} isReport={true} setOpenPage={setOpenPage} onValidate={null} />
                </div>

                </>
               }

               {(openPage === "add" || openPage === "modify") &&
                  <IphsMedicineMasterForm setRecord={setRecord} getListData={getListData} setSearchInput={setSearchInput }/>
               }




            </div>
        </>
    )
}

export default IphsMedicineMaster