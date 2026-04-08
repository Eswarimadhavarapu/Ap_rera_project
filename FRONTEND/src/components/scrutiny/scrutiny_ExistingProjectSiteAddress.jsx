import React, { useEffect, useState, useMemo } from "react";
import { apiGet } from "../../api/api";

const scrutiny_ExistingProjectSiteAddress = ({ formData }) => {

  const [districts, setDistricts] = useState([]);
  const [mandals, setMandals] = useState([]);
  const [villages, setVillages] = useState([]);

  /* ================= MAP DATA ================= */
  const mappedData = useMemo(() => {
    if (!formData) return {};
    return { ...formData };
  }, [formData]);

  const safe = (v) =>
    v !== undefined && v !== null ? String(v) : "NA";

  /* ================= LOAD MASTER DATA ================= */

  useEffect(() => {
    const loadDistricts = async () => {
      try {
        const data = await apiGet("/api/districts/1");
        setDistricts(data || []);
      } catch (err) {
        console.error(err);
      }
    };
    loadDistricts();
  }, []);

  useEffect(() => {
    if (!mappedData.projectDistrict) return;

    const loadMandals = async () => {
      try {
        const data = await apiGet(`/api/mandals/${mappedData.projectDistrict}`);
        setMandals(data || []);
      } catch (err) {
        console.error(err);
      }
    };
    loadMandals();
  }, [mappedData.projectDistrict]);

  useEffect(() => {
    if (!mappedData.projectMandal) return;

    const loadVillages = async () => {
      try {
        const data = await apiGet(`/api/villages/${mappedData.projectMandal}`);
        setVillages(data || []);
      } catch (err) {
        console.error(err);
      }
    };
    loadVillages();
  }, [mappedData.projectMandal]);

  /* ================= GET NAME FROM ID ================= */

  const getName = (list, id) => {
    const found = list.find((x) => String(x.id) === String(id));
    return found ? found.name : "NA";
  };

  /* ================= RENDER ================= */

  return (
    <div className="form-section">

      <h3 className="subheading">Project Site Address</h3>

      {/* ===== ROW 1 ===== */}
      <div className="row innerdivrow">

        <div className="col-sm-3">
          <div className="display-group">
            <span className="display-label">Door No</span>
            <span className="display-field">{safe(mappedData.projectAddress1)}</span>
          </div>
        </div>

        <div className="col-sm-3">
          <div className="display-group">
            <span className="display-label">Area</span>
            <span className="display-field">{safe(mappedData.projectAddress2)}</span>
          </div>
        </div>

        <div className="col-sm-3">
          <div className="display-group">
            <span className="display-label">District</span>
            <span className="display-field">
              {getName(districts, mappedData.projectDistrict)}
            </span>
          </div>
        </div>

        <div className="col-sm-3">
          <div className="display-group">
            <span className="display-label">Mandal</span>
            <span className="display-field">
              {getName(mandals, mappedData.projectMandal)}
            </span>
          </div>
        </div>

      </div>

      {/* ===== ROW 2 ===== */}
      <div className="row innerdivrow">

        <div className="col-sm-3">
          <div className="display-group">
            <span className="display-label">Village</span>
            <span className="display-field">
              {getName(villages, mappedData.projectVillage)}
            </span>
          </div>
        </div>

        <div className="col-sm-3">
          <div className="display-group">
            <span className="display-label">Pincode</span>
            <span className="display-field">{safe(mappedData.projectPincode)}</span>
          </div>
        </div>

        <div className="col-sm-3">
          <div className="display-group">
            <span className="display-label">Latitude</span>
            <span className="display-field">{safe(mappedData.projectLatitude)}</span>
          </div>
        </div>

        <div className="col-sm-3">
          <div className="display-group">
            <span className="display-label">Longitude</span>
            <span className="display-field">{safe(mappedData.projectLongitude)}</span>
          </div>
        </div>

      </div>

      {/* ===== ROW 3 ===== */}
      <div className="row innerdivrow">

        <div className="col-sm-3">
          <div className="display-group">
            <span className="display-label">Authority</span>
            <span className="display-field">
              {mappedData.planApprovingAuthority === "4" && "Vice Chairman, UDA"}
              {mappedData.planApprovingAuthority === "5" && "APCRDA"}
              {mappedData.planApprovingAuthority === "6" && "ULB"}
              {mappedData.planApprovingAuthority === "7" && "DTCP"}
              {mappedData.planApprovingAuthority === "9" && "VMRDA"}
            </span>
          </div>
        </div>

        <div className="col-sm-3">
          <div className="display-group">
            <span className="display-label">Survey No</span>
            <span className="display-field">{safe(mappedData.surveyNo)}</span>
          </div>
        </div>

      </div>

    </div>
  );
};

export default scrutiny_ExistingProjectSiteAddress;