import React from 'react'

const Footer = () => {
    return (
        <footer className="home-footer">

            <div className="container-fluid text-center text-md-start">
                <div className="row">
                    <div className="col-md-6 px-4 col-sm-12 pt-5 pl-5" style={{ color: "white" }}>
                        <h3>DVDMS Central Dashboard</h3>
                        <p className='fs-13'>Ministry of Health &amp; Family Welfare (Govt. of India)</p>
                    </div>
                    <hr className="clearfix w-100 d-md-none pb-3" />
                    <div className="col-md-6 col-sm-12">
                        <h5 style={{ color: "white" }}>Important Links</h5>
                        <h5 className="border-btm"></h5>

                        <ul className="list-unstyled mt-3" style={{ color: "white" }}>
                            <li>
                                <a className="golden" href="#graphs">Graphs</a>{" | "}<a className="golden" href="#functionalities">Functionality</a>
                            </li>

                            <li>
                                <a className="golden" href="#features">Features</a>{" | "}
                                <a className="golden" href="#state">State/UT DVDMS</a>
                            </li>

                            <li>
                                <a id="websitePolicy" className="golden pointer">Website Policies</a>{" | "}
                                <a id="termsOfUse" className="golden pointer">Terms of Use</a>{" | "}
                                <a id="webManager" className="golden pointer">Web Information Manager</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <p align="center" className="p-3 fs-13" style={{ color: "white" }}>
                <strong>Disclaimer :</strong><br />
                Website content managed by
                <a href="https://www.mohfw.gov.in/" target="_blank" className='golden'> Ministry of Health and Family Welfare, GOI </a>
                Design, Developed and Hosted by
                <a href="https://www.cdac.in/" target="_blank" className='golden'> CDAC </a>
            </p>
        </footer>
    )
}

export default Footer
