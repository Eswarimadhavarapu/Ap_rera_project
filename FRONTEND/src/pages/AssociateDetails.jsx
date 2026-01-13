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
    { value: '2', label: 'Andhra Pradesh' }
  ];
  const districtsByState = {
    "2": [
      "Anakapalli",
      "Anantapur",
      "Annamayya",
      "Bapatla",
      "Chittoor",
      "Dr. B.R. Ambedkar Konaseema",
      "East Godavari",
      "Eluru",
      "Guntur",
      "Kakinada",
      "Krishna",
      "Kurnool",
      "Nandyal",
      "NTR",
      "Palnadu",
      "Parvathipuram Manyam",
      "Prakasam",
      "Sri Potti Sriramulu Nellore",
      "Sri Sathya Sai",
      "Srikakulam",
      "Tirupati",
      "Visakhapatnam",
      "Vizianagaram",
      "West Godavari",
      "YSR Kadapa"
    ]
  };
  // ─── Allow only numbers ─────────────────────────────────────────────
  const allowOnlyNumbers = (e) => {
    const charCode = e.which ? e.which : e.keyCode;
    if (charCode < 48 || charCode > 57) {
      e.preventDefault();
    }
  };
  const allowOnlyNumbersOnPaste = (e) => {
    const pastedText = (e.clipboardData || window.clipboardData).getData('text');
    if (!/^\d*$/.test(pastedText)) {
      e.preventDefault();
    }
  };
  // ─── Allow only letters (for names, nature of work) ─────────────────
  const allowOnlyLetters = (e) => {
    const charCode = e.which ? e.which : e.keyCode;
    if (charCode > 31 && (charCode < 65 || charCode > 90) && (charCode < 97 || charCode > 122) && charCode !== 32) {
      e.preventDefault();
    }
  };
  const allowOnlyLettersOnPaste = (e) => {
    const pastedText = (e.clipboardData || window.clipboardData).getData('text');
    if (!/^[a-zA-Z\s]*$/.test(pastedText)) {
      e.preventDefault();
    }
  };
  // ─── Allow address characters (alphanumeric + common punctuation) ───
  const allowAddressChars = (e) => {
    const charCode = e.which ? e.which : e.keyCode;
    if (charCode > 31 && !((charCode >= 48 && charCode <= 57) || (charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122) || charCode === 32 || charCode === 44 || charCode === 46 || charCode === 45 || charCode === 47 || charCode === 40 || charCode === 41 || charCode === 35)) {
      e.preventDefault();
    }
  };
  const allowAddressCharsOnPaste = (e) => {
    const pastedText = (e.clipboardData || window.clipboardData).getData('text');
    if (!/^[a-zA-Z0-9\s,.-\/()#]*$/.test(pastedText)) {
      e.preventDefault();
    }
  };
  // ─── Allow alphanumeric (for reg nos, lic nos, mem ids) ─────────────
  const allowAlphanumeric = (e) => {
    const charCode = e.which ? e.which : e.keyCode;
    if (charCode > 31 && !((charCode >= 48 && charCode <= 57) || (charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122))) {
      e.preventDefault();
    }
  };
  const allowAlphanumericOnPaste = (e) => {
    const pastedText = (e.clipboardData || window.clipboardData).getData('text');
    if (!/^[a-zA-Z0-9]*$/.test(pastedText)) {
      e.preventDefault();
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
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
    if (
      !formData.arcName ||
      !formData.arcAdd1 ||
      formData.arcState === "0" ||
      formData.arcDistrict === "0" ||
      !formData.arcPin ||
      !formData.arcMobile
    ) {
      alert("Please fill all required fields");
      return;
    }
    setTables(prev => ({
      ...prev,
      architects: [
        ...prev.architects,
        {
          name: formData.arcName,
          email: formData.arcEmail,
          address: `${formData.arcAdd1}${formData.arcAdd2 ? ', ' + formData.arcAdd2 : ''}`,
          state: states.find(s => s.value === formData.arcState)?.label || '',
          district: formData.arcDistrict,
          pin: formData.arcPin,
          mobile: formData.arcMobile
        }
      ]
    }));
    setFormData(prev => ({
      ...prev,
      arcName: "", arcEmail: "", arcAdd1: "", arcAdd2: "", arcState: "0",
      arcDistrict: "0", arcPin: "", arcYearEst: "", arcKeyProjects: "",
      arcRegCOA: "", arcMobile: ""
    }));
  };
  const handleAddEngineer = (e) => {
    e.preventDefault();
    if (
      !formData.engName ||
      !formData.engAdd1 ||
      formData.engState === "0" ||
      formData.engDistrict === "0" ||
      !formData.engPin ||
      !formData.engMobile
    ) {
      alert('Please fill all required fields');
      return;
    }
    setTables(prev => ({
      ...prev,
      engineers: [...prev.engineers, {
        name: formData.engName,
        email: formData.engEmail,
        address: `${formData.engAdd1}${formData.engAdd2 ? ', ' + formData.engAdd2 : ''}`,
        state: states.find(s => s.value === formData.engState)?.label || '',
        district: formData.engDistrict,
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
    if (
      !formData.conNatureWork ||
      !formData.conName ||
      !formData.conAdd1 ||
      formData.conState === "0" ||
      formData.conDistrict === "0" ||
      !formData.conPin ||
      !formData.conMobile
    ) {
      alert('Please fill all required fields');
      return;
    }
    setTables(prev => ({
      ...prev,
      contractors: [...prev.contractors, {
        natureWork: formData.conNatureWork,
        name: formData.conName,
        email: formData.conEmail,
        address: `${formData.conAdd1}${formData.conAdd2 ? ', ' + formData.conAdd2 : ''}`,
        state: states.find(s => s.value === formData.conState)?.label || '',
        district: formData.conDistrict,
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
    if (
      !formData.caName ||
      !formData.caAdd1 ||
      formData.caState === "0" ||
      formData.caDistrict === "0" ||
      !formData.caPin ||
      !formData.caMobile
    ) {
      alert('Please fill all required fields');
      return;
    }
    setTables(prev => ({
      ...prev,
      accountants: [...prev.accountants, {
        name: formData.caName,
        email: formData.caEmail,
        address: `${formData.caAdd1}${formData.caAdd2 ? ', ' + formData.caAdd2 : ''}`,
        state: states.find(s => s.value === formData.caState)?.label || '',
        district: formData.caDistrict,
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
    if (
      !formData.projEngName ||
      !formData.projEngAdd1 ||
      formData.projEngState === "0" ||
      formData.projEngDistrict === "0" ||
      !formData.projEngPin ||
      !formData.projEngMobile
    ) {
      alert('Please fill all required fields');
      return;
    }
    setTables(prev => ({
      ...prev,
      projectEngineers: [...prev.projectEngineers, {
        name: formData.projEngName,
        email: formData.projEngEmail,
        address: `${formData.projEngAdd1}${formData.projEngAdd2 ? ', ' + formData.projEngAdd2 : ''}`,
        state: states.find(s => s.value === formData.projEngState)?.label || '',
        district: formData.projEngDistrict,
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
  const handleDeleteRow = (tableName, index) => {
    setTables(prev => ({
      ...prev,
      [tableName]: prev[tableName].filter((_, i) => i !== index)
    }));
  };
  const completeStep = (stepNo) => {
    const completedSteps = JSON.parse(localStorage.getItem("completedSteps")) || [];
    if (!completedSteps.includes(stepNo)) {
      completedSteps.push(stepNo);
      localStorage.setItem("completedSteps", JSON.stringify(completedSteps));
    }
  };
  const handleSaveAndContinue = () => {
    console.log('All Data:', { formData, tables });
    completeStep(4);
    navigate("/Upload-Documents");
  };
  return (
    <div className="associate-details-associate-details-container">
      <div className="associate-details-breadcrumb">
        <span>You are here : </span>
        <a href="/">Home</a>
        <span> / </span>
        <span>Registration / Project Registration</span>
      </div>
      <div className="associate-details-page-header">
        <h1>Project Registration</h1>
      </div>
      <ProjectWizard currentStep={4} />
      <div className="associate-details-panel-body">
        {/* Project Agent */}
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
                onKeyPress={allowAlphanumeric}
                onPaste={allowAlphanumericOnPaste}
                placeholder="Agent RERA Reg No" 
                className="associate-details-form-control associate-details-inputbox" 
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
                onKeyPress={allowOnlyLetters}
                onPaste={allowOnlyLettersOnPaste}
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
                onKeyPress={allowAddressChars}
                onPaste={allowAddressCharsOnPaste}
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
                onKeyPress={allowOnlyNumbers}
                onPaste={allowOnlyNumbersOnPaste}
                placeholder="Mobile Number"
                className="associate-details-form-control associate-details-inputbox"
              />
            </div>
          </div>
        </div>
        <div className="associate-details-row associate-details-innerdivrow">
          <div className="associate-details-col-sm-12 associate-details-add-btn-wrapper">
            <button onClick={handleAddAgent} className="associate-details-btn associate-details-btn-primary associate-details-add-btn">Add</button>
          </div>
        </div>
        {tables.agents.length > 0 && (
          <div className="associate-details-row associate-details-innerdivrow">
            <div className="associate-details-col-xs-12">
              <div className="associate-details-table-responsive associate-details-tableheader">
                <table className="associate-details-table associate-details-table-striped associate-details-table-bordered">
                  <thead><tr><th>Reg No</th><th>Name</th><th>Address</th><th>Mobile</th><th>Action</th></tr></thead>
                  <tbody>
                    {tables.agents.map((agent, idx) => (
                      <tr key={idx}>
                        <td>{agent.regNo}</td>
                        <td>{agent.name}</td>
                        <td>{agent.address}</td>
                        <td>{agent.mobile}</td>
                        <td><button className="associate-details-btn associate-details-btn-danger associate-details-btn-sm" onClick={() => handleDeleteRow("agents", idx)}>Delete</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        {/* Project Architects */}
        <h3 className="associate-details-subheading">Project Architects</h3>
        <div className="associate-details-row associate-details-innerdivrow">
          <div className="associate-details-col-sm-3">
            <div className="associate-details-form-group">
              <label>Architect Name <font color="red">*</font></label>
              <input 
                name="arcName" 
                type="text" 
                maxLength="75" 
                value={formData.arcName} 
                onChange={handleInputChange} 
                onKeyPress={allowOnlyLetters}
                onPaste={allowOnlyLettersOnPaste}
                placeholder="Architect Name" 
                className="associate-details-form-control associate-details-inputbox" 
              />
            </div>
          </div>
          <div className="associate-details-col-sm-3">
            <div className="associate-details-form-group">
              <label>Email ID</label>
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
              <label>Address Line 1 <font color="red">*</font></label>
              <input 
                name="arcAdd1" 
                type="text" 
                maxLength="500" 
                value={formData.arcAdd1} 
                onChange={handleInputChange} 
                onKeyPress={allowAddressChars}
                onPaste={allowAddressCharsOnPaste}
                placeholder="Address Line 1" 
                className="associate-details-form-control associate-details-inputbox" 
              />
            </div>
          </div>
          <div className="associate-details-col-sm-3">
            <div className="associate-details-form-group">
              <label>Address Line 2</label>
              <input 
                name="arcAdd2" 
                type="text" 
                maxLength="500" 
                value={formData.arcAdd2} 
                onChange={handleInputChange} 
                onKeyPress={allowAddressChars}
                onPaste={allowAddressCharsOnPaste}
                placeholder="Address Line 2" 
                className="associate-details-form-control associate-details-inputbox" 
              />
            </div>
          </div>
        </div>
        <div className="associate-details-row associate-details-innerdivrow">
          <div className="associate-details-col-sm-3">
            <div className="associate-details-form-group">
              <label>State/UT <font color="red">*</font></label>
              <select name="arcState" value={formData.arcState} onChange={handleInputChange} className="associate-details-form-control associate-details-inputbox">
                {states.map(state => <option key={state.value} value={state.value}>{state.label}</option>)}
              </select>
            </div>
          </div>
          <div className="associate-details-col-sm-3">
            <div className="associate-details-form-group">
              <label>District <font color="red">*</font></label>
              <select name="arcDistrict" value={formData.arcDistrict} onChange={handleInputChange} disabled={formData.arcState === '0'} className="associate-details-form-control associate-details-inputbox">
                <option value="0">{formData.arcState === '0' ? 'Select State first' : 'Select'}</option>
                {(districtsByState[formData.arcState] || []).map((d, i) => <option key={i} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
          <div className="associate-details-col-sm-3">
            <div className="associate-details-form-group">
              <label>PIN Code <font color="red">*</font></label>
              <input 
                name="arcPin" 
                type="text" 
                maxLength="6" 
                value={formData.arcPin} 
                onChange={handleInputChange} 
                onKeyPress={allowOnlyNumbers} 
                onPaste={allowOnlyNumbersOnPaste} 
                placeholder="PIN Code" 
                className="associate-details-form-control associate-details-inputbox" 
              />
            </div>
          </div>
          <div className="associate-details-col-sm-3">
            <div className="associate-details-form-group">
              <label>Year of establishment</label>
              <input 
                name="arcYearEst" 
                type="text" 
                maxLength="4" 
                value={formData.arcYearEst} 
                onChange={handleInputChange} 
                onKeyPress={allowOnlyNumbers} 
                onPaste={allowOnlyNumbersOnPaste} 
                placeholder="Year of Establishment" 
                className="associate-details-form-control associate-details-inputbox" 
              />
            </div>
          </div>
        </div>
        <div className="associate-details-row associate-details-innerdivrow">
          <div className="associate-details-col-sm-3">
            <div className="associate-details-form-group">
              <label>Number of key projects completed</label>
              <input 
                name="arcKeyProjects" 
                type="text" 
                maxLength="3" 
                value={formData.arcKeyProjects} 
                onChange={handleInputChange} 
                onKeyPress={allowOnlyNumbers} 
                onPaste={allowOnlyNumbersOnPaste} 
                placeholder="Number of Key projects" 
                className="associate-details-form-control associate-details-inputbox" 
              />
            </div>
          </div>
          <div className="associate-details-col-sm-3">
            <div className="associate-details-form-group">
              <label>Reg. Number With COA</label>
              <input 
                name="arcRegCOA" 
                type="text" 
                maxLength="25" 
                value={formData.arcRegCOA} 
                onChange={handleInputChange} 
                onKeyPress={allowAlphanumeric}
                onPaste={allowAlphanumericOnPaste}
                placeholder="Reg. Number With COA" 
                className="associate-details-form-control associate-details-inputbox" 
              />
            </div>
          </div>
          <div className="associate-details-col-sm-3">
            <div className="associate-details-form-group">
              <label>Mobile Number <font color="red">*</font></label>
              <input 
                name="arcMobile" 
                type="text" 
                maxLength="10" 
                value={formData.arcMobile} 
                onChange={handleInputChange} 
                onKeyPress={allowOnlyNumbers} 
                onPaste={allowOnlyNumbersOnPaste} 
                placeholder="Mobile Number" 
                className="associate-details-form-control associate-details-inputbox" 
              />
            </div>
          </div>
        </div>
        <div className="associate-details-row associate-details-innerdivrow">
          <div className="associate-details-col-sm-12 associate-details-add-btn-wrapper">
            <button onClick={handleAddArchitect} className="associate-details-btn associate-details-btn-primary associate-details-add-btn">Add</button>
          </div>
        </div>
        {tables.architects.length > 0 && (
          <div className="associate-details-row associate-details-innerdivrow">
            <div className="associate-details-col-xs-12">
              <div className="associate-details-table-responsive associate-details-tableheader">
                <table className="associate-details-table associate-details-table-striped associate-details-table-bordered">
                  <thead><tr><th>Name</th><th>Email</th><th>Address</th><th>State</th><th>District</th><th>PIN</th><th>Mobile</th><th>Action</th></tr></thead>
                  <tbody>
                    {tables.architects.map((arc, idx) => (
                      <tr key={idx}>
                        <td>{arc.name}</td><td>{arc.email}</td><td>{arc.address}</td><td>{arc.state}</td><td>{arc.district}</td><td>{arc.pin}</td><td>{arc.mobile}</td>
                        <td><button className="associate-details-btn associate-details-btn-danger associate-details-btn-sm" onClick={() => handleDeleteRow("architects", idx)}>Delete</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        {/* Structural Engineer */}
        <h3 className="associate-details-subheading">Structural Engineer</h3>
        <div className="associate-details-row associate-details-innerdivrow">
          <div className="associate-details-col-sm-3">
            <div className="associate-details-form-group">
              <label>Engineer Name <font color="red">*</font></label>
              <input 
                name="engName" 
                type="text" 
                maxLength="75" 
                value={formData.engName} 
                onChange={handleInputChange} 
                onKeyPress={allowOnlyLetters}
                onPaste={allowOnlyLettersOnPaste}
                placeholder="Engineer Name" 
                className="associate-details-form-control associate-details-inputbox" 
              />
            </div>
          </div>
          <div className="associate-details-col-sm-3">
            <div className="associate-details-form-group">
              <label>Email ID</label>
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
              <label>Address Line 1 <font color="red">*</font></label>
              <input 
                name="engAdd1" 
                type="text" 
                maxLength="500" 
                value={formData.engAdd1} 
                onChange={handleInputChange} 
                onKeyPress={allowAddressChars}
                onPaste={allowAddressCharsOnPaste}
                placeholder="Address Line 1" 
                className="associate-details-form-control associate-details-inputbox" 
              />
            </div>
          </div>
          <div className="associate-details-col-sm-3">
            <div className="associate-details-form-group">
              <label>Address Line 2</label>
              <input 
                name="engAdd2" 
                type="text" 
                maxLength="500" 
                value={formData.engAdd2} 
                onChange={handleInputChange} 
                onKeyPress={allowAddressChars}
                onPaste={allowAddressCharsOnPaste}
                placeholder="Address Line 2" 
                className="associate-details-form-control associate-details-inputbox" 
              />
            </div>
          </div>
        </div>
        <div className="associate-details-row associate-details-innerdivrow">
          <div className="associate-details-col-sm-3">
            <div className="associate-details-form-group">
              <label>State/UT <font color="red">*</font></label>
              <select name="engState" value={formData.engState} onChange={handleInputChange} className="associate-details-form-control associate-details-inputbox">
                {states.map(state => <option key={state.value} value={state.value}>{state.label}</option>)}
              </select>
            </div>
          </div>
          <div className="associate-details-col-sm-3">
            <div className="associate-details-form-group">
              <label>District <font color="red">*</font></label>
              <select name="engDistrict" value={formData.engDistrict} onChange={handleInputChange} disabled={formData.engState === '0'} className="associate-details-form-control associate-details-inputbox">
                <option value="0">{formData.engState === '0' ? 'Select State first' : 'Select'}</option>
                {(districtsByState[formData.engState] || []).map((d, i) => <option key={i} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
          <div className="associate-details-col-sm-3">
            <div className="associate-details-form-group">
              <label>PIN Code <font color="red">*</font></label>
              <input 
                name="engPin" 
                type="text" 
                maxLength="6" 
                value={formData.engPin} 
                onChange={handleInputChange} 
                onKeyPress={allowOnlyNumbers} 
                onPaste={allowOnlyNumbersOnPaste} 
                placeholder="PIN Code" 
                className="associate-details-form-control associate-details-inputbox" 
              />
            </div>
          </div>
          <div className="associate-details-col-sm-3">
            <div className="associate-details-form-group">
              <label>Year of establishment</label>
              <input 
                name="engYearEst" 
                type="text" 
                maxLength="4" 
                value={formData.engYearEst} 
                onChange={handleInputChange} 
                onKeyPress={allowOnlyNumbers} 
                onPaste={allowOnlyNumbersOnPaste} 
                placeholder="Year of Establishment" 
                className="associate-details-form-control associate-details-inputbox" 
              />
            </div>
          </div>
        </div>
        <div className="associate-details-row associate-details-innerdivrow">
          <div className="associate-details-col-sm-3">
            <div className="associate-details-form-group">
              <label>Number of key projects completed</label>
              <input 
                name="engKeyProjects" 
                type="text" 
                maxLength="3" 
                value={formData.engKeyProjects} 
                onChange={handleInputChange} 
                onKeyPress={allowOnlyNumbers} 
                onPaste={allowOnlyNumbersOnPaste} 
                placeholder="Number of Key projects" 
                className="associate-details-form-control associate-details-inputbox" 
              />
            </div>
          </div>
          <div className="associate-details-col-sm-3">
            <div className="associate-details-form-group">
              <label>License Number</label>
              <input 
                name="engLicNo" 
                type="text" 
                maxLength="25" 
                value={formData.engLicNo} 
                onChange={handleInputChange} 
                onKeyPress={allowAlphanumeric}
                onPaste={allowAlphanumericOnPaste}
                placeholder="License Number" 
                className="associate-details-form-control associate-details-inputbox" 
              />
            </div>
          </div>
          <div className="associate-details-col-sm-3">
            <div className="associate-details-form-group">
              <label>Mobile Number <font color="red">*</font></label>
              <input 
                name="engMobile" 
                type="text" 
                maxLength="10" 
                value={formData.engMobile} 
                onChange={handleInputChange} 
                onKeyPress={allowOnlyNumbers} 
                onPaste={allowOnlyNumbersOnPaste} 
                placeholder="Mobile Number" 
                className="associate-details-form-control associate-details-inputbox" 
              />
            </div>
          </div>
        </div>
        <div className="associate-details-row associate-details-innerdivrow">
          <div className="associate-details-col-sm-12 associate-details-add-btn-wrapper">
            <button onClick={handleAddEngineer} className="associate-details-btn associate-details-btn-primary associate-details-add-btn">Add</button>
          </div>
        </div>
        {tables.engineers.length > 0 && (
          <div className="associate-details-row associate-details-innerdivrow">
            <div className="associate-details-col-xs-12">
              <div className="associate-details-table-responsive associate-details-tableheader">
                <table className="associate-details-table associate-details-table-striped associate-details-table-bordered">
                  <thead><tr><th>Name</th><th>Email</th><th>Address</th><th>State</th><th>District</th><th>PIN</th><th>Mobile</th><th>Action</th></tr></thead>
                  <tbody>
                    {tables.engineers.map((eng, idx) => (
                      <tr key={idx}>
                        <td>{eng.name}</td><td>{eng.email}</td><td>{eng.address}</td><td>{eng.state}</td><td>{eng.district}</td><td>{eng.pin}</td><td>{eng.mobile}</td>
                        <td><button className="associate-details-btn associate-details-btn-danger associate-details-btn-sm" onClick={() => handleDeleteRow("engineers", idx)}>Delete</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        {/* Contractor */}
        <h3 className="associate-details-subheading">Contractor</h3>
        <div className="associate-details-row associate-details-innerdivrow">
          <div className="associate-details-col-sm-3">
            <div className="associate-details-form-group">
              <label>Nature of Work <font color="red">*</font></label>
              <input 
                name="conNatureWork" 
                type="text" 
                maxLength="100" 
                value={formData.conNatureWork} 
                onChange={handleInputChange} 
                onKeyPress={allowOnlyLetters}
                onPaste={allowOnlyLettersOnPaste}
                placeholder="Nature of Work" 
                className="associate-details-form-control associate-details-inputbox" 
              />
            </div>
          </div>
          <div className="associate-details-col-sm-3">
            <div className="associate-details-form-group">
              <label>Contractor Name <font color="red">*</font></label>
              <input 
                name="conName" 
                type="text" 
                maxLength="75" 
                value={formData.conName} 
                onChange={handleInputChange} 
                onKeyPress={allowOnlyLetters}
                onPaste={allowOnlyLettersOnPaste}
                placeholder="Contractor Name" 
                className="associate-details-form-control associate-details-inputbox" 
              />
            </div>
          </div>
          <div className="associate-details-col-sm-3">
            <div className="associate-details-form-group">
              <label>Email ID</label>
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
              <label>Address Line 1 <font color="red">*</font></label>
              <input 
                name="conAdd1" 
                type="text" 
                maxLength="500" 
                value={formData.conAdd1} 
                onChange={handleInputChange} 
                onKeyPress={allowAddressChars}
                onPaste={allowAddressCharsOnPaste}
                placeholder="Address Line 1" 
                className="associate-details-form-control associate-details-inputbox" 
              />
            </div>
          </div>
        </div>
        <div className="associate-details-row associate-details-innerdivrow">
          <div className="associate-details-col-sm-3">
            <div className="associate-details-form-group">
              <label>Address Line 2</label>
              <input 
                name="conAdd2" 
                type="text" 
                maxLength="500" 
                value={formData.conAdd2} 
                onChange={handleInputChange} 
                onKeyPress={allowAddressChars}
                onPaste={allowAddressCharsOnPaste}
                placeholder="Address Line 2" 
                className="associate-details-form-control associate-details-inputbox" 
              />
            </div>
          </div>
          <div className="associate-details-col-sm-3">
            <div className="associate-details-form-group">
              <label>State/UT <font color="red">*</font></label>
              <select name="conState" value={formData.conState} onChange={handleInputChange} className="associate-details-form-control associate-details-inputbox">
                {states.map(state => <option key={state.value} value={state.value}>{state.label}</option>)}
              </select>
            </div>
          </div>
          <div className="associate-details-col-sm-3">
            <div className="associate-details-form-group">
              <label>District <font color="red">*</font></label>
              <select name="conDistrict" value={formData.conDistrict} onChange={handleInputChange} disabled={formData.conState === '0'} className="associate-details-form-control associate-details-inputbox">
                <option value="0">{formData.conState === '0' ? 'Select State first' : 'Select'}</option>
                {(districtsByState[formData.conState] || []).map((d, i) => <option key={i} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
          <div className="associate-details-col-sm-3">
            <div className="associate-details-form-group">
              <label>PIN Code <font color="red">*</font></label>
              <input 
                name="conPin" 
                type="text" 
                maxLength="6" 
                value={formData.conPin} 
                onChange={handleInputChange} 
                onKeyPress={allowOnlyNumbers} 
                onPaste={allowOnlyNumbersOnPaste} 
                placeholder="PIN Code" 
                className="associate-details-form-control associate-details-inputbox" 
              />
            </div>
          </div>
        </div>
        <div className="associate-details-row associate-details-innerdivrow">
          <div className="associate-details-col-sm-3">
            <div className="associate-details-form-group">
              <label>Year of establishment</label>
              <input 
                name="conYearEst" 
                type="text" 
                maxLength="4" 
                value={formData.conYearEst} 
                onChange={handleInputChange} 
                onKeyPress={allowOnlyNumbers} 
                onPaste={allowOnlyNumbersOnPaste} 
                placeholder="Year of Establishment" 
                className="associate-details-form-control associate-details-inputbox" 
              />
            </div>
          </div>
          <div className="associate-details-col-sm-3">
            <div className="associate-details-form-group">
              <label>Number of key projects completed</label>
              <input 
                name="conKeyProjects" 
                type="text" 
                maxLength="3" 
                value={formData.conKeyProjects} 
                onChange={handleInputChange} 
                onKeyPress={allowOnlyNumbers} 
                onPaste={allowOnlyNumbersOnPaste} 
                placeholder="Number of Key projects" 
                className="associate-details-form-control associate-details-inputbox" 
              />
            </div>
          </div>
          <div className="associate-details-col-sm-3">
            <div className="associate-details-form-group">
              <label>Mobile Number <font color="red">*</font></label>
              <input 
                name="conMobile" 
                type="text" 
                maxLength="10" 
                value={formData.conMobile} 
                onChange={handleInputChange} 
                onKeyPress={allowOnlyNumbers} 
                onPaste={allowOnlyNumbersOnPaste} 
                placeholder="Mobile Number" 
                className="associate-details-form-control associate-details-inputbox" 
              />
            </div>
          </div>
        </div>
        <div className="associate-details-row associate-details-innerdivrow">
          <div className="associate-details-col-sm-12 associate-details-add-btn-wrapper">
            <button onClick={handleAddContractor} className="associate-details-btn associate-details-btn-primary associate-details-add-btn">Add</button>
          </div>
        </div>
        {tables.contractors.length > 0 && (
          <div className="associate-details-row associate-details-innerdivrow">
            <div className="associate-details-col-xs-12">
              <div className="associate-details-table-responsive associate-details-tableheader">
                <table className="associate-details-table associate-details-table-striped associate-details-table-bordered">
                  <thead><tr><th>Nature of Work</th><th>Name</th><th>Email</th><th>Address</th><th>State</th><th>District</th><th>PIN</th><th>Mobile</th><th>Action</th></tr></thead>
                  <tbody>
                    {tables.contractors.map((con, idx) => (
                      <tr key={idx}>
                        <td>{con.natureWork}</td><td>{con.name}</td><td>{con.email}</td><td>{con.address}</td><td>{con.state}</td><td>{con.district}</td><td>{con.pin}</td><td>{con.mobile}</td>
                        <td><button className="associate-details-btn associate-details-btn-danger associate-details-btn-sm" onClick={() => handleDeleteRow("contractors", idx)}>Delete</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        {/* Chartered Accountant */}
        <h3 className="associate-details-subheading">Chartered Accountant</h3>
        <div className="associate-details-row associate-details-innerdivrow">
          <div className="associate-details-col-sm-3">
            <div className="associate-details-form-group">
              <label>Accountant Name <font color="red">*</font></label>
              <input 
                name="caName" 
                type="text" 
                maxLength="75" 
                value={formData.caName} 
                onChange={handleInputChange} 
                onKeyPress={allowOnlyLetters}
                onPaste={allowOnlyLettersOnPaste}
                placeholder="Accountant Name" 
                className="associate-details-form-control associate-details-inputbox" 
              />
            </div>
          </div>
          <div className="associate-details-col-sm-3">
            <div className="associate-details-form-group">
              <label>Email ID</label>
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
              <label>Address Line 1 <font color="red">*</font></label>
              <input 
                name="caAdd1" 
                type="text" 
                maxLength="500" 
                value={formData.caAdd1} 
                onChange={handleInputChange} 
                onKeyPress={allowAddressChars}
                onPaste={allowAddressCharsOnPaste}
                placeholder="Address Line 1" 
                className="associate-details-form-control associate-details-inputbox" 
              />
            </div>
          </div>
          <div className="associate-details-col-sm-3">
            <div className="associate-details-form-group">
              <label>Address Line 2</label>
              <input 
                name="caAdd2" 
                type="text" 
                maxLength="500" 
                value={formData.caAdd2} 
                onChange={handleInputChange} 
                onKeyPress={allowAddressChars}
                onPaste={allowAddressCharsOnPaste}
                placeholder="Address Line 2" 
                className="associate-details-form-control associate-details-inputbox" 
              />
            </div>
          </div>
        </div>
        <div className="associate-details-row associate-details-innerdivrow">
          <div className="associate-details-col-sm-3">
            <div className="associate-details-form-group">
              <label>State/UT <font color="red">*</font></label>
              <select name="caState" value={formData.caState} onChange={handleInputChange} className="associate-details-form-control associate-details-inputbox">
                {states.map(state => <option key={state.value} value={state.value}>{state.label}</option>)}
              </select>
            </div>
          </div>
          <div className="associate-details-col-sm-3">
            <div className="associate-details-form-group">
              <label>District <font color="red">*</font></label>
              <select name="caDistrict" value={formData.caDistrict} onChange={handleInputChange} disabled={formData.caState === '0'} className="associate-details-form-control associate-details-inputbox">
                <option value="0">{formData.caState === '0' ? 'Select State first' : 'Select'}</option>
                {(districtsByState[formData.caState] || []).map((d, i) => <option key={i} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
          <div className="associate-details-col-sm-3">
            <div className="associate-details-form-group">
              <label>PIN Code <font color="red">*</font></label>
              <input 
                name="caPin" 
                type="text" 
                maxLength="6" 
                value={formData.caPin} 
                onChange={handleInputChange} 
                onKeyPress={allowOnlyNumbers} 
                onPaste={allowOnlyNumbersOnPaste} 
                placeholder="PIN Code" 
                className="associate-details-form-control associate-details-inputbox" 
              />
            </div>
          </div>
          <div className="associate-details-col-sm-3">
            <div className="associate-details-form-group">
              <label>Membership ID</label>
              <input 
                name="caMemId" 
                type="text" 
                maxLength="25" 
                value={formData.caMemId} 
                onChange={handleInputChange} 
                onKeyPress={allowAlphanumeric}
                onPaste={allowAlphanumericOnPaste}
                placeholder="Membership ID" 
                className="associate-details-form-control associate-details-inputbox" 
              />
            </div>
          </div>
        </div>
        <div className="associate-details-row associate-details-innerdivrow">
          <div className="associate-details-col-sm-3">
            <div className="associate-details-form-group">
              <label>Number of key projects completed</label>
              <input 
                name="caKeyProjects" 
                type="text" 
                maxLength="3" 
                value={formData.caKeyProjects} 
                onChange={handleInputChange} 
                onKeyPress={allowOnlyNumbers} 
                onPaste={allowOnlyNumbersOnPaste} 
                placeholder="Number of Key projects" 
                className="associate-details-form-control associate-details-inputbox" 
              />
            </div>
          </div>
          <div className="associate-details-col-sm-3">
            <div className="associate-details-form-group">
              <label>Mobile Number <font color="red">*</font></label>
              <input 
                name="caMobile" 
                type="text" 
                maxLength="10" 
                value={formData.caMobile} 
                onChange={handleInputChange} 
                onKeyPress={allowOnlyNumbers} 
                onPaste={allowOnlyNumbersOnPaste} 
                placeholder="Mobile Number" 
                className="associate-details-form-control associate-details-inputbox" 
              />
            </div>
          </div>
        </div>
        <div className="associate-details-row associate-details-innerdivrow">
          <div className="associate-details-col-sm-12 associate-details-add-btn-wrapper">
            <button onClick={handleAddCA} className="associate-details-btn associate-details-btn-primary associate-details-add-btn">Add</button>
          </div>
        </div>
        {tables.accountants.length > 0 && (
          <div className="associate-details-row associate-details-innerdivrow">
            <div className="associate-details-col-xs-12">
              <div className="associate-details-table-responsive associate-details-tableheader">
                <table className="associate-details-table associate-details-table-striped associate-details-table-bordered">
                  <thead><tr><th>Name</th><th>Email</th><th>Address</th><th>State</th><th>District</th><th>PIN</th><th>Mobile</th><th>Action</th></tr></thead>
                  <tbody>
                    {tables.accountants.map((ca, idx) => (
                      <tr key={idx}>
                        <td>{ca.name}</td><td>{ca.email}</td><td>{ca.address}</td><td>{ca.state}</td><td>{ca.district}</td><td>{ca.pin}</td><td>{ca.mobile}</td>
                        <td><button className="associate-details-btn associate-details-btn-danger associate-details-btn-sm" onClick={() => handleDeleteRow("accountants", idx)}>Delete</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        {/* Project Engineer */}
        <h3 className="associate-details-subheading">Project Engineer</h3>
        <div className="associate-details-row associate-details-innerdivrow">
          <div className="associate-details-col-sm-3">
            <div className="associate-details-form-group">
              <label>Project Engineer Name <font color="red">*</font></label>
              <input 
                name="projEngName" 
                type="text" 
                maxLength="75" 
                value={formData.projEngName} 
                onChange={handleInputChange} 
                onKeyPress={allowOnlyLetters}
                onPaste={allowOnlyLettersOnPaste}
                placeholder="Project Engineer Name" 
                className="associate-details-form-control associate-details-inputbox" 
              />
            </div>
          </div>
          <div className="associate-details-col-sm-3">
            <div className="associate-details-form-group">
              <label>Email ID</label>
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
              <label>Address Line 1 <font color="red">*</font></label>
              <input 
                name="projEngAdd1" 
                type="text" 
                maxLength="500" 
                value={formData.projEngAdd1} 
                onChange={handleInputChange} 
                onKeyPress={allowAddressChars}
                onPaste={allowAddressCharsOnPaste}
                placeholder="Address Line 1" 
                className="associate-details-form-control associate-details-inputbox" 
              />
            </div>
          </div>
          <div className="associate-details-col-sm-3">
            <div className="associate-details-form-group">
              <label>Address Line 2</label>
              <input 
                name="projEngAdd2" 
                type="text" 
                maxLength="500" 
                value={formData.projEngAdd2} 
                onChange={handleInputChange} 
                onKeyPress={allowAddressChars}
                onPaste={allowAddressCharsOnPaste}
                placeholder="Address Line 2" 
                className="associate-details-form-control associate-details-inputbox" 
              />
            </div>
          </div>
        </div>
        <div className="associate-details-row associate-details-innerdivrow">
          <div className="associate-details-col-sm-3">
            <div className="associate-details-form-group">
              <label>State/UT <font color="red">*</font></label>
              <select name="projEngState" value={formData.projEngState} onChange={handleInputChange} className="associate-details-form-control associate-details-inputbox">
                {states.map(state => <option key={state.value} value={state.value}>{state.label}</option>)}
              </select>
            </div>
          </div>
          <div className="associate-details-col-sm-3">
            <div className="associate-details-form-group">
              <label>District <font color="red">*</font></label>
              <select name="projEngDistrict" value={formData.projEngDistrict} onChange={handleInputChange} disabled={formData.projEngState === '0'} className="associate-details-form-control associate-details-inputbox">
                <option value="0">{formData.projEngState === '0' ? 'Select State first' : 'Select'}</option>
                {(districtsByState[formData.projEngState] || []).map((d, i) => <option key={i} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
          <div className="associate-details-col-sm-3">
            <div className="associate-details-form-group">
              <label>PIN Code <font color="red">*</font></label>
              <input 
                name="projEngPin" 
                type="text" 
                maxLength="6" 
                value={formData.projEngPin} 
                onChange={handleInputChange} 
                onKeyPress={allowOnlyNumbers} 
                onPaste={allowOnlyNumbersOnPaste} 
                placeholder="PIN Code" 
                className="associate-details-form-control associate-details-inputbox" 
              />
            </div>
          </div>
          <div className="associate-details-col-sm-3">
            <div className="associate-details-form-group">
              <label>Number of key projects completed</label>
              <input 
                name="projEngKeyProjects" 
                type="text" 
                maxLength="3" 
                value={formData.projEngKeyProjects} 
                onChange={handleInputChange} 
                onKeyPress={allowOnlyNumbers} 
                onPaste={allowOnlyNumbersOnPaste} 
                placeholder="Number of Key projects" 
                className="associate-details-form-control associate-details-inputbox" 
              />
            </div>
          </div>
        </div>
        <div className="associate-details-row associate-details-innerdivrow">
          <div className="associate-details-col-sm-3">
            <div className="associate-details-form-group">
              <label>Mobile Number <font color="red">*</font></label>
              <input 
                name="projEngMobile" 
                type="text" 
                maxLength="10" 
                value={formData.projEngMobile} 
                onChange={handleInputChange} 
                onKeyPress={allowOnlyNumbers} 
                onPaste={allowOnlyNumbersOnPaste} 
                placeholder="Mobile Number" 
                className="associate-details-form-control associate-details-inputbox" 
              />
            </div>
          </div>
        </div>
        <div className="associate-details-row associate-details-innerdivrow">
          <div className="associate-details-col-sm-12 associate-details-add-btn-wrapper">
            <button onClick={handleAddProjectEngineer} className="associate-details-btn associate-details-btn-primary associate-details-add-btn">Add</button>
          </div>
        </div>
        {tables.projectEngineers.length > 0 && (
          <div className="associate-details-row associate-details-innerdivrow">
            <div className="associate-details-col-xs-12">
              <div className="associate-details-table-responsive associate-details-tableheader">
                <table className="associate-details-table associate-details-table-striped associate-details-table-bordered">
                  <thead><tr><th>Name</th><th>Email</th><th>Address</th><th>State</th><th>District</th><th>PIN</th><th>Mobile</th><th>Action</th></tr></thead>
                  <tbody>
                    {tables.projectEngineers.map((projEng, idx) => (
                      <tr key={idx}>
                        <td>{projEng.name}</td><td>{projEng.email}</td><td>{projEng.address}</td><td>{projEng.state}</td><td>{projEng.district}</td><td>{projEng.pin}</td><td>{projEng.mobile}</td>
                        <td><button className="associate-details-btn associate-details-btn-danger associate-details-btn-sm" onClick={() => handleDeleteRow("projectEngineers", idx)}>Delete</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        {/* Save & Continue button */}
        <div className="associate-details-add-btn-wrapper">
          <button onClick={handleSaveAndContinue} className="associate-details-btn associate-details-btn-primary associate-details-add-btn">
            Save and Continue
          </button>
        </div>
      </div>
    </div>
  );
};
export default AssociateDetails;