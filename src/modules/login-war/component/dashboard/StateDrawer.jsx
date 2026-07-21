import React, { useMemo, useState } from "react";
import "./stateDrawer.css";
import { stateData } from "../../localData/HomeData";

const StateDrawer = ({ isOpen, onClose }) => {
    const [search, setSearch] = useState("");
    const filteredStates = useMemo(() => {
        if (!search) return stateData;
        return stateData.filter(state =>
            state?.stateName
                ?.toLowerCase()
                ?.includes(search.toLowerCase())
        );
    }, [search]);
    
    return (
        <>
            <div
                className={`state-overlay ${isOpen ? "show" : ""}`}
                onClick={onClose}
            />
            <aside className={`state-drawer ${isOpen ? "open" : ""}`}>
                <div className="state-header">
                    <div>
                        <h4>
                            STATE DVDMS LINKS
                        </h4>
                        {/* <p>
                            Select your state dashboard
                        </p> */}
                    </div>
                    <button
                        className="state-close-btn"
                        onClick={onClose}
                    >
                        <i className="fa fa-xmark"></i>
                    </button>
                </div>

                <div className="state-search">
                    <i className="fa fa-search"></i>
                    <input
                        type="text"
                        placeholder="Search state..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="state-grid">
                    {
                        filteredStates?.map((state, index) => (
                            <a
                                key={index}
                                href={state?.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="state-card2"
                            >
                                <div className="state-image">
                                    <img
                                        src={`/dvdms/${state?.imgUrl}`}
                                        alt={state?.stateName}
                                    />
                                </div>
                                <div className="state-name">
                                    {state?.stateName}
                                </div>
                            </a>
                        ))
                    }
                </div>
            </aside>
        </>
    );
};
export default StateDrawer;