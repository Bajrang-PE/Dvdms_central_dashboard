import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { ToastAlert } from '../../utils/CommonFunction';
import { encryptData } from '../../utils/SecurityConfig';
import Cookies from 'js-cookie';
import { fetchData, fetchPostData } from '../../../../utils/ApiHooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';


const CmsLogin = ({ isShow, onClose, setShowForgotPass }) => {

    const [captchaImage, setCaptchaImage] = useState(null);
    const [captchaInput, setCaptchaInput] = useState('');
    const [captchaToken, setCaptchaToken] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isShowPassword, setIsShowPassword] = useState(false);
    const navigate = useNavigate();

    const [errors, setErrors] = useState({
        usernameErr: "", passwordErr: "", captchaInputErr: ""
    })

    const handleChange = (e) => {
        const { value, name } = e.target;

        if (name === 'username') {
            setUsername(value)
            setErrors({ ...errors, "usernameErr": "" })
        } else if (name === 'password') {
            setPassword(value)
            setErrors({ ...errors, "passwordErr": "" })
        } else if (name === 'captchaInput') {
            setCaptchaInput(value)
            setErrors({ ...errors, "captchaInputErr": "" })
        }
    }

    const fetchCaptchaData = () => {
        fetchData('/api/v1/captcha').then(data => {
            if (data) {
                setCaptchaImage(data?.captchaImage);
                setCaptchaToken(data?.captchaToken);
            } else {
                console.error('Request failed');
                setCaptchaImage(null);
                setCaptchaToken('');
            }
        })
    }

    const executeLogin = (e) => {

        e.preventDefault();
        let isValid = true;

        if (!username.trim()) {
            setErrors(prev => ({ ...prev, "usernameErr": "User name is required!" }))
            isValid = false;
        }
        if (!password?.trim()) {
            setErrors(prev => ({ ...prev, "passwordErr": "Password is required!" }))
            isValid = false;
        }
        if (!captchaInput.trim()) {
            setErrors(prev => ({ ...prev, "captchaInputErr": "Captcha is required!" }))
            isValid = false;
        }

        if (isValid) {

            const val = {
                "username": username,
                "password": password,
                "captchaValue": captchaInput,
                "captchaToken": captchaToken
            }
            fetchPostData("/api/v1/auth/login", val).then(data => {
                if (data) {
                    if (!data?.message && data?.accessToken) {
                        ToastAlert("Login successful", 'success')
                        const { gnumSeatId, gstrUserName, accessToken, refreshToken, csrfToken, gnumHospitalCode, } = data;
                        const auth = {
                            'isLogin': true,
                            //   'userType': (gstrUserName)?.toLowerCase(),
                            'username': gstrUserName,
                            'userSeatId': gnumSeatId,
                            //   'hospitalName': gstrHospitalName,
                            'hospitalCode': gnumHospitalCode
                        }
                        localStorage.setItem('data', encryptData(JSON.stringify(auth)));
                        Cookies.set('csrfToken', csrfToken);
                        localStorage.setItem('accessToken', accessToken);
                        localStorage.setItem('refreshToken', refreshToken);
                        navigate('/dvdms/user-dashboard');
                    } else {
                        ToastAlert(data?.message, 'error');
                    }
                } else {
                    ToastAlert('login failed!', 'error')
                }
            })
        }
    }

    useEffect(() => {
        fetchCaptchaData()
    }, [])


    return (
        <>
            <Modal show={isShow} onHide={onClose} size='sm'>
                <Modal.Header closeButton className='p-2 datatable-header cms-login'>
                    <b><h5 className='mx-2 mt-1 px-1'>DVDMS Dashboard Login</h5></b>
                </Modal.Header>
                <Modal.Body className='px-2 py-0'>
                    <div className="ps-0 align-content-center m-3">
                        <select className="form-control aliceblue-bg" id="DashboardFor" name='DashboardFor' placeholder="Select Program" defaultValue={'1'}>
                            <option value="1">Central Dashboard</option>
                        </select>
                    </div>
                    <div className="ps-0 align-content-center m-3">
                        <input
                            type="text"
                            className="aliceblue-bg form-control"
                            placeholder="Username"
                            name='username'
                            id='username'
                            value={username}
                            onChange={handleChange}
                        />
                        {errors?.usernameErr &&
                            <div className="required-input">
                                {errors?.usernameErr}
                            </div>
                        }
                    </div>
                    <div className="align-content-center input-group m-3" style={{ paddingRight: "12%" }}>
                        <input
                            type={isShowPassword ? 'text' : 'password'}
                            className="aliceblue-bg form-control w-75"
                            placeholder="Password"
                            name='password'
                            id='password'
                            value={password}
                            onChange={handleChange}
                        />
                        <span className="input-group-text aliceblue-bg pointer" id="basic-addon1" onClick={() => setIsShowPassword(!isShowPassword)}>
                            <FontAwesomeIcon icon={isShowPassword ? faEye : faEyeSlash} className="dropdown-gear-icon me-1" />
                        </span>
                        {errors?.passwordErr &&
                            <div className="required-input">
                                {errors?.passwordErr}
                            </div>
                        }
                    </div>

                    <div className="ps-0 align-content-center mx-3 my-1">
                        <img className='border-warning border rounded m-1 w-75' src={captchaImage} alt="captcha" />
                        <button className='btn btn-primary btn-sm' onClick={() => { fetchCaptchaData() }}> <i className="fa fa-refresh" style={{ color: "#FBC02D" }}></i></button>
                    </div>
                    <div className="ps-0 align-content-center mx-3 my-1">
                        <input
                            type="text"
                            className="aliceblue-bg form-control"
                            placeholder="Enter Captcha"
                            name='captchaInput'
                            id='captchaInput'
                            value={captchaInput}
                            onChange={handleChange}
                        />
                        {errors?.captchaInputErr &&
                            <div className="required-input">
                                {errors?.captchaInputErr}
                            </div>
                        }
                    </div>
                    <div className="ps-0 align-content-center mt-4 mb-3 mx-4">
                        <Link to={'/'} onClick={() => setShowForgotPass(true)}>Forgot Password ?</Link>
                    </div>

                    <button className='btn cms-login-btn w-100 mb-1' onClick={executeLogin}>
                        <b> <span>Login</span></b>
                    </button>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default CmsLogin
