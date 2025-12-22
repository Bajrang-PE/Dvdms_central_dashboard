import React, { useEffect, useState } from 'react'
import { fetchPostData } from '../../../../utils/ApiHooks';
import { ToastAlert } from '../../utils/CommonFunction';

const OtpForm = (props) => {

    const { userName, email, resetForm, closePopUp, sendOtpToMail } = props;

    const [otp, setOtp] = useState('');
    const [timeLeft, setTimeLeft] = useState(5 * 60);
    const [isActive, setIsActive] = useState(true);

    const [errors, setErrors] = useState({
        otpErr: ""
    })

    const handleValueChange = (e) => {
        const { value, name } = e.target;
        const errName = name + 'Err';
        setErrors({ ...errors, [errName]: "" })
        if (name === "otp") {
            setOtp(value)
        }
    }

    const validateEmailOtp = () => {
        let isValid = true;

        if (!otp?.trim()) {
            setErrors(prev => ({ ...prev, 'otpErr': "Please fill otp" }));
            isValid = false;
        }

        const val = {
            "otp": otp,
            "userName": userName,
            "email": email
        }

        if (isValid) {
            fetchPostData('/api/v1/forgot/send-mail', val).then(data => {
                console.log('data', data)
                if (data?.status === 1) {
                    ToastAlert('New password has been sent to your email, you can login now.', 'success')
                    reset();
                } else {
                    ToastAlert(data?.message, 'error');
                }
            })
        }
    }

    const reset = () => {
        setErrors({ otpErr: "" });
        setOtp('');
        setTimeLeft(0);
        setIsActive(false);
        closePopUp();
        resetForm();
    }

    useEffect(() => {
        let interval = null;

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(timeLeft => timeLeft - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const resendOtp = () => {
        sendOtpToMail();
        setErrors({ otpErr: "" });
        setOtp('');
        setTimeLeft(5 * 60);
        setIsActive(true);
    }


    return (
        <>
            <div className='p-2'>
                <p className='required-label text-danger-emphasis'>otp is valid for 05:00 minutes :- <b>
                    <span>{formatTime(timeLeft)}</span>
                </b>
                </p>
                <div className="form-group row py-1">
                    <label className="col-sm-4 col-form-label required-label text-end">OTP : </label>
                    <div className="col-sm-5 align-content-center">
                        <input
                            type="text"
                            className="aliceblue-bg form-control form-control-sm border-dark-subtle"
                            placeholder="Enter OTP here"
                            name='otp'
                            id='otp'
                            onChange={handleValueChange}
                            value={otp}
                        />

                        {errors?.otpErr &&
                            <div className="required-input">
                                {errors?.otpErr}
                            </div>
                        }
                    </div>
                </div>

                <div className='w-100 py-1 my-1 opacity-75 rounded-3' style={{ backgroundColor: "#000e4e" }}>
                </div>

                <div className='text-center'>
                    <button className='btn cms-login-btn m-1 btn-sm' onClick={validateEmailOtp}>
                        <i className="fa fa-right-long me-1"></i> Next
                    </button>
                    <button className='btn cms-login-btn m-1 btn-sm' onClick={() => {
                        setOtp('');
                        setErrors({ otpErr: "" });
                    }}>
                        <i className="fa fa-broom me-1"></i> Clear
                    </button>
                    {(!isActive || timeLeft === 0) &&
                        <button className='btn cms-login-btn m-1 btn-sm' onClick={() => {
                            resendOtp();
                        }}>
                            <i className="fa fa-refresh me-1"></i> Resend
                        </button>
                    }
                </div>
            </div>
        </>
    )
}

export default OtpForm
