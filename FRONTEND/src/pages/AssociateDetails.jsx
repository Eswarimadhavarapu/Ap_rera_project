import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import ProjectWizard from "../components/ProjectWizard";

import '../styles/AssociateDetails.css';

const AssociateDetails = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    // Agent
    agentRegNo: '',
    agentName: '',
    agentAddress: '',
    agentMobile: '',
    
    // Architect
    arcName: '',
    arcEmail: '',
    arcAdd1: '',
    arcAdd2: '',
    arcState: '0',
    arcDistrict: '0',
    arcPin: '',
    arcYearEst: '',
    arcKeyProjects: '',
    arcRegCOA: '',
    arcMobile: '',
    
    // Structural Engineer
    engName: '',
    engEmail: '',
    engAdd1: '',
    engAdd2: '',
    engState: '0',
    engDistrict: '0',
    engPin: '',
    engYearEst: '',
    engKeyProjects: '',
    engLicNo: '',
    engMobile: '',
    
    // Contractor
    conNatureWork: '',
    conName: '',
    conEmail: '',
    conAdd1: '',
    conAdd2: '',
    conState: '0',
    conDistrict: '0',
    conPin: '',
    conYearEst: '',
    conKeyProjects: '',
    conMobile: '',
    
    // Chartered Accountant
    caName: '',
    caEmail: '',
    caAdd1: '',
    caAdd2: '',
    caState: '0',
    caDistrict: '0',
    caPin: '',
    caMemId: '',
    caKeyProjects: '',
    caMobile: '',
    
    // Project Engineer
    projEngName: '',
    projEngEmail: '',
    projEngAdd1: '',
    projEngAdd2: '',
    projEngState: '0',
    projEngDistrict: '0',
    projEngPin: '',
    projEngMobile: '',
    projEngKeyProjects: ''
  });

  const [tables, setTables] = useState({
    agents: [],
    architects: [],
    engineers: [],
    contractors: [],
    accountants: [],
    projectEngineers: []
  });

  const states = [
    { value: '0', label: 'Select' },
    { value: '1', label: 'Andaman and Nicobar Island (UT)' },
    { value: '2', label: 'Andhra Pradesh' },
    { value: '3', label: 'Arunachal Pradesh' },
    { value: '4', label: 'Assam' },
    { value: '5', label: 'Bihar' },
    { value: '6', label: 'Chandigarh (UT)' },
    { value: '7', label: 'Chhattisgarh' },
    { value: '8', label: 'Dadra and Nagar Haveli (UT)' },
    { value: '9', label: 'Daman and Diu (UT)' },
    { value: '10', label: 'Delhi (NCT)' },
    { value: '11', label: 'Goa' },
    { value: '12', label: 'Gujarat' },
    { value: '13', label: 'Haryana' },
    { value: '14', label: 'Himachal Pradesh' },
    { value: '15', label: 'Jammu and Kashmir' },
    { value: '16', label: 'Jharkhand' },
    { value: '17', label: 'Karnataka' },
    { value: '18', label: 'Kerala' },
    { value: '19', label: 'Lakshadweep (UT)' },
    { value: '20', label: 'Madhya Pradesh' },
    { value: '21', label: 'Maharashtra' },
    { value: '22', label: 'Manipur' },
    { value: '23', label: 'Meghalaya' },
    { value: '24', label: 'Mizoram' },
    { value: '25', label: 'Nagaland' },
    { value: '26', label: 'Odisha' },
    { value: '27', label: 'Puducherry (UT)' },
    { value: '28', label: 'Punjab' },
    { value: '29', label: 'Rajasthan' },
    { value: '30', label: 'Sikkim' },
    { value: '31', label: 'Tamil Nadu' },
    { value: '32', label: 'Telangana' },
    { value: '33', label: 'Tripura' },
    { value: '34', label: 'Uttar Pradesh' },
    { value: '35', label: 'Uttarakhand' },
    { value: '36', label: 'West Bengal' }
  ];

