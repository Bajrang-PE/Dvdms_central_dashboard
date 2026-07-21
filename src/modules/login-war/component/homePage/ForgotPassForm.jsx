import React, { useContext, useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import InputSelect from '../InputSelect'
import { LoginContext } from '../../context/LoginContext';
import { fetchData, fetchPostData } from '../../../../utils/ApiHooks';
import { sanitizeInput } from '../../../../utils/CommonFunction';
import { ToastAlert } from '../../utils/CommonFunction';
import OtpForm from './OtpForm';

const ForgotPassForm = ({ isShow, onClose }) => {

    const { getHintQuestionDrpData, hintQuestionDrpDt } = useContext(LoginContext);

    const [captchaImage, setCaptchaImage] = useState(null);
    const [captchaInput, setCaptchaInput] = useState('');
    const [captchaToken, setCaptchaToken] = useState('');
    const [username, setUsername] = useState('');
    const [hintquestion, setHintquestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [recoveryMethod, setRecoveryMethod] = useState('email');
    const [isMailSent, setIsMailSent] = useState(false);
    const [isUserDetailFetched, setIsUserDetailFetched] = useState(false);
    const [email, setEmail] = useState('');

    const [errors, setErrors] = useState({
        usernameErr: "", hintquestionErr: "", answerErr: "", captchaInputErr: ""
    })

    const handleValueChange = (e) => {
        const { value, name } = e.target;
        const errName = name + 'Err';
        const nval = sanitizeInput(value);
        setErrors({ ...errors, [errName]: "" })
        if (name === "username") {
            setUsername(nval)
        } else if (name === "hintquestion") {
            setHintquestion(value)
        } else if (name === "answer") {
            setAnswer(nval)
        } else if (name === "captchaInput") {
            setCaptchaInput(nval)
        }
    }

    const fetchCaptchaData = () => {
        fetchData('/api/v1/captcha').then(data => {
            if (data) {
                setCaptchaImage(data?.data?.captchaImage);
                setCaptchaToken(data?.data?.captchaToken);
            } else {
                console.error('Request failed')
                setCaptchaImage(null);
                setCaptchaToken('');
            }
        })
    }

    const fetchEmailDetails = () => {
        const val = {
            "userName": username,
            "captcha": captchaInput
        }
        fetchPostData('/api/v1/forgot/fetchMail', val).then(data => {
            if (data?.status === 1) {
                setIsUserDetailFetched(true);
                setEmail('bajranglalgoswami@cdac.in');
            } else {
                setIsUserDetailFetched(false);
                setEmail('');
                ToastAlert(data?.message, 'error');
            }
        })
    }

    const sendOtpToMail = () => {
        let isValid = true;

        if (!username?.trim()) {
            ToastAlert('Username is empty!', 'warning');
            isValid = false;
        }
        if (!email?.trim()) {
            ToastAlert('Email is empty!', 'warning');
            isValid = false;
        }

        const val = {
            "userName": username,
            "email": email
        }

        if (isValid) {
            fetchPostData('/api/v1/forgot/send-otp', val).then(data => {
                if (data?.status === 1) {
                    setIsMailSent(true);
                    ToastAlert("An OTP has been sent to your email.", 'success');
                } else {
                    setIsMailSent(false);
                    ToastAlert(data?.message, 'error');
                }
            })
        }
    }

    const saveForgotDetail = (e) => {
        e.preventDefault();
        let isValid = true;

        if (!username?.trim()) {
            setErrors(prev => ({ ...prev, 'usernameErr': "User name is required" }));
            isValid = false;
        }
        if (!hintquestion?.trim() && recoveryMethod === 'hint') {
            setErrors(prev => ({ ...prev, 'hintquestionErr': "Hint question is required" }));
            isValid = false;
        }
        if (!answer?.trim() && recoveryMethod === 'hint') {
            setErrors(prev => ({ ...prev, 'answerErr': "Answer is required" }));
            isValid = false;
        }
        if (!captchaInput?.trim()) {
            setErrors(prev => ({ ...prev, 'captchaInputErr': "Captcha is required" }));
            isValid = false;
        }

        if (isValid) {
            fetchEmailDetails();
        }
    }

    useEffect(() => {
        fetchCaptchaData()
        if (hintQuestionDrpDt?.length === 0) { getHintQuestionDrpData() }
    }, [])

    const reset = () => {
        setUsername('');
        setHintquestion('');
        setAnswer('');
        setCaptchaInput('');
        setErrors({ usernameErr: "", hintquestionErr: "", answerErr: "", captchaInputErr: "" });
        setRecoveryMethod('email');
        setIsUserDetailFetched(false);
        setIsMailSent(false);
    }

    return (
        <>
            <Modal show={isShow} onHide={onClose} size='lg' dialogClassName="dialog-min">
                <Modal.Header closeButton className='py-1 px-2 datatable-header cms-login'>
                    <b>
                        <h5 className='mx-2 mt-1 px-1'>{isMailSent ? 'OTP Varification' : `Forgot Password Details`}</h5>
                    </b>
                    <i><span className='required-label'>(Please do not reload or refresh page)</span></i>
                </Modal.Header>
                <Modal.Body className='px-2 py-1'>
                    {!isMailSent ? <>
                        <div className="form-group row py-2">
                            <label className="col-sm-4 col-form-label fix-label required-label">
                                Recovery Type :
                            </label>
                            <div className="col-sm-5 ps-0 align-content-center">
                                <div className="form-check form-check-inline">
                                    <input
                                        className="border-dark-subtle form-check-input"
                                        type="radio"
                                        name="recoveryType"
                                        id="recoveryTypeEmail"
                                        value={'email'}
                                        onChange={(e) => setRecoveryMethod(e.target.value)}
                                        checked={recoveryMethod === "email"}
                                    />
                                    <label className="form-check-label" htmlFor="dbYes">
                                        Email-based
                                    </label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input
                                        className="border-dark-subtle form-check-input"
                                        type="radio"
                                        name="recoveryType"
                                        id="recoveryTypeHint"
                                        value={'hint'}
                                        onChange={(e) => setRecoveryMethod(e.target.value)}
                                        checked={recoveryMethod === "hint"}
                                    />
                                    <label className="form-check-label" htmlFor="dbNo">
                                        Hint-based
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className='w-100 opacity-75 my-2 rounded-3' style={{ backgroundColor: "#000e4e", border: "1px inset" }}>
                        </div>

                        {!isUserDetailFetched &&
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
                        }

                        {isUserDetailFetched &&
                            <>
                                <h6 className='text-danger-emphasis'>Verify your details:</h6>
                                <div className="form-group row" style={{ paddingBottom: "1px" }}>
                                    <label className="col-sm-4 col-form-label required-label">User Name : </label>
                                    <div className="col-sm-8 align-content-center">
                                        <span className='text-success'>{username}</span>
                                    </div>
                                </div>
                                <div className="form-group row" style={{ paddingBottom: "1px" }}>
                                    <label className="col-sm-4 col-form-label required-label">Email : </label>
                                    <div className="col-sm-8 align-content-center">
                                        <span className='text-primary-emphasis'>{email}</span>
                                    </div>
                                </div>
                            </>
                        }

                        {recoveryMethod === 'hint' &&
                            <>
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
                            </>
                        }

                        {!isUserDetailFetched &&
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
                        }

                        <div className='w-100 py-1 my-1 opacity-75 rounded-3' style={{ backgroundColor: "#000e4e" }}>
                        </div>

                        <div className='text-center'>

                            {isUserDetailFetched ?
                                <button className='btn cms-login-btn m-1 btn-sm' onClick={sendOtpToMail}>
                                    <i className="fa fa-right-long me-1"></i> Next
                                </button>
                                :
                                <button className='btn cms-login-btn m-1 btn-sm' onClick={saveForgotDetail}>
                                    <i className="fa fa-right-long me-1"></i> Next
                                </button>
                            }
                            <button className='btn cms-login-btn m-1 btn-sm' onClick={reset}>
                                <i className="fa fa-broom me-1"></i> Clear
                            </button>
                        </div>
                    </> : <>
                        <OtpForm userName={username} email={email} resetForm={reset} closePopUp={onClose} sendOtpToMail={sendOtpToMail} />
                    </>}
                </Modal.Body>
            </Modal>

        </>
    )
}

export default ForgotPassForm
