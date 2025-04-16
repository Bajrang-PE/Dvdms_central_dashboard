import React, { useContext, useEffect, useState } from 'react'
import { LoginContext } from '../../../../context/LoginContext';
import GlobalButtons from '../../GlobalButtons';
import InputField from '../../../InputField';
import InputSelect from '../../../InputSelect';

const GenericDrugMasterForm = () => {
    const { openPage, selectedOption, setOpenPage, setSelectedOption } = useContext(LoginContext);
    const [facilityName, setFacilityName] = useState('');
    const [recordStatus, setRecordStatus] = useState('1');
    const [singleData, setSingleData] = useState([]);

    // const getSingleData = (id) => {
    //     fetchData(`api/v1/zones/${id}`).then(data => {
    //         if (data) {
    //             setSingleData([data]);
    //         } else {
    //             ToastAlert('Error while fetching data!', 'error')
    //         }
    //     })
    // }

    // useEffect(() => {
    //     if (selectedOption?.length > 0 && openPage === 'modify') {
    //         getSingleData(selectedOption[0]?.cwhnumZoneId)
    //     }
    // }, [selectedOption, openPage])


    const saveZoneData = () => {

    }

    const updateZoneData = () => {

    }

    useEffect(() => {
        if (singleData?.length > 0) {
            setFacilityName(singleData[0]?.cwhstrZoneName)
            setRecordStatus(singleData[0]?.status === "Active" ? '1' : '0')
        }
    }, [singleData])

    return (
        <div>
            <GlobalButtons onSave={null} onClear={null} />
            <hr className='my-2' />
            <div className='row pt-2'>
                <div className='col-sm-6'>
                    <div className="form-group row" style={{ paddingBottom: "1px" }}>
                        <label className="col-sm-5 col-form-label fix-label required-label">Group Name : </label>
                        <div className="col-sm-7 align-content-center">
                            <InputField
                                type={'text'}
                                id="facilityName"
                                name="facilityName"
                                placeholder="Enter value"
                                className="aliceblue-bg border-dark-subtle"
                                value={facilityName}
                                onChange={(e) => setFacilityName(e.target?.value)}
                            />
                        </div>
                    </div>
                    <div className="form-group row" style={{ paddingBottom: "1px" }}>
                        <label className="col-sm-5 col-form-label fix-label required-label">Sub Group Name : </label>
                        <div className="col-sm-7 align-content-center">
                            <InputSelect
                                id="subgroup"
                                name="subgroup"
                                placeholder="Select value"
                                options={[]}
                                className="aliceblue-bg border-dark-subtle"
                            // value={recordStatus}
                            // onChange={(e) => { setRecordStatus(e.target.value) }}
                            />
                        </div>
                    </div>
                    <div className="form-group row" style={{ paddingBottom: "1px" }}>
                        <label className="col-sm-5 col-form-label fix-label">Drug Type : </label>
                        <div className="col-sm-7 align-content-center">
                            <InputSelect
                                id="subgroup"
                                name="subgroup"
                                placeholder="Select value"
                                options={[]}
                                className="aliceblue-bg border-dark-subtle"
                            // value={recordStatus}
                            // onChange={(e) => { setRecordStatus(e.target.value) }}
                            />
                        </div>
                    </div>
                </div>

                <div className='col-sm-6'>
                    <div className="form-group row" style={{ paddingBottom: "1px" }}>
                        <label className="col-sm-5 col-form-label fix-label required-label">VED Type : </label>
                        <div className="col-sm-7 align-content-center">
                            <InputSelect
                                id="vedtype"
                                name="vedtype"
                                placeholder="Select value"
                                options={[]}
                                className="aliceblue-bg border-dark-subtle"
                            // value={recordStatus}
                            // onChange={(e) => { setRecordStatus(e.target.value) }}
                            />
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-sm-5 col-form-label fix-label required-label">
                            Category Name :
                        </label>
                        <div className="col-sm-7 align-content-center">
                            <div className="form-check form-check-inline">
                                <input
                                    className="border-dark-subtle form-check-input"
                                    type="radio"
                                    name="recordStatus"
                                    id="recordStatus1"
                                    value={'1'}
                                    onChange={(e) => setRecordStatus(e.target.value)}
                                    checked={recordStatus === "1"}
                                />
                                <label className="form-check-label" htmlFor="dbYes">
                                    P
                                </label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    className="border-dark-subtle form-check-input"
                                    type="radio"
                                    name="recordStatus"
                                    id="recordStatus0"
                                    value={'0'}
                                    onChange={() => setRecordStatus(e.target.value)}
                                    checked={recordStatus === '0'}
                                />
                                <label className="form-check-label" htmlFor="dbNo">
                                    S
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="form-group row" style={{ paddingBottom: "1px" }}>
                        <label className="col-sm-5 col-form-label fix-label required-label">Drug Name : </label>
                        <div className="col-sm-7 align-content-center">
                            <InputField
                                type={'text'}
                                id="drugname"
                                name="drugname"
                                placeholder="Enter value"
                                className="aliceblue-bg border-dark-subtle"
                                value={facilityName}
                                onChange={(e) => setFacilityName(e.target?.value)}
                            />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default GenericDrugMasterForm