const handleInputChange = (e) => {
  const { name, value } = e.target;

  setFormData(prev => ({
    ...prev,
    [name]: value.toString(),

    // 🔑 reset district when state changes
    ...(name.includes("State")
      ? { [name.replace("State", "District")]: "0" }
      : {})
  }));
};


  const handleAddAgent = (e) => {
    e.preventDefault();
    if (!formData.agentRegNo || !formData.agentName || !formData.agentAddress || !formData.agentMobile) {
      alert('Please fill all required fields');
      return;
    }
    setTables(prev => ({
      ...prev,
      agents: [...prev.agents, {
        regNo: formData.agentRegNo,
        name: formData.agentName,
        address: formData.agentAddress,
        mobile: formData.agentMobile
      }]
    }));
    setFormData(prev => ({ ...prev, agentRegNo: '', agentName: '', agentAddress: '', agentMobile: '' }));
  };

  const handleAddArchitect = (e) => {
    e.preventDefault();
    if (!formData.arcName || !formData.arcAdd1 || !formData.arcState || !formData.arcDistrict || !formData.arcPin || !formData.arcMobile) {
      alert('Please fill all required fields');
      return;
    }
    setTables(prev => ({
      ...prev,
      architects: [...prev.architects, {
        name: formData.arcName,
        email: formData.arcEmail,
        address: `${formData.arcAdd1}, ${formData.arcAdd2}`,
        state: states.find(s => s.value === formData.arcState)?.label,
        pin: formData.arcPin,
        mobile: formData.arcMobile
      }]
    }));
    setFormData(prev => ({
      ...prev,
      arcName: '', arcEmail: '', arcAdd1: '', arcAdd2: '', arcState: '0', arcDistrict: '0',
      arcPin: '', arcYearEst: '', arcKeyProjects: '', arcRegCOA: '', arcMobile: ''
    }));
  };

  const handleAddEngineer = (e) => {
    e.preventDefault();
    if (!formData.engName || !formData.engAdd1 || !formData.engState || !formData.engDistrict || !formData.engPin || !formData.engMobile) {
      alert('Please fill all required fields');
      return;
    }
    setTables(prev => ({
      ...prev,
      engineers: [...prev.engineers, {
        name: formData.engName,
        email: formData.engEmail,
        address: `${formData.engAdd1}, ${formData.engAdd2}`,
        state: states.find(s => s.value === formData.engState)?.label,
        pin: formData.engPin,
        mobile: formData.engMobile
      }]
    }));
    setFormData(prev => ({
      ...prev,
      engName: '', engEmail: '', engAdd1: '', engAdd2: '', engState: '0', engDistrict: '0',
      engPin: '', engYearEst: '', engKeyProjects: '', engLicNo: '', engMobile: ''
    }));
  };

  const handleAddContractor = (e) => {
    e.preventDefault();
    if (!formData.conNatureWork || !formData.conName || !formData.conAdd1 || !formData.conState || !formData.conDistrict || !formData.conPin || !formData.conMobile) {
      alert('Please fill all required fields');
      return;
    }
    setTables(prev => ({
      ...prev,
      contractors: [...prev.contractors, {
        natureWork: formData.conNatureWork,
        name: formData.conName,
        email: formData.conEmail,
        address: `${formData.conAdd1}, ${formData.conAdd2}`,
        state: states.find(s => s.value === formData.conState)?.label,
        pin: formData.conPin,
        mobile: formData.conMobile
      }]
    }));
    setFormData(prev => ({
      ...prev,
      conNatureWork: '', conName: '', conEmail: '', conAdd1: '', conAdd2: '', conState: '0',
      conDistrict: '0', conPin: '', conYearEst: '', conKeyProjects: '', conMobile: ''
    }));
  };

  const handleAddCA = (e) => {
    e.preventDefault();
    if (!formData.caName || !formData.caAdd1 || !formData.caState || !formData.caDistrict || !formData.caPin || !formData.caMobile) {
      alert('Please fill all required fields');
      return;
    }
    setTables(prev => ({
      ...prev,
      accountants: [...prev.accountants, {
        name: formData.caName,
        email: formData.caEmail,
        address: `${formData.caAdd1}, ${formData.caAdd2}`,
        state: states.find(s => s.value === formData.caState)?.label,
        pin: formData.caPin,
        mobile: formData.caMobile
      }]
    }));
    setFormData(prev => ({
      ...prev,
      caName: '', caEmail: '', caAdd1: '', caAdd2: '', caState: '0', caDistrict: '0',
      caPin: '', caMemId: '', caKeyProjects: '', caMobile: ''
    }));
  };

  const handleAddProjectEngineer = (e) => {
    e.preventDefault();
    if (!formData.projEngName || !formData.projEngAdd1 || !formData.projEngState || !formData.projEngDistrict || !formData.projEngPin || !formData.projEngMobile) {
      alert('Please fill all required fields');
      return;
    }
    setTables(prev => ({
      ...prev,
      projectEngineers: [...prev.projectEngineers, {
        name: formData.projEngName,
        email: formData.projEngEmail,
        address: `${formData.projEngAdd1}, ${formData.projEngAdd2}`,
        state: states.find(s => s.value === formData.projEngState)?.label,
        pin: formData.projEngPin,
        mobile: formData.projEngMobile
      }]
    }));
    setFormData(prev => ({
      ...prev,
      projEngName: '', projEngEmail: '', projEngAdd1: '', projEngAdd2: '', projEngState: '0',
      projEngDistrict: '0', projEngPin: '', projEngMobile: '', projEngKeyProjects: ''
    }));
  };
 // ✅ ADD HERE — marks wizard step completed
