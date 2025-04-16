import React, { useContext, useEffect, useState } from 'react'
import DashHeader from '../component/dashboard/DashHeader'
import InputSelect from '../component/InputSelect';
import { LoginContext } from '../context/LoginContext';

const ChangeUserDetails = () => {

    const { getHintQuestionDrpData, hintQuestionDrpDt } = useContext(LoginContext);

    const [password, setPassword] = useState('');
    const [isValidate, setIsValidate] = useState(false);
    const [values, setValues] = useState({
        "username": "", "hintquestion": "", "answer": "", "mobileNo": "", "email": "", "parichayId": "", "defaultMenu": "",
    });

    const [errors, setErrors] = useState({
        passwordErr: "", hintquestionErr: "", answerErr: ""
    })

    const handleValueChange = (e) => {
        const { name, value } = e.target;
        const errName = name + "Err";
        if (name) {
            setValues({ ...values, [name]: value });
            setErrors({ ...errors, [errName]: "" });
        }
    }

    useEffect(() => {
        if (hintQuestionDrpDt?.length === 0) {
            getHintQuestionDrpData();
        }
    }, [])

    const validatePassword = (e) => {
        e?.preventDefault();
        let isValid = true;

        if (!password?.trim()) {
            setErrors(prev => ({ ...prev, "passwordErr": "password is required" }));
            isValid = false;
        }

        if (isValid) {
            alert('ye nhi krna tha');
            setIsValidate(true);
        }
    }

    const saveUserDetail = (e) => {
        e?.preventDefault();
        let isValid = true;

        if (!values?.hintquestion?.trim()) {
            setErrors(prev => ({ ...prev, "hintquestionErr": "please select a hint question" }));
            isValid = false;
        }

        if (!values?.answer?.trim()) {
            setErrors(prev => ({ ...prev, "answerErr": "answer is required" }));
            isValid = false;
        }

        if (isValid) {
            alert('bhai save ni krna tha, ab tu gaya, ab tu dekh')
        }
    }

    const reset = () => {
        setValues({ "username": "", "hintquestion": "", "answer": "", "mobileNo": "", "email": "", "parichayId": "", "defaultMenu": "", });
        setErrors({ passwordErr: "", hintquestionErr: "", answerErr: "" })
    }

    return (
        <>
            <DashHeader />
            <div className='text-center w-100 fw-bold p-1 heading-text' >Change User Details</div>
            <div className='container change-pass-container'>
                <div className='form-card m-auto p-2' style={{ borderBottom: "2px solid #000e4e" }}>
                    {!isValidate && (
                        <div className="form-group row" style={{ paddingBottom: "1px" }}>
                            <label className="col-sm-4 col-form-label fix-label required-label">Password : </label>
                            <div className="col-sm-8 align-content-center">
                                <input
                                    type="text"
                                    className="aliceblue-bg form-control form-control-sm border-dark-subtle"
                                    placeholder="Password"
                                    name='password'
                                    id='password'
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setErrors({ ...errors, "passwordErr": "" });
                                    }}
                                    value={password}
                                />
                                {errors.passwordErr &&
                                    <div className="required-input">
                                        {errors?.passwordErr}
                                    </div>
                                }
                            </div>
                        </div>
                    )}

                    {/* FOR CHANGE USER DETAILS */}
                    {isValidate && (
                        <>
                            <div className='text-center w-100 heading-text opacity-75 rounded-1 my-1' >User Details</div>
                            <div className="form-group row" style={{ paddingBottom: "1px" }}>
                                <label className="col-sm-4 col-form-label fix-label">User Name : </label>
                                <div className="col-sm-8 align-content-center">
                                    {values?.username || "Bajrang"}
                                </div>
                            </div>

                            <div className="form-group row" style={{ paddingBottom: "1px" }}>
                                <label className="col-sm-4 col-form-label fix-label required-label">Hint Question : </label>
                                <div className="col-sm-8 align-content-center">
                                    <InputSelect
                                        id="hintquestion"
                                        name="hintquestion"
                                        placeholder="Select Question"
                                        options={hintQuestionDrpDt}
                                        className="aliceblue-bg border-dark-subtle"
                                        value={values?.hintquestion}
                                        onChange={handleValueChange}
                                    />
                                    {errors.hintquestionErr &&
                                        <div className="required-input">
                                            {errors?.hintquestionErr}
                                        </div>
                                    }
                                </div>
                            </div>

                            <div className="form-group row" style={{ paddingBottom: "1px" }}>
                                <label className="col-sm-4 col-form-label fix-label required-label">Answer : </label>
                                <div className="col-sm-8 align-content-center">
                                    <input
                                        type="text"
                                        className="aliceblue-bg form-control form-control-sm border-dark-subtle"
                                        placeholder="Answer"
                                        name='answer'
                                        id='answer'
                                        onChange={handleValueChange}
                                        value={values?.answer}
                                    />
                                    {errors.answerErr &&
                                        <div className="required-input">
                                            {errors?.answerErr}
                                        </div>
                                    }
                                </div>
                            </div>

                            <div className="form-group row" style={{ paddingBottom: "1px" }}>
                                <label className="col-sm-4 col-form-label fix-label">Mobile No. : </label>
                                <div className="col-sm-8 align-content-center">
                                    <input
                                        type="text"
                                        className="aliceblue-bg form-control form-control-sm border-dark-subtle"
                                        placeholder="Mobile Number"
                                        name='mobileNo'
                                        id='mobileNo'
                                        onChange={handleValueChange}
                                        value={values?.mobileNo}
                                    />
                                </div>
                            </div>

                            <div className="form-group row" style={{ paddingBottom: "1px" }}>
                                <label className="col-sm-4 col-form-label fix-label">E-mail : </label>
                                <div className="col-sm-8 align-content-center">
                                    <input
                                        type="text"
                                        className="aliceblue-bg form-control form-control-sm border-dark-subtle"
                                        placeholder="E-mail"
                                        name='email'
                                        id='email'
                                        onChange={handleValueChange}
                                        value={values?.email}
                                    />
                                </div>
                            </div>

                            <div className="form-group row" style={{ paddingBottom: "1px" }}>
                                <label className="col-sm-4 col-form-label fix-label">Parichay User Id : </label>
                                <div className="col-sm-8 align-content-center">
                                    <input
                                        type="text"
                                        className="aliceblue-bg form-control form-control-sm border-dark-subtle"
                                        placeholder="Parichay Id"
                                        name='parichayId'
                                        id='parichayId'
                                        onChange={handleValueChange}
                                        value={values?.parichayId}
                                    />
                                </div>
                            </div>

                            <div className="form-group row" style={{ paddingBottom: "1px" }}>
                                <label className="col-sm-4 col-form-label fix-label ">Default Menu : </label>
                                <div className="col-sm-8 align-content-center">
                                    <InputSelect
                                        id="defaultMenu"
                                        name="defaultMenu"
                                        placeholder="Select Menu"
                                        options={[{ value: 1, label: 'Central Dashboard -> CMS Dashboard' }]}
                                        className="aliceblue-bg border-dark-subtle"
                                        value={values?.defaultMenu}
                                        onChange={handleValueChange}
                                    />
                                </div>
                            </div>
                        </>
                    )}
                    <div className='w-100 py-1 my-2 opacity-75 rounded-3' style={{ backgroundColor: "#000e4e" }}>
                    </div>

                    <div className='text-center'>
                        {isValidate && (
                            <>
                                <button className='btn btn-sm new-btn-blue py-0' onClick={saveUserDetail}>
                                    <i className="fa fa-save me-1"></i>
                                    Save</button>

                                <button className='btn btn-sm new-btn-blue py-0' onClick={reset}>
                                    <i className="fa fa-broom me-1"></i>Clear</button>
                            </>
                        )}
                        {!isValidate && (
                            <button className='btn btn-sm new-btn-blue py-0' onClick={validatePassword}>
                                <i className="fa fa-right-long me-1"></i>Go</button>
                        )}
                    </div>
                </div>
            </div>

        </>
    )
}

export default ChangeUserDetails
