import React from 'react'
import GlobalGraph from '../GlobalGraph'
import { DataSeries } from '../../localData/HomeData'

const Graphs = () => {

    return (
        <div className="graphs row pl-5 pr-5" style={{ padding: "10px" }} id='graphs'>
            <div className="col-12 p-4" >
                <h2 className='home-headings'>Graphs</h2>
                <h5 className="border-btm"></h5>
                <br />
            </div>
            {DataSeries?.length > 0 && DataSeries?.map((dt, index) => (
                <div className="col-md-4 col-sm-12 d-flex justify-content-center" key={index} id={`linkgraph${index + 1}`}>
                    <div className="card graphs-data" >
                        <GlobalGraph
                            title={dt?.title}
                            yAxisTitle={dt?.yAxisTitle}
                            xAxisTitle={dt?.xAxisTitle}
                            categories={dt?.Categories}
                            seriesData={dt?.Data}
                        />
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Graphs
