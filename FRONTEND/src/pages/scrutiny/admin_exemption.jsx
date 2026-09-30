import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getExemptionList } from "../../api/api";
import "../../styles/scrutiny/admin_exemption.css";

function AdminExemptionPage() {
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        getExemptionList()
            .then(res => setData(res))
            .catch(err => console.log(err));
    }, []);

    const filteredData = data.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase())
    );

    const getStatus = (status) => (status || "pending").toLowerCase();
    const isPendingStatus = (status) => ["pending", "s1_accepted"].includes(getStatus(status));
    const isApprovedStatus = (status) => ["approved", "s2_approved"].includes(getStatus(status));
    const isRejectedStatus = (status) => ["rejected", "s2_rejected"].includes(getStatus(status));

    const total = data.length;
    const pending = data.filter(x => isPendingStatus(x.approver_status)).length;
    const approved = data.filter(x => isApprovedStatus(x.approver_status)).length;
    const rejected = data.filter(x => isRejectedStatus(x.approver_status)).length;

    return (
        <div className="aep-container">

            {/* CARDS */}
            <div className="aep-cards">
                <div className="aep-card total">
                    <p>Total Applications</p>
                    <span className="aep-count">{total}</span>
                </div>

                <div className="aep-card aep-warning">
                    <p>Pending</p>
                    <h2>{pending}</h2>
                </div>

                <div className="aep-card aep-success">
                    <p>Approved</p>
                    <h2>{approved}</h2>
                </div>

                <div className="aep-card aep-danger">
                    <p>Rejected</p>
                    <h2>{rejected}</h2>
                </div>
            </div>

            {/* SEARCH */}
            <div className="aep-search-box">
                <input
                    className="aep-search-input"
                    placeholder="Enter owner name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* TABLE */}
            <table className="aep-table">
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>Application ID</th>
                        <th>Name</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {filteredData.map((item, index) => (
                        <tr key={item.id}>
                            <td>{index + 1}</td>
                            <td>{item.id}</td>
                            <td>{item.name}</td>
                            <td>
                                <span className={`aep-status ${item.approver_status || "pending"}`}>
                                    {item.approver_status || "pending"}
                                </span>
                            </td>
                            <td>
                                <button
                                    className="aep-view-btn"
                                    onClick={() => navigate(`/exemptiondetails/${item.id}`)}
                                >
                                    View →
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>


            {/* 🔙 BACK BUTTON */}
            <div style={{ marginBottom: "15px" }}>
                <button
                    className="aep-back-btn"
                    onClick={() => navigate(-1)}
                >
                    ← Back
                </button>
            </div>

        </div>
    );
}

export default AdminExemptionPage;