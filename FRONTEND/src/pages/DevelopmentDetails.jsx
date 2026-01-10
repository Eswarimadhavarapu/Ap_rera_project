import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import '../styles/DevelopmentDetails.css';
import ProjectWizard from "../components/ProjectWizard";



const DevelopmentDetails = () => {
    const navigate = useNavigate();
    const [buildingTypes, setBuildingTypes] = useState({
        plots: false,
        apartmentsFlats: true,
        villas: false,
        commercial: true
    });

    const [plotDetails, setPlotDetails] = useState({
        totalPlots: '',
        plotFile: null
    });

    const [apartmentDetails, setApartmentDetails] = useState({
        totalBlocks: '',
        apartmentFile: null
    });

    const [villaDetails, setVillaDetails] = useState({
        totalBlocks: '',
        villaFile: null
    });

    const [commercialDetails, setCommercialDetails] = useState({
        totalBlocks: '',
        commercialFile: null
    });

    const [externalDevelopmentWorks, setExternalDevelopmentWorks] = useState([
        { type: 'Roads', percentCompleted: 0 },
        { type: 'Water Supply', percentCompleted: 0 },
        { type: 'Sewage and Drainage System', percentCompleted: 0 },
        { type: 'Electricity Supply Transformation Station', percentCompleted: 0 },
        { type: 'Solid Waste Management And Disposal', percentCompleted: 0 },
        { type: 'Fire Fighting Facility', percentCompleted: 0 },
        { type: 'Drinking Water Facility', percentCompleted: 0 },
        { type: 'Emergency Evacuation Service', percentCompleted: 0 },
        { type: 'Use of Renewable Energy', percentCompleted: 0 }
    ]);

    const [otherWork, setOtherWork] = useState({
        description: '',
        type: 'Select'
    });

    const [expandedSections, setExpandedSections] = useState({
        plots: false,
        apartments: true,
        villas: false,
        commercial: false
    });
const handleTemplateDownload = (e, templateType) => {
  e.preventDefault();
  e.stopPropagation(); // important to stop accordion toggle

  let filePath = "";
  let fileName = "";

  switch (templateType) {
    case "plot":
      filePath = "/pdf/plotDetailsTemplate.xlsx";
      fileName = "PlotDetailsTemplate.xlsx";
      break;
    case "flat":
      filePath = "/pdf/FlatDetailsTemplate.xlsx";
      fileName = "FlatDetailsTemplate.xlsx";
      break;
    case "villa":
      filePath = "/pdf/VillaDetailsTemplate.xlsx";
      fileName = "VillaDetailsTemplate.xlsx";
      break;
    case "commercial":
      filePath = "/pdf/CommercialDetailsTemplate.xlsx";
      fileName = "CommercialDetailsTemplate.xlsx";
      break;
    default:
      return;
  }

  // ✅ FORCE DOWNLOAD (NO NEW TAB)
  const link = document.createElement("a");
  link.href = filePath;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};


    const handleBuildingTypeChange = (type) => {
        setBuildingTypes(prev => ({
            ...prev,
            [type]: !prev[type]
        }));

        // Expand/collapse section based on checkbox
        setExpandedSections(prev => ({
            ...prev,
            [type]: !prev[type]
        }));
    };

    const handleInputChange = (section, field, value) => {
        switch (section) {
            case 'plots':
                setPlotDetails(prev => ({ ...prev, [field]: value }));
                break;
            case 'apartments':
                setApartmentDetails(prev => ({ ...prev, [field]: value }));
                break;
            case 'villas':
                setVillaDetails(prev => ({ ...prev, [field]: value }));
                break;
            case 'commercial':
                setCommercialDetails(prev => ({ ...prev, [field]: value }));
                break;
            case 'otherWork':
                setOtherWork(prev => ({ ...prev, [field]: value }));
                break;
            default:
                break;
        }
    };

    const handleFileChange = (section, file) => {
        switch (section) {
            case 'plots':
                setPlotDetails(prev => ({ ...prev, plotFile: file }));
                break;
            case 'apartments':
                setApartmentDetails(prev => ({ ...prev, apartmentFile: file }));
                break;
            case 'villas':
                setVillaDetails(prev => ({ ...prev, villaFile: file }));
                break;
            case 'commercial':
                setCommercialDetails(prev => ({ ...prev, commercialFile: file }));
                break;
            default:
                break;
        }
    };

    const handleExternalWorkChange = (index, value) => {
        const updatedWorks = [...externalDevelopmentWorks];
        updatedWorks[index].percentCompleted = value;
        setExternalDevelopmentWorks(updatedWorks);
    };

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

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

    const handleSubmit = (e) => {
        e.preventDefault();

        // (Optional) minimal validation
        if (
            !apartmentDetails.totalBlocks &&
            !plotDetails.totalPlots
        ) {
            alert("Please enter development details");
            return;
        }

        // ✅ MARK STEP 3 AS COMPLETED (GREEN)
        completeStep(3);

        // 👉 NAVIGATE TO NEXT STEP
        navigate("/associate-details");
    };

    return (
        <div className="development-details-container">
            {/* Header Navigation */}
            <div className="breadcrumb">
                You are here: <a href="#">Home</a> / <a href="#">Registration</a> / <a href="#">Project Registration</a>
            </div>

            <h2 className="page-title">Project Registration</h2>

            <ProjectWizard currentStep={3} />

            <form onSubmit={handleSubmit} className="development-form">
                <div className="form-section">
                    <h3 className="subheading">Development Details</h3>
                    
                    <div className="row innerdivrow">
                        <div className="col-sm-12">
                            <div className="form-group">
                                <label className="label">
                                    Project Consists of<font color="red">*</font>
                                </label>
                                
                                <table className="custom_checkbox" style={{width: '100%'}}>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <input 
                                                    id="chkPlots"
                                                    type="checkbox"
                                                    checked={buildingTypes.plots}
                                                    onChange={() => handleBuildingTypeChange('plots')}
                                                />
                                                <label htmlFor="chkPlots">Plots</label>
                                            </td>
                                            <td>
                                                <input 
                                                    id="chkApartments"
                                                    type="checkbox"
                                                    checked={buildingTypes.apartmentsFlats}
                                                    onChange={() => handleBuildingTypeChange('apartmentsFlats')}
                                                />
                                                <label htmlFor="chkApartments">Apartments/Flats</label>
                                            </td>
                                            <td>
                                                <input 
                                                    id="chkVillas"
                                                    type="checkbox"
                                                    checked={buildingTypes.villas}
                                                    onChange={() => handleBuildingTypeChange('villas')}
                                                />
                                                <label htmlFor="chkVillas">Villas</label>
                                            </td>
                                            <td>
                                                <input 
                                                    id="chkCommercial"
                                                    type="checkbox"
                                                    checked={buildingTypes.commercial}
                                                    onChange={() => handleBuildingTypeChange('commercial')}
                                                />
                                                <label htmlFor="chkCommercial">Commercial</label>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            
                            <div className="note-section">
                                <label className="label note">
                                    <strong>Note:</strong><br />
                                    1. Do not tamper the given excel templates<br />
                                    2. Do not merge any rows/columns/cells in excel sheets<br />
                                    3. Total No. of Blocks/Plots entered in text box should be equal to the total number of blocks/Plots in excel sheet.<br />
                                    4. Built-up area(including stilt area) should be same for all the floors in a block.<br />
                                    5. Flat/Unit numbers should be unique with in a block.
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Accordion Sections */}
                    <div className="accordion-wrapper">
                        {/* Plot Details Section */}
                        {buildingTypes.plots && (
                            <div className="accordion-section">
                                <div 
                                    className={`accordion-header ${expandedSections.plots ? 'active' : ''}`}
                                    onClick={() => toggleSection('plots')}
                                >
                                    <span className="accordion-icon">+</span>
                                    Plot Details
                                </div>
                                {expandedSections.plots && (
                                    <div className="accordion-content">
                                        <div className="row innerdivrow">
                                            <div className="col-xs-12 dvborder">
                                                <div className="form-group">
                                                    <a 
                                                        href="#" 
                                                        className="lnk-link" 
                                                        onClick={(e) => handleTemplateDownload(e, 'plot')}
                                                        style={{fontSize: '16px'}}
                                                    >
                                                        Click here to download Plot Details Excel Template
                                                    </a>
                                                </div>
                                                <div className="col-sm-3">
                                                    <div className="form-group">
                                                        <label className="label">
                                                            Total No of Plots<font color="red">*</font>
                                                        </label>
                                                        <input 
                                                            type="text" 
                                                            maxLength="6"
                                                            className="form-control inputbox allownumeric"
                                                            placeholder="Total No of Plots"
                                                            value={plotDetails.totalPlots}
                                                            onChange={(e) => handleInputChange('plots', 'totalPlots', e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-xs-4">
                                                    <div className="form-group">
                                                        <label className="label">
                                                            Upload Plot Details<font color="red">*</font>
                                                        </label>
                                                        <input 
                                                            type="file"
                                                            className="form-control inputbox"
                                                            accept=".xlsx,.xls"
                                                            onChange={(e) => handleFileChange('plots', e.target.files[0])}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-xs-3">
                                                    <div className="form-group">
                                                        <button type="button" className="btn btn-primary btnmargintop pull-left">
                                                            Upload Excel
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="col-xs-2">
                                                    <div className="form-group">
                                                        {/* Empty for alignment */}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Apartment/Flat Details Section */}
                        {buildingTypes.apartmentsFlats && (
                            <div className="accordion-section">
                                <div 
                                    className={`accordion-header ${expandedSections.apartments ? 'active' : ''}`}
                                    onClick={() => toggleSection('apartments')}
                                >
                                    <span className="accordion-icon">+</span>
                                    Apartment/Flat Details
                                </div>
                                {expandedSections.apartments && (
                                    <div className="accordion-content">
                                        <div className="row innerdivrow">
                                            <div className="col-xs-12 dvborder">
                                                <div className="form-group">
                                                    <a 
                                                        href="#" 
                                                        className="lnk-link" 
                                                        onClick={(e) => handleTemplateDownload(e, 'flat')}
                                                        style={{fontSize: '16px'}}
                                                    >
                                                        Click here to download Flat Details Excel Template
                                                    </a>
                                                </div>
                                                <div className="col-sm-3">
                                                    <div className="form-group">
                                                        <label className="label">
                                                            Total No of Blocks<font color="red">*</font>
                                                        </label>
                                                        <input 
                                                            type="text" 
                                                            maxLength="6"
                                                            className="form-control inputbox allownumeric"
                                                            placeholder="Total No of Blocks"
                                                            value={apartmentDetails.totalBlocks}
                                                            onChange={(e) => handleInputChange('apartments', 'totalBlocks', e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-xs-4">
                                                    <div className="form-group">
                                                        <label className="label">
                                                            Upload Flat Details<font color="red">*</font>
                                                        </label>
                                                        <input 
                                                            type="file"
                                                            className="form-control inputbox"
                                                            accept=".xlsx,.xls"
                                                            onChange={(e) => handleFileChange('apartments', e.target.files[0])}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-xs-3">
                                                    <div className="form-group">
                                                        <button type="button" className="btn btn-primary btnmargintop pull-left">
                                                            Upload Excel
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Villa Details Section */}
                        {buildingTypes.villas && (
                            <div className="accordion-section">
                                <div 
                                    className={`accordion-header ${expandedSections.villas ? 'active' : ''}`}
                                    onClick={() => toggleSection('villas')}
                                >
                                    <span className="accordion-icon">+</span>
                                    Villa Details
                                </div>
                                {expandedSections.villas && (
                                    <div className="accordion-content">
                                        <div className="row innerdivrow">
                                            <div className="col-xs-12 dvborder">
                                                <div className="form-group">
                                                    <a 
                                                        href="#" 
                                                        className="lnk-link" 
                                                        onClick={(e) => handleTemplateDownload(e, 'villa')}
                                                        style={{fontSize: '16px'}}
                                                    >
                                                        Click here to download Villa Details Excel Template
                                                    </a>
                                                </div>
                                                <div className="col-sm-3">
                                                    <div className="form-group">
                                                        <label className="label">
                                                            Total No of Blocks<font color="red">*</font>
                                                        </label>
                                                        <input 
                                                            type="text" 
                                                            maxLength="6"
                                                            className="form-control inputbox allownumeric"
                                                            placeholder="Total No of Blocks"
                                                            value={villaDetails.totalBlocks}
                                                            onChange={(e) => handleInputChange('villas', 'totalBlocks', e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-xs-4">
                                                    <div className="form-group">
                                                        <label className="label">
                                                            Upload Villa Details<font color="red">*</font>
                                                        </label>
                                                        <input 
                                                            type="file"
                                                            className="form-control inputbox"
                                                            accept=".xlsx,.xls"
                                                            onChange={(e) => handleFileChange('villas', e.target.files[0])}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-xs-3">
                                                    <div className="form-group">
                                                        <button type="button" className="btn btn-primary btnmargintop pull-left">
                                                            Upload Excel
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Commercial Details Section */}
                        {buildingTypes.commercial && (
                            <div className="accordion-section">
                                <div 
                                    className={`accordion-header ${expandedSections.commercial ? 'active' : ''}`}
                                    onClick={() => toggleSection('commercial')}
                                >
                                    <span className="accordion-icon">+</span>
                                    Commercial Details
                                </div>
                                {expandedSections.commercial && (
                                    <div className="accordion-content">
                                        <div className="row innerdivrow">
                                            <div className="col-xs-12 dvborder">
                                                <div className="form-group">
                                                    <a 
                                                        href="#" 
                                                        className="lnk-link" 
                                                        onClick={(e) => handleTemplateDownload(e, 'commercial')}
                                                        style={{fontSize: '16px'}}
                                                    >
                                                        Click here to download Commercial Details Excel Template
                                                    </a>
                                                </div>
                                                <div className="col-sm-3">
                                                    <div className="form-group">
                                                        <label className="label">
                                                            Total No of Blocks<font color="red">*</font>
                                                        </label>
                                                        <input 
                                                            type="text" 
                                                            maxLength="6"
                                                            className="form-control inputbox allownumeric"
                                                            placeholder="Total No of Blocks"
                                                            value={commercialDetails.totalBlocks}
                                                            onChange={(e) => handleInputChange('commercial', 'totalBlocks', e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-xs-4">
                                                    <div className="form-group">
                                                        <label className="label">
                                                            Upload Commercial Details<font color="red">*</font>
                                                        </label>
                                                        <input 
                                                            type="file"
                                                            className="form-control inputbox"
                                                            accept=".xlsx,.xls"
                                                            onChange={(e) => handleFileChange('commercial', e.target.files[0])}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-xs-3">
                                                    <div className="form-group">
                                                        <button type="button" className="btn btn-primary btnmargintop pull-left">
                                                            Upload Excel
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* External Development Work */}
                    <div className="external-development-section">
                        <h4 className="section-title">External Development Work</h4>
                        
                        <table className="development-table">
                            <thead>
                                <tr>
                                    <th>External Development Work Type</th>
                                    <th>% of Work Completed</th>
                                </tr>
                            </thead>
                            <tbody>
                                {externalDevelopmentWorks.map((work, index) => (
                                    <tr key={index}>
                                        <td>{work.type}</td>
                                        <td>
                                            <input 
                                                type="number"
                                                min="0"
                                                max="100"
                                                className="form-control percent-input"
                                                value={work.percentCompleted}
                                                onChange={(e) => handleExternalWorkChange(index, parseInt(e.target.value) || 0)}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Other External Development Works */}
                        <div className="other-works-section">
                            <h5 className="sub-section-title">Other External Development Works</h5>
                            <div className="row innerdivrow">
                                <div className="col-sm-4">
                                    <div className="form-group">
                                        <label className="label">Work Description</label>
                                        <input 
                                            type="text"
                                            className="form-control inputbox"
                                            placeholder="Work Description"
                                            value={otherWork.description}
                                            onChange={(e) => handleInputChange('otherWork', 'description', e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="col-sm-4">
                                    <div className="form-group">
                                        <label className="label">Work Type</label>
                                        <select 
                                            className="form-control inputbox"
                                            value={otherWork.type}
                                            onChange={(e) => handleInputChange('otherWork', 'type', e.target.value)}
                                        >
                                            <option value="Select">Select</option>
                                            <option value="Type1">Type 1</option>
                                            <option value="Type2">Type 2</option>
                                            <option value="Type3">Type 3</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-sm-2">
                                    <div className="form-group">
                                        <button type="button" className="btn btn-default btn-add">
                                            Add
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Save and Continue Button */}
                <div className="form-actions">
                    <button type="submit" className="btn btn-primary btn-save">
                        Save and Continue
                    </button>
                </div>
            </form>
        </div>
    );
};

export default DevelopmentDetails;