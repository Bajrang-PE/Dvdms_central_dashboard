import React from 'react'
import { stateData } from '../../localData/HomeData'
import useScrollVisibility from '../../hooks/useScrollAnimation';

const StateUts = () => {

    const isVisible = useScrollVisibility('state');

    return (
        <div id='state'>
            <div className="graphs row pl-5 pr-5" style={{ padding: "10px" }}>
                <div className={`col-12 p-4`}>
                <div className={`${isVisible ? 'slide-in' : 'slide-out'}`}>
                    <h2 className='home-headings'>State/UT DVDMS</h2>
                    <h5 className="border-btm"></h5>
                    <br />
                    <h5 style={{ color: "#000e4e" }}>Drugs and Vaccines Distribution System
                        (DVDMS) is a web based supply chain management application deals
                        with Purchase, Inventory Management & Distribution of various
                        drugs, sutures and surgical items to various Regional/District
                        Drug Warehouses (DWH) of States/UTs, Disrtict Hospitals (DH),
                        Community Health Centre (CHC) and Primary Health Centre (PHC),
                        Sub centres to distribute drugs to patient, the final consumer of
                        the supply chain.</h5>
                </div>
                </div>

            </div>
            <div className="row pl-5 pr-5">
                {stateData?.map((state, index) => (
                    <div className={`col-md-3 col-sm-6 ${isVisible ? 'fade-in' : 'fade-out'}`} key={index}>
                        <div className="card state-card" >
                            <div className="card-body">
                                <h5 className="card-title">{state?.stateName}</h5>
                            </div>
                            <a href={state?.link} target="_blank" >
                                <img className='w-100 p-1' src={state?.imgUrl} alt={`${state?.stateName} image`} style={{ borderRadius: "15px" }} />
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default StateUts
