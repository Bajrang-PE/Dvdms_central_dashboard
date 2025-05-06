import React, { useContext, useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import InputSelect from '../InputSelect'
import { LoginContext } from '../../context/LoginContext';
import { fetchData } from '../../../../utils/ApiHooks';

const ForgotPassForm = ({ isShow, onClose }) => {

    const { getHintQuestionDrpData, hintQuestionDrpDt } = useContext(LoginContext);

    const [captchaImage, setCaptchaImage] = useState(null);
    const [captchaInput, setCaptchaInput] = useState('');
    const [captchaToken, setCaptchaToken] = useState('');
    const [username, setUsername] = useState('');
    const [hintquestion, setHintquestion] = useState('');
    const [answer, setAnswer] = useState('');

    const [errors, setErrors] = useState({
        usernameErr: "", hintquestionErr: "", answerErr: "", captchaInputErr: ""
    })

    const handleValueChange = (e) => {
        const { value, name } = e.target;
        const errName = name + 'Err';
        setErrors({ ...errors, [errName]: "" })
        if (name === "username") {
            setUsername(value)
        } else if (name === "hintquestion") {
            setHintquestion(value)
        } else if (name === "answer") {
            setAnswer(value)
        } else if (name === "captchaInput") {
            setCaptchaInput(value)
        }
    }

    const fetchCaptchaData = () => {
        fetchData('/api/v1/generateCaptcha').then(data => {
            if (data) {
                setCaptchaImage(data?.captchaImage);
                setCaptchaToken(data?.captchaToken);
            } else {
                console.error('Request failed')
                setCaptchaImage(null);
                setCaptchaToken('');
            }
        })
    }

    const saveForgotDetail = (e) => {
        e.preventDefault();
        let isValid = true;

        if (!username?.trim()) {
            setErrors(prev => ({ ...prev, 'usernameErr': "User name is required" }));
            isValid = false;
        }
        if (!hintquestion?.trim()) {
            setErrors(prev => ({ ...prev, 'hintquestionErr': "Hint question is required" }));
            isValid = false;
        }
        if (!answer?.trim()) {
            setErrors(prev => ({ ...prev, 'answerErr': "Answer is required" }));
            isValid = false;
        }
        if (!captchaInput?.trim()) {
            setErrors(prev => ({ ...prev, 'captchaInputErr': "Captcha is required" }));
            isValid = false;
        }

        if (isValid) {
            alert('validation success')
        }

    }

    useEffect(() => {
        fetchCaptchaData()
        if(hintQuestionDrpDt?.length === 0){getHintQuestionDrpData()}
    }, [])

    const reset = () => {
        setUsername('');
        setHintquestion('');
        setAnswer('');
        setCaptchaInput('');
    }

    return (
        <Modal show={isShow} onHide={onClose} size='lg' dialogClassName="dialog-min">
            <Modal.Header closeButton className='py-1 px-2 datatable-header cms-login'>
                <b><h5 className='mx-2 mt-1 px-1'>Forgot Password Details</h5></b>
            </Modal.Header>
            <Modal.Body className='px-2 py-1'>

                <div className="form-group row" style={{ paddingBottom: "1px" }}>
                    <label className="col-sm-4 col-form-label required-label">User Name : </label>
                    <div className="col-sm-8 align-content-center">
                        <input
                            type="text"
                            className="aliceblue-bg form-control form-control-sm border-dark-subtle"
                            placeholder="Username"
                            name='username'
                            id='username'
                            onChange={handleValueChange}
                            value={username}
                        />
                        {errors?.usernameErr &&
                            <div className="required-input">
                                {errors?.usernameErr}
                            </div>
                        }
                    </div>
                </div>

                <div className="form-group row" style={{ paddingBottom: "1px" }}>
                    <label className="col-sm-4 col-form-label required-label">Hint Question : </label>
                    <div className="col-sm-8 align-content-center">
                        <InputSelect
                            id="hintquestion"
                            name="hintquestion"
                            placeholder="Select Question"
                            options={hintQuestionDrpDt}
                            className="aliceblue-bg border-dark-subtle"
                            value={hintquestion}
                            onChange={handleValueChange}
                        />
                        {errors?.hintquestionErr &&
                            <div className="required-input">
                                {errors?.hintquestionErr}
                            </div>
                        }
                    </div>
                </div>

                <div className="form-group row" style={{ paddingBottom: "1px" }}>
                    <label className="col-sm-4 col-form-label required-label">Answer : </label>
                    <div className="col-sm-8 align-content-center">
                        <input
                            type="text"
                            className="aliceblue-bg form-control form-control-sm border-dark-subtle"
                            placeholder="Answer"
                            name='answer'
                            id='answer'
                            onChange={handleValueChange}
                            value={answer}
                        />
                        {errors?.answerErr &&
                            <div className="required-input">
                                {errors?.answerErr}
                            </div>
                        }
                    </div>
                </div>

                <div className="form-group row" style={{ paddingBottom: "1px" }}>
                    <div className="align-content-center col-sm-5 col-form-label">
                        <img className='border-warning border rounded m-1 w-75' src={captchaImage} alt="captcha" />
                        <button className='btn btn-secondary btn-sm' onClick={() => { fetchCaptchaData() }}>
                            <i className="fa fa-refresh" style={{ color: "#FBC02D" }}></i>
                        </button>
                    </div>
                    <div className="col-sm-7 align-content-center">
                        <input
                            type="text"
                            className="aliceblue-bg form-control border-dark-subtle"
                            placeholder="Enter Captcha"
                            name='captchaInput'
                            id='captchaInput'
                            value={captchaInput}
                            onChange={handleValueChange}
                        />
                        {errors?.captchaInputErr &&
                            <div className="required-input">
                                {errors?.captchaInputErr}
                            </div>
                        }
                    </div>
                </div>

                <div className='w-100 py-1 my-1 opacity-75 rounded-3' style={{ backgroundColor: "#000e4e" }}>
                </div>

                <div className='text-center'>
                    <button className='btn cms-login-btn m-1 btn-sm' onClick={saveForgotDetail}>
                        <i className="fa fa-right-long me-1"></i> Next
                    </button>
                    <button className='btn cms-login-btn m-1 btn-sm' onClick={reset}>
                        <i className="fa fa-broom me-1"></i> Clear
                    </button>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default ForgotPassForm