const completeStep = (stepNo) => {
  const completedSteps =
    JSON.parse(localStorage.getItem("completedSteps")) || [];

  if (!completedSteps.includes(stepNo)) {
    completedSteps.push(stepNo);
    localStorage.setItem(
      "completedSteps",
      JSON.stringify(completedSteps)
    );
  }
};

  const handleSaveAndContinue = () => {
  console.log('All Data:', { formData, tables });

  // ✅ Mark STEP-4 completed
  completeStep(4);

  // 👉 Go to Upload Documents page (STEP-5)
  navigate("/Upload-Documents");
};

  return (
    <div className="associate-details-container">
        <div className="associate-details-breadcrumb">
        <span>You are here : </span>
        <a href="/">Home</a>
        <span> / </span>
        <span>Registration / Project Registration</span>
      </div>

      {/* Page Header */}
      <div className="associate-details-page-header">
        <h1>Project Registration</h1>
      </div>

      <ProjectWizard currentStep={4} />

      <div className="associate-details-panel-body">
        {/* Project Agent Section */}
        <h3 className="associate-details-subheading">Project Agent</h3>
        <div className="associate-details-row associate-details-innerdivrow">
          <div className="associate-details-col-sm-3">
            <div className="associate-details-form-group">
              <label className="associate-details-label">Agent RERA Registration No.</label>
              <input
                name="agentRegNo"
                type="text"
                maxLength="50"
                value={formData.agentRegNo}
                onChange={handleInputChange}
                placeholder="Agent RERA Reg No"
                className="associate-details-form-control associate-details-nopaste associate-details-inputbox"
              />
            </div>
          </div>
          <div className="associate-details-col-sm-3">
            <div className="associate-details-form-group">
              <label className="associate-details-label">Agent Name</label>
              <input
                name="agentName"
                type="text"
                maxLength="150"
                value={formData.agentName}
                onChange={handleInputChange}
                placeholder="Agent Name"
                className="associate-details-form-control associate-details-inputbox"
              />
            </div>
          </div>
          <div className="associate-details-col-sm-3">
            <div className="associate-details-form-group">
              <label className="associate-details-label">Agent Address</label>
              <input
                name="agentAddress"
                type="text"
                maxLength="150"
                value={formData.agentAddress}
                onChange={handleInputChange}
                placeholder="Agent Address"
                className="associate-details-form-control associate-details-inputbox"
              />
            </div>
          </div>
          <div className="associate-details-col-sm-3">
            <div className="associate-details-form-group">
              <label className="associate-details-label">Mobile Number</label>
              <input
                name="agentMobile"
                type="text"
                maxLength="10"
                value={formData.agentMobile}
                onChange={handleInputChange}
                placeholder="Mobile Number"
                className="associate-details-form-control associate-details-inputbox"
              />
            </div>
          </div>
        </div>
        <div className="associate-details-row associate-details-innerdivrow">
  <div className="associate-details-col-sm-12 associate-details-add-btn-wrapper">
    <button
      onClick={handleAddAgent}
      className="associate-details-btn associate-details-btn-primary associate-details-add-btn"
    >
      Add
    </button>
  </div>
</div>

        {tables.agents.length > 0 && (
          <div className="associate-details-row associate-details-innerdivrow">
            <div className="associate-details-col-xs-12">
              <div className="associate-details-table-responsive associate-details-tableheader">
                <table className="associate-details-table associate-details-table-striped associate-details-table-bordered">
                  <thead>
                    <tr>
                      <th>Reg No</th>
                      <th>Name</th>
                      <th>Address</th>
                      <th>Mobile</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tables.agents.map((agent, idx) => (
                      <tr key={idx}>
                        <td>{agent.regNo}</td>
                        <td>{agent.name}</td>
                        <td>{agent.address}</td>
                        <td>{agent.mobile}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Project Architects Section */}
        <div id="dvArchitects">
          <h3 className="associate-details-subheading">Project Architects</h3>
          <div className="associate-details-row associate-details-innerdivrow">
            <div className="associate-details-col-sm-3">
              <div className="associate-details-form-group">
                <label className="associate-details-label">
                  Architect Name<font color="red">*</font>
                </label>
                <input
                  name="arcName"
                  type="text"
                  maxLength="75"
                  value={formData.arcName}
                  onChange={handleInputChange}
                  placeholder="Architect Name"
                  className="associate-details-form-control associate-details-inputbox"
                />
              </div>
            </div>
            <div className="associate-details-col-sm-3">
              <div className="associate-details-form-group">
                <label className="associate-details-label">Email ID</label>
                <input
                  name="arcEmail"
                  type="text"
                  maxLength="50"
                  value={formData.arcEmail}
                  onChange={handleInputChange}
                  placeholder="Email ID"
                  className="associate-details-form-control associate-details-inputbox"
                />
              </div>
            </div>
            <div className="associate-details-col-sm-3">
              <div className="associate-details-form-group">
                <label className="associate-details-label">
                  Address Line 1<font color="red">*</font>
                </label>
                <input
                  name="arcAdd1"
                  type="text"
                  maxLength="500"
                  value={formData.arcAdd1}
                  onChange={handleInputChange}
                  placeholder="Address Line 1"
                  className="associate-details-form-control associate-details-inputbox ttip"
                />
              </div>
            </div>
            <div className="associate-details-col-sm-3">
              <div className="associate-details-form-group">
                <label className="associate-details-label">Address Line 2</label>
                <input
                  name="arcAdd2"
                  type="text"
                  maxLength="500"
                  value={formData.arcAdd2}
                  onChange={handleInputChange}
                  placeholder="Address Line 2"
                  className="associate-details-form-control associate-details-inputbox ttip"
                />
              </div>
            </div>
          </div>
          <div className="associate-details-row associate-details-innerdivrow">
            <div className="associate-details-col-sm-3">
              <div className="associate-details-form-group">
                <label className="associate-details-label">
                  State/UT<font color="red">*</font>
                </label>
                <select
                  name="arcState"
                  value={formData.arcState}
                  onChange={handleInputChange}
                  className="associate-details-form-control associate-details-inputbox"
                >
                  {states.map(state => (
                    <option key={state.value} value={state.value}>{state.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="associate-details-col-sm-3">
              <div className="associate-details-form-group">
                <label className="associate-details-label">
                  District<font color="red">*</font>
                </label>
                <select
                  name="arcDistrict"
                  value={formData.arcDistrict}
                  onChange={handleInputChange}
                  className="associate-details-form-control associate-details-inputbox"
                >
                  <option value="0">Select</option>
                </select>
              </div>
            </div>
            <div className="associate-details-col-sm-3">
              <div className="associate-details-form-group">
                <label className="associate-details-label">
                  PIN Code<font color="red">*</font>
                </label>
                <input
                  name="arcPin"
                  type="text"
                  maxLength="6"
                  value={formData.arcPin}
                  onChange={handleInputChange}
                  placeholder="PIN Code"
                  className="associate-details-form-control associate-details-inputbox allownumeric"
                />
              </div>
            </div>
            <div className="associate-details-col-sm-3">
              <div className="associate-details-form-group">
                <label className="associate-details-label">Year of establishment</label>
                <input
                  name="arcYearEst"
                  type="text"
                  maxLength="4"
                  value={formData.arcYearEst}
                  onChange={handleInputChange}
                  placeholder="Year of Estableshment"
                  className="associate-details-form-control associate-details-inputbox associate-details-allownumeric"
                />
              </div>
            </div>
          </div>
          <div className="associate-details-row associate-details-innerdivrow">
            <div className="associate-details-col-sm-3">
              <div className="associate-details-form-group">
                <label className="associate-details-label">Number of key projects completed</label>
                <input
                  name="arcKeyProjects"
                  type="text"
                  maxLength="3"
                  value={formData.arcKeyProjects}
                  onChange={handleInputChange}
                  placeholder="Number of Key projects completed"
                  className="associate-details-form-control associate-details-inputbox allownumeric"
                />
              </div>
            </div>
            <div className="associate-details-col-sm-3">
              <div className="associate-details-form-group">
                <label className="associate-details-label">Reg. Number With COA</label>
                <input
                  name="arcRegCOA"
                  type="text"
                  maxLength="25"
                  value={formData.arcRegCOA}
                  onChange={handleInputChange}
                  placeholder="Reg. Number With COA"
                  className="associate-details-form-control associate-details-inputbox"
                />
              </div>
            </div>
            <div className="associate-details-col-sm-3">
              <div className="associate-details-form-group">
                <label className="associate-details-label">
                  Mobile Number<font color="red">*</font>
                </label>
                <input
                  name="arcMobile"
                  type="text"
                  maxLength="10"
                  value={formData.arcMobile}
                  onChange={handleInputChange}
                  placeholder="Mobile Number"
                  className="associate-details-form-control associate-details-inputbox"
                />
              </div>
            </div>
          </div>
          <div className="associate-details-row associate-details-innerdivrow">
  <div className="associate-details-col-sm-12 associate-details-add-btn-wrapper">
    <button
      onClick={handleAddAgent}
      className="associate-details-btn associate-details-btn-primary associate-details-add-btn"
    >
      Add
    </button>
  </div>
</div>

          {tables.architects.length > 0 && (
            <div className="associate-details-row associate-details-innerdivrow">
              <div className="associate-details-col-xs-12">
                <div className="associate-details-table-responsive associate-details-tableheader">
                  <table className="associate-details-table associate-details-table-striped associate-details-table-bordered">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Address</th>
                        <th>State</th>
                        <th>PIN</th>
                        <th>Mobile</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tables.architects.map((arc, idx) => (
                        <tr key={idx}>
                          <td>{arc.name}</td>
                          <td>{arc.email}</td>
                          <td>{arc.address}</td>
                          <td>{arc.state}</td>
                          <td>{arc.pin}</td>
                          <td>{arc.mobile}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Structural Engineers Section */}
        <h3 className="associate-details-subheading">Structural Engineers</h3>
        <div className="associate-details-row associate-details-innerdivrow">
          <div className="associate-details-col-sm-3">
            <div className="associate-details-form-group">
              <label className="associate-details-label">
                Engineer Name<font color="red">*</font>
              </label>
              <input
                name="engName"
                type="text"
                maxLength="75"
                value={formData.engName}
                onChange={handleInputChange}
                placeholder="Engineer Name"
                className="associate-details-form-control associate-details-inputbox"
              />
            </div>
          </div>
          <div className="associate-details-col-sm-3">
            <div className="associate-details-form-group">
              <label className="associate-details-label">Email ID</label>
              <input
                name="engEmail"
                type="text"
                maxLength="50"
                value={formData.engEmail}
                onChange={handleInputChange}
                placeholder="Email ID"
                className="associate-details-form-control associate-details-inputbox"
              />
            </div>
          </div>
          <div className="associate-details-col-sm-3">
            <div className="associate-details-form-group">
              <label className="associate-details-label">
                Address Line 1<font color="red">*</font>
              </label>
              <input
                name="engAdd1"
                type="text"
                maxLength="500"
                value={formData.engAdd1}
                onChange={handleInputChange}
                placeholder="Address Line 1"
                className="associate-details-form-control associate-details-inputbox associate-details-ttip"
              />
            </div>
          </div>
          <div className="associate-details-col-sm-3">
            <div className="associate-details-form-group">
              <label className="associate-details-label">Address Line 2</label>
              <input
                name="engAdd2"
                type="text"
                maxLength="500"
                value={formData.engAdd2}
                onChange={handleInputChange}
                placeholder="Address Line 2"
                className="associate-details-form-control associate-details-inputbox associate-details-ttip"
              />
            </div>
          </div>
        </div>
        <div className="associate-details-row associate-details-innerdivrow">
          <div className="associate-details-col-sm-3">
            <div className="associate-details-form-group">
              <label className="associate-details-label">
                State/UT<font color="red">*</font>
              </label>
              <select
                name="engState"
                value={formData.engState}
                onChange={handleInputChange}
                className="associate-details-form-control associate-details-inputbox"
              >
                {states.map(state => (
                  <option key={state.value} value={state.value}>{state.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="associate-details-col-sm-3">
            <div className="associate-details-form-group">
              <label className="associate-details-label">
                District<font color="red">*</font>
              </label>
              <select
                name="engDistrict"
                value={formData.engDistrict}
                onChange={handleInputChange}
                className="associate-details-form-control associate-details-inputbox"
              >
                <option value="0">Select</option>
              </select>
            </div>
          </div>
          <div className="associate-details-col-sm-3">
            <div className="associate-details-form-group">
              <label className="associate-details-label">
                PIN Code<font color="red">*</font>
              </label>
              <input
                name="engPin"
                type="text"
                maxLength="6"
                value={formData.engPin}
                onChange={handleInputChange}
                placeholder="PIN Code"
                className="associate-details-form-control associate-details-inputbox associate-details-allownumeric"
              />
            </div>
          </div>
          <div className="associate-details-col-sm-3">
            <div className="associate-details-form-group">
              <label className="associate-details-label">Year of establishment</label>
              <input
                name="engYearEst"
                type="text"
                maxLength="4"
                value={formData.engYearEst}
                onChange={handleInputChange}
                placeholder="Year of Establishment"
                className="associate-details-form-control associate-details-inputbox associate-details-allownumeric"
              />
            </div>
          </div>
        </div>
        <div className="associate-details-row innerdivrow">
          <div className="associate-details-col-sm-3">
            <div className="associate-details-form-group">
              <label className="associate-details-label">Number of key projects completed</label>
              <input
                name="engKeyProjects"
                type="text"
                maxLength="3"
                value={formData.engKeyProjects}
                onChange={handleInputChange}
                placeholder="No. of Key Projects completed"
                className="associate-details-form-control associate-details-inputbox associate-details-allownumeric"
              />
            </div>
          </div>
          <div className="associate-details-col-sm-3">
            <div className="associate-details-form-group">
              <label className="associate-details-label">Local Authority Licence Number</label>
              <input
                name="engLicNo"
                type="text"
                maxLength="50"
                value={formData.engLicNo}
                onChange={handleInputChange}
                placeholder="Licence Number"
                className="associate-details-form-control associate-details-inputbox"
              />
            </div>
          </div>
          <div className="associate-details-col-sm-3">
            <div className="associate-details-form-group">
              <label className="associate-details-label">
                Mobile Number<font color="red">*</font>
              </label>
              <input
                name="engMobile"
                type="text"
                maxLength="10"
                value={formData.engMobile}
                onChange={handleInputChange}
                placeholder="Mobile Number"
                className="associate-details-form-control associate-details-inputbox"
              />
            </div>
          </div>
        </div>
        <div className="associate-details-row associate-details-innerdivrow">
  <div className="associate-details-col-sm-12 associate-details-add-btn-wrapper">
    <button
      onClick={handleAddAgent}
      className="associate-details-btn associate-details-btn-primary associate-details-add-btn"
    >
      Add
    </button>
  </div>
</div>

        {tables.engineers.length > 0 && (
          <div className="associate-details-row associate-details-innerdivrow">
            <div className="associate-details-col-xs-12">
              <div className="associate-details-table-responsive associate-details-tableheader">
                <table className="associate-details-table associate-details-table-striped associate-details-table-bordered">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Address</th>
                      <th>State</th>
                      <th>PIN</th>
                      <th>Mobile</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tables.engineers.map((eng, idx) => (
                      <tr key={idx}>
                        <td>{eng.name}</td>
                        <td>{eng.email}</td>
                        <td>{eng.address}</td>
                        <td>{eng.state}</td>
                        <td>{eng.pin}</td>
                        <td>{eng.mobile}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Project Contractors Section */}
        <h3 className="associate-details-subheading">Project Contractors</h3>
        <div className="associate-details-row associate-details-innerdivrow">
          <div className="associate-details-col-sm-3">
            <div className="associate-details-form-group">
              <label className="associate-details-label">
                Contractor Nature Of Work<font color="red">*</font>
              </label>
              <input
                name="conNatureWork"
                type="text"
                maxLength="100"
                value={formData.conNatureWork}
                onChange={handleInputChange}
                placeholder="Nature of work"
                className="associate-details-form-control associate-details-inputbox"
              />
            </div>
          </div>
          <div className="associate-details-col-sm-3">
            <div className="associate-details-form-group">
              <label className="associate-details-label">
                Contractor Name<font color="red">*</font>
              </label>
              <input
                name="conName"
                type="text"
                maxLength="75"
                value={formData.conName}
                onChange={handleInputChange}
                placeholder="Contractor Name"
                className="associate-details-form-control associate-details-inputbox"
              />
            </div>
          </div>
          <div className="associate-details-col-sm-3">
            <div className="associate-details-form-group">
              <label className="associate-details-label">Email ID</label>
              <input
                name="conEmail"
                type="text"
                maxLength="50"
                value={formData.conEmail}
                onChange={handleInputChange}
                placeholder="Email ID"
                className="associate-details-form-control associate-details-inputbox"
              />
            </div>
          </div>
          <div className="associate-details-col-sm-3">
            <div className="associate-details-form-group">
              <label className="associate-details-label">
                Address Line 1<font color="red">*</font>
              </label>
              <input
                name="conAdd1"
                type="text"
                maxLength="500"
                value={formData.conAdd1}
                onChange={handleInputChange}
                placeholder="Address Line 1"
                className="associate-details-form-control associate-details-inputbox ttip"
              />
            </div>
          </div>
        </div>
        <div className="associate-details-row associate-details-innerdivrow">
          <div className="associate-details-col-sm-3">
            <div className="associate-details-form-group">
              <label className="associate-details-label">Address Line 2</label>
              <input
                name="conAdd2"
                type="text"
                maxLength="500"
                value={formData.conAdd2}
                onChange={handleInputChange}
                placeholder="Address Line2"
                className="associate-details-form-control associate-details-inputbox associate-details-ttip"
              />
            </div>
          </div>
          <div className="associate-details-col-sm-3">
            <div className="associate-details-form-group">
              <label className="associate-details-label">
                State/UT<font color="red">*</font>
              </label>
              <select
                name="conState"
                value={formData.conState}
                onChange={handleInputChange}
                className="associate-details-form-control associate-details-inputbox"
              >
                {states.map(state => (
                  <option key={state.value} value={state.value}>{state.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="associate-details-col-sm-3">
            <div className="associate-details-form-group">
              <label className="associate-details-label">
                District<font color="red">*</font>
              </label>
              <select
                name="conDistrict"
                value={formData.conDistrict}
                onChange={handleInputChange}
                className="associate-details-form-control associate-details-inputbox"
              >
                <option value="0">Select</option>
              </select>
            </div>
          </div>
          <div className="associate-details-col-sm-3">
            <div className="associate-details-form-group">
              <label className="associate-details-label">
                PIN Code<font color="red">*</font>
              </label>
              <input
                name="conPin"
                type="text"
                maxLength="6"
                value={formData.conPin}
                onChange={handleInputChange}
                placeholder="PIN Code"
                className="associate-details-form-control associate-details-inputbox associate-details-allownumeric"
              />
            </div>
          </div>
        </div>
        <div className="associate-details-row associate-details-innerdivrow">
          <div className="associate-details-col-sm-3">
            <div className="associate-details-form-group">
              <label className="associate-details-label">Year of establishment</label>
              <input
                name="conYearEst"
                type="text"
                maxLength="4"
                value={formData.conYearEst}
                onChange={handleInputChange}
                placeholder="Year of Establishment"
                className="associate-details-form-control associate-details-inputbox associate-details-allownumeric"
              />
            </div>
          </div>
          <div className="associate-details-col-sm-3">
            <div className="associate-details-form-group">
              <label className="associate-details-label">Number of key projects completed</label>
              <input
                name="conKeyProjects"
                type="text"
                maxLength="3"
                value={formData.conKeyProjects}
                onChange={handleInputChange}
                placeholder="No. of Key Projects"
                className="associate-details-form-control associate-details-inputbox associate-details-allownumeric"
              />
            </div>
          </div>
          <div className="associate-details-col-sm-3">
            <div className="associate-details-form-group">
              <label className="associate-details-label">
                Mobile Number<font color="Red">*</font>
              </label>
              <input
                name="conMobile"
                type="text"
                maxLength="10"
                value={formData.conMobile}
                onChange={handleInputChange}
                placeholder="Mobile Number"
                className="associate-details-form-control associate-details-inputbox"
              />
            </div>
          </div>
          <div className="associate-details-row associate-details-innerdivrow">
  <div className="associate-details-col-sm-12 associate-details-add-btn-wrapper">
    <button
      onClick={handleAddAgent}
      className="associate-details-btn associate-details-btn-primary associate-details-add-btn"
    >
      Add
    </button>
  </div>
</div>

        </div>
        {tables.contractors.length > 0 && (
          <div className="associate-details-row associate-details-innerdivrow">
            <div className="associate-details-col-xs-12">
              <div className="associate-details-table-responsive associate-details-tableheader">
                <table className="associate-details-table associate-details-table-striped associate-details-table-bordered">
                  <thead>
                    <tr>
                      <th>Nature of Work</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Address</th>
                      <th>State</th>
                      <th>PIN</th>
                      <th>Mobile</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tables.contractors.map((con, idx) => (
                      <tr key={idx}>
                        <td>{con.natureWork}</td>
                        <td>{con.name}</td>
                        <td>{con.email}</td>
                        <td>{con.address}</td>
                        <td>{con.state}</td>
                        <td>{con.pin}</td>
                        <td>{con.mobile}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Chartered Accountant Section */}
        <h3 className="associate-details-subheading">Chartered Accountant</h3>
        <div className="associate-details-row associate-details-innerdivrow">
          <div className="associate-details-col-sm-3">
            <div className="associate-details-form-group">
              <label className="associate-details-label">
                Chartered Accountant Name<font color="red">*</font>
              </label>
              <input
                name="caName"
                type="text"
                maxLength="75"
                value={formData.caName}
                onChange={handleInputChange}
                placeholder="Chartered Accountant Name"
                className="associate-details-form-control associate-details-inputbox associate-details-alphabetsonly"
              />
            </div>
          </div>
          <div className="associate-details-col-sm-3">
            <div className="associate-details-form-group">
              <label className="associate-details-label">Email ID</label>
              <input
                name="caEmail"
                type="text"
                maxLength="50"
                value={formData.caEmail}
                onChange={handleInputChange}
                placeholder="Email ID"
                className="associate-details-form-control associate-details-inputbox"
              />
            </div>
          </div>
          <div className="associate-details-col-sm-3">
            <div className="associate-details-form-group">
              <label className="associate-details-label">
                Address Line 1<font color="red">*</font>
              </label>
              <input
                name="caAdd1"
                type="text"
                maxLength="500"
                value={formData.caAdd1}
                onChange={handleInputChange}
                placeholder="Address Line 1"
                className="associate-details-form-control associate-details-inputbox associate-details-ttip"
              />
            </div>
          </div>
          <div className="associate-details-col-sm-3">
            <div className="associate-details-form-group">
              <label className="associate-details-label">Address Line 2</label>
              <input
                name="caAdd2"
                type="text"
                maxLength="500"
                value={formData.caAdd2}
                onChange={handleInputChange}
                placeholder="Address Line 2"
                className="associate-details-form-control associate-details-inputbox associate-details-ttip"
              />
            </div>
          </div>
        </div>
        <div className="associate-details-row associate-details-innerdivrow">
          <div className="associate-details-col-sm-3">
            <div className="associate-details-form-group">
              <label className="associate-details-label">
                State/UT<font color="red">*</font>
              </label>
              <select
                name="caState"
                value={formData.caState}
                onChange={handleInputChange}
                className="associate-details-form-control associate-details-inputbox"
              >
                {states.map(state => (
                  <option key={state.value} value={state.value}>{state.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="associate-details-col-sm-3">
            <div className="associate-details-form-group">
              <label className="associate-details-label">
                District<font color="red">*</font>
              </label>
             <select
  name="caDistrict"
  value={formData.caDistrict}
  onChange={handleInputChange}
  className="associate-details-form-control associate-details-inputbox"
>
  <option value="0">Select</option>
  <option value="1">Hyderabad</option>
  <option value="2">Visakhapatnam</option>
  <option value="3">Vijayawada</option>
</select>

            </div>
          </div>
          <div className="associate-details-col-sm-3">
            <div className="associate-details-form-group">
              <label className="associate-details-label">
                PIN Code<font color="red">*</font>
              </label>
              <input
                name="caPin"
                type="text"
                maxLength="6"
                value={formData.caPin}
                onChange={handleInputChange}
                placeholder="PIN Code"
                className="associate-details-form-control associate-details-inputbox associate-details-allownumeric"
              />
            </div>
          </div>
          <div className="associate-details-col-sm-3">
            <div className="associate-details-form-group">
              <label className="associate-details-label">ICAI Member Id</label>
              <input
                name="caMemId"
                type="text"
                maxLength="25"
                value={formData.caMemId}
                onChange={handleInputChange}
                placeholder="ICAI Member Id"
                className="associate-details-form-control associate-details-inputbox"
              />
            </div>
          </div>
        </div>
        <div className="associate-details-row associate-details-innerdivrow">
          <div className="associate-details-col-sm-3">
            <div className="associate-details-form-group">
              <label className="associate-details-label">Number of key projects completed</label>
              <input
                name="caKeyProjects"
                type="text"
                maxLength="3"
                value={formData.caKeyProjects}
                onChange={handleInputChange}
                placeholder="No. of Key Projects Completed"
                className="associate-details-form-control associate-details-inputbox associate-details-allownumeric"
              />
            </div>
          </div>
          <div className="associate-details-col-sm-3">
            <div className="associate-details-form-group">
              <label className="associate-details-label">
                Mobile Number<font color="red">*</font>
              </label>
              <input
                name="caMobile"
                type="text"
                maxLength="10"
                value={formData.caMobile}
                onChange={handleInputChange}
                placeholder="Mobile Number"
                className="associate-details-form-control associate-details-inputbox"
              />
            </div>
          </div>
          <div className="associate-details-row associate-details-innerdivrow">
  <div className="associate-details-col-sm-12 add-btn-wrapper">
    <button
      onClick={handleAddAgent}
      className="associate-details-btn associate-details-btn-primary associate-details-add-btn"
    >
      Add
    </button>
  </div>
</div>

        </div>
        {tables.accountants.length > 0 && (
          <div className="associate-details-row associate-details-innerdivrow">
            <div className="associate-details-col-xs-12">
              <div className="associate-details-table-responsive associate-details-tableheader">
                <table className="associate-details-table associate-details-table-striped associate-details-table-bordered">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Address</th>
                      <th>State</th>
                      <th>PIN</th>
                      <th>Mobile</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tables.accountants.map((ca, idx) => (
                      <tr key={idx}>
                        <td>{ca.name}</td>
                        <td>{ca.email}</td>
                        <td>{ca.address}</td>
                        <td>{ca.state}</td>
                        <td>{ca.pin}</td>
                        <td>{ca.mobile}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Project Engineers Section */}
        <h3 className="associate-details-subheading">Project Engineers</h3>
        <div className="associate-details-row associate-details-innerdivrow">
          <div className="associate-details-col-sm-3">
            <div className="associate-details-form-group">
              <label className="associate-details-label">
                Project Engineer Name<font color="red">*</font>
              </label>
              <input
                name="projEngName"
                type="text"
                maxLength="75"
                value={formData.projEngName}
                onChange={handleInputChange}
                placeholder="Project Engineer Name"
                className="associate-details-form-control associate-details-inputbox associate-details-alphabetsonly"
              />
            </div>
          </div>
          <div className="associate-details-col-sm-3">
            <div className="associate-details-form-group">
              <label className="associate-details-label">Email ID</label>
              <input
                name="projEngEmail"
                type="text"
                maxLength="50"
                value={formData.projEngEmail}
                onChange={handleInputChange}
                placeholder="Email ID"
                className="associate-details-form-control associate-details-inputbox"
              />
            </div>
          </div>
          <div className="associate-details-col-sm-3">
            <div className="associate-details-form-group">
              <label className="associate-details-label">
                Address Line 1<font color="red">*</font>
              </label>
              <input
                name="projEngAdd1"
                type="text"
                maxLength="500"
                value={formData.projEngAdd1}
                onChange={handleInputChange}
                placeholder="Address Line 1"
                className="associate-details-form-control associate-details-inputbox associate-details-ttip"
              />
            </div>
          </div>
          <div className="associate-details-col-sm-3">
            <div className="associate-details-form-group">
              <label className="associate-details-label">Address Line 2</label>
              <input
                name="projEngAdd2"
                type="text"
                maxLength="500"
                value={formData.projEngAdd2}
                onChange={handleInputChange}
                placeholder="Address Line 2"
                className="associate-details-form-control associate-details-inputbox associate-details-ttip"
              />
            </div>
          </div>
        </div>
        <div className="associate-details-row associate-details-innerdivrow">
          <div className="associate-details-col-sm-3">
            <div className="associate-details-form-group">
              <label className="associate-details-label">
                State/UT<font color="red">*</font>
              </label>
              <select
                name="projEngState"
                value={formData.projEngState}
                onChange={handleInputChange}
                className="associate-details-form-control associate-details-inputbox"
              >
                {states.map(state => (
                  <option key={state.value} value={state.value}>{state.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="associate-details-col-sm-3">
            <div className="associate-details-form-group">
              <label className="associate-details-label">
                District<font color="red">*</font>
              </label>
              <select
                name="projEngDistrict"
                value={formData.projEngDistrict}
                onChange={handleInputChange}
                className="associate-details-form-control associate-details-inputbox"
              >
                <option value="0">Select</option>
              </select>
            </div>
          </div>
          <div className="associate-details-col-sm-3">
            <div className="associate-details-form-group">
              <label className="associate-details-label">
                PIN Code<font color="red">*</font>
              </label>
              <input
                name="projEngPin"
                type="text"
                maxLength="6"
                value={formData.projEngPin}
                onChange={handleInputChange}
                placeholder="PIN Code"
                className="associate-details-form-control associate-details-inputbox associate-details-ttip"
              />
            </div>
          </div>
          <div className="associate-details-col-sm-3">
            <div className="associate-details-form-group">
              <label className="associate-details-label">
                Mobile Number<font color="red">*</font>
              </label>
              <input
                name="projEngMobile"
                type="text"
                maxLength="10"
                value={formData.projEngMobile}
                onChange={handleInputChange}
                placeholder="Mobile Number"
                className="associate-details-form-control associate-details-inputbox"
              />
            </div>
          </div>
        </div>
        <div className="associate-details-row associate-details-innerdivrow">
          <div className="associate-details-col-sm-3">
            <div className="associate-details-form-group">
              <label className="associate-details-label">Number of Key projects completed</label>
              <input
                name="projEngKeyProjects"
                type="text"
                maxLength="3"
                value={formData.projEngKeyProjects}
                onChange={handleInputChange}
                placeholder="No. of Key Projects Completed"
                className="associate-details-form-control associate-details-inputbox associate-details-ttip"
              />
            </div>
          </div>
          <div className="associate-details-row associate-details-innerdivrow">
  <div className="associate-details-col-sm-12 associate-details-add-btn-wrapper">
    <button
      onClick={handleAddAgent}
      className="associate-details-btn associate-details-btn-primary associate-details-add-btn"
    >
      Add
    </button>
  </div>
</div>

        </div>
        {tables.projectEngineers.length > 0 && (
          <div className="associate-details-row associate-details-innerdivrow">
            <div className="associate-details-col-xs-12">
              <div className="associate-details-table-responsive associate-details-tableheader">
                <table className="associate-details-table associate-details-table-striped associate-details-table-bordered">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Address</th>
                      <th>State</th>
                      <th>PIN</th>
                      <th>Mobile</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tables.projectEngineers.map((pe, idx) => (
                      <tr key={idx}>
                        <td>{pe.name}</td>
                        <td>{pe.email}</td>
                        <td>{pe.address}</td>
                        <td>{pe.state}</td>
                        <td>{pe.pin}</td>
                        <td>{pe.mobile}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Save and Continue Button */}
        <div className="associate-details-add-btn-wrapper">
  <button
    onClick={handleSaveAndContinue}
    className="associate-details-btn associate-details-btn-primary associate-details-add-btn"
  >
    Save and Continue
  </button>
</div>

      </div>
    </div>
  );
};

export default AssociateDetails;