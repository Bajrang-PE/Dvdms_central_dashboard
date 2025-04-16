import React, { useContext, useEffect, useState } from 'react'
import DashHeader from '../../dashboard/DashHeader'
import InputSelect from "../../InputSelect";
import { fetchData } from "../../../utils/ApiHooks";

export const DrugTypeMaster = () => {

    const [stateNameDrpDt, setStateNameDrpDt] = useState([]);
    const [drugs, setDrugs] = useState([]);

    const [errors, setErrors] = useState({
    })


    const [values, setValues] = useState({
        "strStateId": "", "insertMethodOnCentralServer": "", "stateServiceUrl": "", "centServiceUrl": "",
        "stateServiceUserName": "", "stateServicePass": "", "serviceConnTimeout": "", "dataFetchSize": "",
        "dbDrivClass": "", "dbUrl": "", "dbUserName": "", "dbPass": "", "isDbCredAvl": "", "stateDatabase": "", "jobForTesting": "",
        "recordStatus": "",
    });


    useEffect(() => {
        if (values?.recordStatus) {
            fetchListData(values?.recordStatus);
        }
    }, [values?.recordStatus]);

    const fetchListData = async (isActive) => {
        console.log("===isActive=="+isActive)

        fetchData(`/drugtype/getgruglist?isActive=${isActive}`).then((data) => {

            if (data) {
                setDrugs(data);
                console.log("===data==",data)
            }

        })

    };

    const handleValueChange = (e) => {
        const { name, value } = e.target;
        const errName = name + "Err";
        if (name) {
            setValues({ ...values, [name]: value });
            setErrors({ ...errors, [errName]: "" });
        }
    }


    const columns = [
        {
            name: <input
                type="checkbox"
                // checked={selectAll}
                // onChange={(e) => handleSelectAll(e.target.checked, "gnumUserId")}
                // disabled={usersDt?.length > 0 ? false : true}
                className="form-check-input log-select"
            />,
            cell: row =>
                <div style={{ position: 'absolute', top: 4, left: 10 }}>
                    <span className="btn btn-sm text-white px-1 py-0 mr-1" >
                        <input
                            type="checkbox"
                        // checked={selectedRows.includes(row.gnumUserId)}
                        // onChange={(e) => { handleRowSelect(row.gnumUserId) }}
                        />
                    </span>
                </div>,
            width: "8%"
        },
        {
            name: 'Drug Name',
            selector: (row) => row.cwhstrDrugTypeName,
            sortable: true,
            // width: "20%"
        },
    ]


    return (
        <div>
            <DashHeader />
            <div className='text-left w-100 fw-bold p-1 heading-text' >Drug Type Master</div>
            <div className="row mt-3">
                <div className="form-group col-sm-6 row" style={{ paddingBottom: "1px" }}>
                    <label className="col-sm-4 col-form-label fix-label required-label">Recoed Status : </label>
                    <div className="col-sm-8 align-content-center">
                        <InputSelect
                            id="recordStatus"
                            name="recordStatus"
                            options={[{ label: "Active", value: "1" },
                                , { label: "Inactive", value: "2" }]}
                            className="aliceblue-bg border-dark-subtle"
                            value={values?.recordStatus}
                            onChange={handleValueChange}
                        />
                        {errors.recordStatusErr &&
                            <div className="required-input">
                                {errors?.recordStatusErr}
                            </div>
                        }
                    </div>
                </div>
            </div>

            <div>
            <GlobalTable column={columns} data={drugs} onAdd={null} onModify={null} onDelete={null} onView={null} 
            onReport={null} setSearchInput={setSearchInput} isShowBtn={true} isAdd={true} isModify={true} isDelete={true} isView={true} isReport={true} />
            </div>

        </div>
    )
}

export default DrugTypeMaster;

