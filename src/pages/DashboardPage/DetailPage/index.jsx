import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import DashboardPage from ".."
import Loader from "../../../components/Loader";
import CustomizedAccordions from "./domains";
import Status from "../../../components/Status";

import { getSearchDetail, getAllDomains } from "../../../apis/DashboardAPI";
import { getSingleDomain } from "../../../apis/HomePageAPI";

import "./index.css"

const DetailPage = () =>{

    const colors = ["#345bec", "#00bc4f", "#fb9a32"]

    let { id } = useParams();

    const [loading, setLoading] = useState(true);
    const [generatedDate, setGeneratedDate] = useState("");
    const [keySentences, setKeySentences] = useState("");
    const [domainCount, setDomainCount] = useState(0);
    const [status, setStatus] = useState(0);
    const [filters, setFilters] = useState([])
    const [domains, setDomains] = useState([{}]);

    useEffect(()=>{
        const run = async() =>{
            setLoading(true);
            let datas = await getSearchDetail(id);
            let domains = await getAllDomains(id);
            setDomains(domains.domains);
            console.log(domains);
            setLoading(false);
            let dt = datas?.requestDateTime?.split("T")[0];
            dt = dt?.split("-");
            if(dt !== undefined) dt = `${dt[1]}/${dt[2]}/${dt[0]}`;
            setKeySentences(datas?.keywordRelevance);
            setGeneratedDate(dt);
            setDomainCount(datas?.domainCount);
            if(datas?.filtersJson?.length !== 0){
                let filterJson = await JSON.parse(datas.filtersJson);
                let arr = [];
                filterJson.forEach((val) => {
                    let vall = `${val.filterCode}: ${val.filterValues.toString()}`
                    arr.push(vall);
                });
                setFilters(arr);
            }
            setStatus(datas?.status);

            return;
        }        

        run();
    }, [])

    return (
        <DashboardPage>
            <div className="detail-page">
                {
                    loading?<Loader />:<></>
                }
                <div className="top-bar">
                    <p><span style={{color:"#8c8c8c"}}>Activity history</span> / {generatedDate}</p>
                    <h3>Details</h3>
                </div>
                <div className="detail-content">
                    <table className="desktop-table">
                        <tr>
                        <th>Date</th>
                        <th>Search</th>
                        <th>Domains generated</th>
                        <th>Status</th>
                        </tr>
                        <tr>
                        <td>{generatedDate}</td>
                        <td>{keySentences}</td>
                        <td>
                            <span>{domainCount}</span>
                        </td>
                        <td className="status">
                            <Status stat={status}/>
                        </td>
                        </tr>
                    </table>
                    <table className="mobile-table">
                        <tr>
                            <th>Date</th>
                            <td>{generatedDate}</td>
                        </tr>
                        <tr>
                            <th>Search</th>
                            <td>{keySentences}</td>
                        </tr>
                        <tr>
                            <th>Domains generated</th>
                            <td>
                                <span>{domainCount}</span>
                            </td>
                        </tr>
                        <tr>
                            <th>Status</th>
                            <td className="status">
                                <Status stat={status}/>
                            </td>
                        </tr>
                    </table>
                    <table style={{marginTop:"20px", marginBottom:"20px"}}>
                        <tr>
                            <th>Tags used</th>
                        </tr>
                        <tr>
                            <td className="tags-used">
                                {
                                    filters?.map(filter=><span>{filter}</span>)
                                }
                            </td>
                        </tr>
                    </table>
                    <CustomizedAccordions domains={domains} />
                </div>
            </div>
        </DashboardPage>
    )
}

export default DetailPage