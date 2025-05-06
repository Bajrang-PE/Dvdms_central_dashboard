import React from 'react'
import { functionalityData } from '../../localData/HomeData'
import useScrollVisibility from '../../hooks/useScrollAnimation';

const Functionalities = () => {

    const isVisible = useScrollVisibility('functionalities');

    return (
        <div id='functionalities'>
            <div className="functionalities row pl-5 pr-5" style={{ padding: "10px" }}>
                <div className={`col-12 p-4`} >
                <div className={`${isVisible ? 'slide-in' : 'slide-out'}`}>
                    <h2 className='home-headings'>Functionalities</h2>
                    <h5 className="border-btm"></h5>
                    <br />
                    <h5 style={{ color: "#000e4e" }}>Central Dashboard gives information under
                        following categories</h5>
                </div>
                </div>
                <div className="functionalities row pl-5 pr-5" style={{ padding: "10px" }}>
                    {functionalityData?.length > 0 && functionalityData?.map((fn, index) => (
                        <div className={`col-md-4 col-sm-6 d-flex justify-content-center ${isVisible ? 'fade-in' : 'fade-out'}`} key={index}>
                            <div className="card functionality-card" >
                                <img src={fn?.imgUrl} alt="" className='w-100 p-1' style={{ borderRadius: "15px" }} />
                                <div className="card-body">
                                    <h5 className="card-title">{fn?.title}</h5>
                                    <p className="card-text fs-13">{fn?.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Functionalities
