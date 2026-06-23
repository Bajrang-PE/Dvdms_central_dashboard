import React, { useContext, useEffect, useState } from 'react';
import InputSelect from '../../InputSelect';
import { LoginContext } from '../../../context/LoginContext';
import { fetchBlobData, fetchData } from '../../../../../utils/ApiHooks';
import { ToastAlert } from '../../../utils/CommonFunction';

const QrGenerateMaster = () => {

    const {
        getFacilityTypeDrpDataQr,
        getStoreNameDrpDataQr,
        getStateNameDrpDataQr,
        stateNameDrpDtQr,
        storeNameDrpDtQr,
        facilityTypeDrpDtQr
    } = useContext(LoginContext);

    const [stateId, setStateId] = useState('');
    const [facilityId, setFacilityId] = useState('');
    const [storeId, setStoreId] = useState('');

    const [qrImage, setQrImage] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getStateNameDrpDataQr?.();
        getFacilityTypeDrpDataQr?.();
    }, []);

    useEffect(() => {
        if (stateId && facilityId) {
            getStoreNameDrpDataQr?.(stateId, facilityId);
        }
    }, [stateId, facilityId])

    const generateQrCode = async () => {

        if (!stateId || !facilityId || !storeId) {
            alert('Please select all fields');
            return;
        }
        try {
            setLoading(true);
            setQrImage('');
            // GET IMAGE BLOB
            const blob = await fetchBlobData(
                `/api/v1/generate-qr?stateId=${stateId}&facilityTypeId=${facilityId}&storeId=${storeId}`
            );
            // CREATE IMAGE URL
            const imageUrl = URL.createObjectURL(blob);
            setQrImage(imageUrl);
        } catch (error) {
            console.error(error);
            ToastAlert('Unable to generate QR', 'error')
        } finally {
            setLoading(false);
        }
    };

    // Download QR
    const downloadQr = () => {
        if (!qrImage) return;
        const link = document.createElement('a');
        link.href = qrImage;
        link.download = `Store_QR_${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Print QR
    const printQr = () => {
        if (!qrImage) return;
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Print QR Code</title>

                    <style>
                        body{
                            display:flex;
                            justify-content:center;
                            align-items:center;
                            height:100vh;
                            margin:0;
                            font-family:Arial;
                            background:#ffffff;
                        }

                        .qr-container{
                            text-align:center;
                        }

                        img{
                            width:300px;
                            height:300px;
                        }

                        h2{
                            margin-bottom:20px;
                            color:#000e4e;
                        }
                    </style>
                </head>

                <body>

                    <div class="qr-container">
                        <h2>Generated QR Code</h2>
                        <img src="${qrImage}" alt="QR Code" />
                    </div>

                </body>
            </html>
        `);
        printWindow.document.close();
        setTimeout(() => {
            printWindow.print();
        }, 500);
    };

    return (
        <>
            <div className='masters mx-3 my-2 shadow rounded-4 border bg-white overflow-hidden'>
                <div
                    className='px-3 py-3 text-white'
                    style={{
                        background: 'linear-gradient(90deg,#000e4e,#233b99)'
                    }}
                >
                    <h5 className='mb-0 fw-bold'>
                        <i className='fa fa-qrcode me-2'></i>
                        QR Details Generation For Stores
                    </h5>
                </div>

                <div className='p-3'>
                    <div className='row'>
                        <div className='col-md-4'>
                            <div className="form-group row mb-3">
                                <label className="col-sm-4 col-form-label fw-semibold required-label">
                                    State :
                                </label>
                                <div className="col-sm-8">
                                    <InputSelect
                                        id="state"
                                        name="state"
                                        placeholder="Select State"
                                        options={stateNameDrpDtQr || []}
                                        className="aliceblue-bg border-dark-subtle"
                                        value={stateId}
                                        onChange={(e) => setStateId(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='col-md-4'>
                            <div className="form-group row mb-3">
                                <label className="col-sm-4 col-form-label fw-semibold required-label">
                                    Facility Type :
                                </label>
                                <div className="col-sm-8">
                                    <InputSelect
                                        id="facility"
                                        name="facility"
                                        placeholder="Select Facility Type"
                                        options={facilityTypeDrpDtQr || []}
                                        className="aliceblue-bg border-dark-subtle"
                                        value={facilityId}
                                        onChange={(e) => setFacilityId(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='col-md-4'>
                            <div className="form-group row mb-3">
                                <label className="col-sm-4 col-form-label fw-semibold required-label">
                                    Store :
                                </label>
                                <div className="col-sm-8">
                                    <InputSelect
                                        id="store"
                                        name="store"
                                        placeholder="Select Store"
                                        options={storeNameDrpDtQr || []}
                                        className="aliceblue-bg border-dark-subtle"
                                        value={storeId}
                                        onChange={(e) => setStoreId(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                    </div>
                    <div
                        className='w-100 rounded-pill my-3'
                        style={{
                            height: '5px',
                            background: 'linear-gradient(90deg,#000e4e,#5c7cff)'
                        }}
                    ></div>
                    <div className='text-center'>
                        <button
                            className='btn px-4 py-2 text-white fw-semibold'
                            style={{
                                background: 'linear-gradient(90deg,#000e4e,#233b99)',
                                border: 'none',
                                borderRadius: '10px'
                            }}
                            onClick={generateQrCode}
                            disabled={loading}
                        >
                            {
                                loading
                                    ?
                                    <>
                                        <span
                                            className="spinner-border spinner-border-sm me-2"
                                            role="status"
                                        ></span>
                                        Generating...
                                    </>
                                    :
                                    <>
                                        <i className='fa fa-qrcode me-2'></i>
                                        Generate QR
                                    </>
                            }
                        </button>
                    </div>
                    {
                        qrImage &&
                        <div className='mt-3 d-flex justify-content-center'>
                            <div
                                className='shadow-lg border rounded-4 p-4 text-center'
                                style={{
                                    // width: '360px',
                                    background: '#f8f9ff'
                                }}
                            >
                                <h5
                                    className='fw-bold mb-3'
                                    style={{ color: '#000e4e' }}
                                >
                                    Store Details
                                </h5>

                                <div
                                    className='bg-white p-3 rounded-4 border shadow-sm'
                                >
                                    <img
                                        src={qrImage}
                                        alt="QR Code"
                                        className='img-fluid'
                                        style={{
                                            width: '260px',
                                            height: '260px',
                                            objectFit: 'contain'
                                        }}
                                    />

                                </div>
                                <div className='d-flex justify-content-center gap-3 mt-3'>
                                    <button
                                        className='btn btn-sm btn-success px-3'
                                        onClick={downloadQr}
                                    >
                                        <i className='fa fa-download me-2'></i>
                                        Download PNG
                                    </button>
                                    <button
                                        className='btn btn-sm btn-primary px-3'
                                        onClick={printQr}
                                    >
                                        <i className='fa fa-print me-2'></i>
                                        Print
                                    </button>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </>
    );
};

export default QrGenerateMaster;