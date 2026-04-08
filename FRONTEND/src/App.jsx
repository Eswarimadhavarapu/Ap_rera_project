import { BrowserRouter, Routes, Route } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Layout from "./layouts/layout";

// pages
// import Home from "./pages/home";
import About from "./pages/About";
// import Aprea from "./pages/Aprea";
import Notifications from "./pages/Notification";
import Registration from "./pages/Registration";
import Reports from "./pages/Reports";
import Registered from "./pages/Registered";
import Judgements from "./pages/Judgement";
import KnowledgeHub from "./pages/KnowledgeHub";
import Login from "./pages/Login";
import Dashboard from "./pages/dashboard";
import Apreat from "./pages/apreat";
import Recruitment from "./pages/recruitment";
import Rti from "./pages/rti";
import Promotregistration from "./pages/promotregistration";
import GuidelinesRegistration from "./pages/guidelinesRegistration";
import FeeCalculator from "./pages/feeCalculater";
import CidcandAPRERAJointNotifications from "./pages/CidcandAPRERAJointNotifications";
import Usermanual from "./pages/usermanual";
import VideoTutorial from "./pages/videoTutorial";
import MobileApp from "./pages/mobileapp";
import ProjectRegistration from "./pages/ProjectRegistration";
import Guidelines from "./pages/Guidelines";
import ProjectWizard from "./pages/ProjectWizard";
import Race from "./pages/Race";
import JudgementHub from "./pages/JudgementHub";
import PressRelease from "./pages/PressRelease";
import Testimonials from "./pages/Testimonials";
import GradingOfAgents from "./pages/GradingOfAgents";
import ChronologyOfEvents from "./pages/ChronologyOfEvents"
import AdvertisementGuidelines from "./pages/AdvertisementGuidelines";
import OurLeadership from "./pages/OurLeadership";
import Footer from "./components/Footer";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import HyperlinkingPolicy from "./pages/HyperlinkingPolicy";
import CopyrightPolicy from "./pages/CopyrightPolicy";
import Disclaimer from "./pages/Disclaimer";
import Accessibility from "./pages/Accessibility";
import TermsConditions from "./pages/TermsConditions";
import RateWebsite from "./pages/RateWebsite";
import AgentRegistration from "./pages/AgentRegistration";
import Guidelines2 from "./pages/Guidelines2";
import AgentDetailNew from "./pages/AgentDetailNew";
import AgentDetailExisting from "./pages/AgentDetailExisting";
import ApplicantDetails from "./pages/ApplicantDetails";
import Aprera from "./pages/Aprea";
import Organogram from "./pages/organogram";
import OurServices from "./pages/ourservices";
import Statistics from "./pages/statistics";
import GOINotifications from "./pages/GOINotifications";
import GoapNotifications from "./pages/GoapNotifications";
import AuthorityNotifications from "./pages/AuthorityNotifications";
import Project from "./pages/projects";
import Agents from "./pages/Agents";
import ComplaintOrders from "./pages/ComplaintOrders";
import EvolutionOfRera from "./pages/evolutionofrera";
import AudioVisualGallery from "./pages/AudioVisualGallery";
import TaskVsTime from "./pages/taskvstime";
import VendorDataBase from "./pages/vendordatabase";
import Acf from "./pages/ACF";
import ComplaintRegistration from "./pages/complaintRegistration";
import GradingOfPromoters from "./pages/GradingOfPromotors";
import FormsDownload from "./pages/formsdownload";
import AgentUploadDocuments from "./pages/AgentUploadDocuments";
import Preview from "./pages/Preview";
import Payment from "./pages/Payment";
import ContactUs from "./pages/contactus";
import Promoter_Profile from "./pages/Promoter_Profile";
import ProjectDetails from "./pages/projectDetails";
import DevelopmentDetails from "./pages/DevelopmentDetails";
import AssociateDetails from "./pages/AssociateDetails";
import HomePage from "./pages/HomePage";
import BuildingInformationModelling from "./pages/BuildingInformationModelling";
import VRInnovation from "./pages/VRInnovation";
import RealTimeContextCapture from "./pages/RealTimeContextCapture";
import AnnouncementPopup from "./pages/AnnouncementPopup";
import ProjectUploadDocuments1 from "./pages/ProjectUploadDocuments1";
import { useEffect, useState } from "react";
import ProjectApplicationDetails from "./pages/projectapplicationdetails";
import ExtensionProcess from "./pages/ExtensionProcess";
import ExtensionPaymentPage from "./pages/ExtensionPaymentPage";
import Certificate from "./pages/Certificate";
import OTPLogin from "./pages/otplogin";
import InformProject from "./pages/InformProject";
import ProjectPreview from "./pages/ProjectPreview";
import AgentDashboard from "./pages/AgentDashboard";
import PaymentPage from "./pages/paymentpage";
import ProjectRegistrationExisting from "./pages/ProjectRegistrationExisting";
import PRExistingStarting from "./pages/PRExistingStarting";
import PRExistingtable from "./pages/PRExistingtable";
import ExistingDevelopmentDetails from "./pages/ExistingDevelopmentDetails";
import UploadDocumentsWithApi from "./pages/UploadDocumentsWithApi";
import ExistingProjectDetails from "./pages/ExistingProjectDetails";
// import AgentDetails from "./pages/AgentDetails"; 
// import AgentUploadDocuments from "./pages/AgentUploadDocuments";
import PreviewOther from "./pages/agentpreviewother";
import AgentPaymentpage from "./pages/Agentpayment";
import AgentUploadDocumentOtherthan from "./pages/AgentUploadDocumentOtherthan";
import AgentDetailsOther from "./pages/AgentDetails";
import ExistingAssociateDetails from "./pages/Existing_AssociateDetails";
import OtherthanIndividualDD from "./pages/OtherthanIndividualDD";
import OtherThanIndividual_ProjectPreview from "./pages/OtherThanIndividual_projectPreview";
import OtherThanIndividualProjectDetails from "./pages/OtherThanIndividualprojectDetails";
import OtherThanIndividualDevelopmentDetails from "./pages/other-than-individual_DevelopmentDetails";
import OtherThanIndividualAssociateDetails from "./pages/other-than-individual_AssociateDetails";
import OtherThanIndividualUploadDocument from "./pages/other-than-individual_UploadDocument";
import QuarterlyUpdate from "./pages/QuarterlyUpdate";
import QuarterlyUpdateExisting from "./pages/QuarterlyUpdateExisting";
import QuarterlyExistingtable from "./pages/QuarterlyExistingtable";
import { AgentFormProvider } from "./pages/AgentFormContext";
import ProjectBlockVillaDetails from "./pages/ProjectBlockVillaDetails";
import ChangeRequestForm from "./pages/ChangeRequestForm";
import ChangeRequestVerify from "./pages/ChangeRequestVerify";
import ProjectClosure from "./pages/ProjectClosure";
import ClosureProcess from "./pages/ClosureProcess";
import PromoterLogin from "./pages/PromoterLogin";
import PromoterData from "./pages/PromoterData";
import ClosureTable from "./pages/ClosureTable";

import AgentRenewal from "./pages/AgentRenewal";
import RenewalUploadDocuments from "./pages/RenewalUploadDocuments";
import RenewalQueries from "./pages/RenewalQueries";
import RenewalPreview from "./pages/RenewalPreview";
import RenewalPayment from "./pages/RenewalPayment";
import RenewalStatus from "./pages/RenewalStatus";
import RenewalReceipt from "./pages/RenewalReceipt";
import "./styles/renewal.css";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminRequests from "./pages/admin/AdminRequests";
import AdminProjects from "./pages/admin/AdminProjects";
import AdminAgents from "./pages/admin/AdminAgents";
import AdminComplaints from "./pages/admin/AdminComplaints";
import AdminRenewal from "./pages/admin/adminRenewal.jsx";
import AdminRenewalList from "./pages/admin/AdminRenewalList";
import AdminRenewalDetail from "./pages/admin/AdminRenewalDetail";
import AdminLogin from "./pages/admin/AdminLogin";
import ApplyForRenewalOTP from "./pages/ApplyForRenewalOTP";
import RenewalNewCertificate from "./pages/RenewalNewCertificate.jsx";
import AgentChangeRequest1 from "./pages/agent_change_request_1";

import Agentchangerequest from "./pages/Agent_change_request2";
import AgentChangeRequestPayment from "./pages/AgentChangeRequestPayment";
import PromoterOtpLogin from "./pages/PromoterOtpLogin.jsx";
import Changerequest from "./pages/Changerequest.jsx";
import ChangeRequestProcess from "./pages/ChangeRequestProcess.jsx";
import AdminChangeRequestList   from "./pages/admin/AdminChangeRequestList";
import AdminChangeRequestDetail from "./pages/admin/AdminChangeRequestDetail";
import AdminComplaintDetail from "./pages/admin/AdminComplaintDetail.jsx";
import ComplaintStatusForm from "./pages/ComplaintStatusForm.jsx";
import ComplaintDetails from "./pages/complaintDetails.jsx";
// import AdminComplaintDetails from "./pages/admin/admincomplaintsdetails.jsx";
import AdminComplaintsDetailss from "./pages/admin/admincomplaintsdetails.jsx";
import AdminProjectDetails from "./pages/admin/AdminProjectDetails";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import AdminAgentChangeRequest from "./pages/admin/admin_agentchangerequest";



import ScrutinyProjectRegistration from "./pages/scrutiny/scrutiny_projectregistation";
import ScrutinyProjectRegistration_1 from "./pages/scrutiny/scrutiny_projectregistation_1";
import ScrutinyProjectRegistration_2 from "./pages/scrutiny/scrutiny_projectregistation_2";
import ScrutinyProjectRegistration_3 from "./pages/scrutiny/scrutiny_projectregistation_3";
import ScrutinyProjectRegistration_4 from "./pages/scrutiny/scrutiny_projectregistation_4";
import ScrutinyProjectRegistration_5 from "./pages/scrutiny/scrutiny_projectregistation_5";
import ScrutinyProjectRegistration_action from "./pages/scrutiny/scrutiny_projectregistation_action";
import ScrutinyDashboard from "./pages/scrutiny/ScrutinityDashboard.jsx";
import ScrutinyRegistration from "./pages/scrutiny/ScrutinyRegistration.jsx";
import ScrutinyFpmsDashboard from "./pages/scrutiny/ScrutinyFpmsDashboard.jsx";
import ScrutinyCreateFile from "./pages/scrutiny/ScrutinyCreateFile.jsx";
import ScrutinyViewFiles from "./pages/scrutiny/ScrutinyViewFiles.jsx";


function App() {
  const [showPopup, setShowPopup] = useState(false);

  // ✅ Show popup automatically on first load
  useEffect(() => {
    setTimeout(() => {
      setShowPopup(true);
    }, 800);
  }, []);
  return (
    <BrowserRouter>
      <AgentFormProvider>
        {/* ✅ Popup should be OUTSIDE Routes */}
        {showPopup && <AnnouncementPopup onClose={() => setShowPopup(false)} />}
        <Layout>
          <Routes>
            {/* <Route path="/" element={<Home />} /> */}
            <Route path="about" element={<About />} />
            {/* <Route path="apreat" element={<Aprea />} /> */}
            <Route path="notifications" element={<Notifications />} />
            <Route path="registration" element={<Registration />} />
            <Route path="reports" element={<Reports />} />
            <Route path="registered" element={<Registered />} />
            <Route path="judgements" element={<Judgements />} />
            <Route path="knowledge-hub" element={<KnowledgeHub />} />
            <Route path="login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/apreat" element={<Apreat />} />
            <Route path="/recruitment" element={<Recruitment />} />
            <Route path="/rti" element={<Rti />} />
            <Route path="/promotregistration" element={<Promotregistration />} />
            <Route path="/guidelinesRegistration" element={<GuidelinesRegistration />} />
            <Route path="/feecalculater" element={<FeeCalculator />} />
            <Route path="/cidcandaprerajoint" element={<CidcandAPRERAJointNotifications />} />
            <Route path="/usermanual" element={<Usermanual />} />
            <Route path="/videoTutorial" element={<VideoTutorial />} />
            <Route path="/mobileapp" element={<MobileApp />} />
            <Route path="/project-registration" element={<ProjectWizard />} />
            <Route path="/guidelines" element={<Guidelines />} />
            <Route path="/project-registration-wizard" element={<ProjectWizard />} />
            <Route path="/race" element={<Race />} />
            <Route path="/JudgementHub" element={<JudgementHub />} />
            <Route path="/PressRelease" element={<PressRelease />} />
            <Route path="/Testimonials" element={<Testimonials />} />
            <Route path="/GradingOfAgents" element={<GradingOfAgents />} />
            <Route path="/ChronologyOfEvents" element={<ChronologyOfEvents />} />
            <Route path="/AdvertisementGuidelines" element={<AdvertisementGuidelines />} />
            <Route path="/our-leadership" element={<OurLeadership />} />
            <Route path="/contact-us/aprera" element={<ContactUs />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/hyperlinking-policy" element={<HyperlinkingPolicy />} />
            <Route path="/copyrightPolicy" element={< CopyrightPolicy />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
            <Route path="/accessibility" element={<Accessibility />} />
            <Route path="/termsConditions" element={< TermsConditions />} />
            <Route path="/rateWebsite" element={<RateWebsite />} />
            <Route path="/agent-registration" element={<AgentRegistration />} />
            <Route path="/Guidelines" element={<Guidelines />} />
            <Route path="/agent-detail-new" element={<AgentDetailNew />} />
            <Route path="/agent-detail-existing" element={<AgentDetailExisting />} />
            <Route path="/applicant-details" element={<ApplicantDetails />} />
            <Route path="/aprera" element={<Aprera />} />
            <Route path="/organogram" element={<Organogram />} />
            <Route path="/ourservices" element={<OurServices />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/goinotifications" element={<GOINotifications />} />
            <Route path="/goapnotifications" element={<GoapNotifications />} />
            <Route path="/authoritynotifications" element={<AuthorityNotifications />} />
            <Route path="/agents" element={<Agents />} />
            <Route path="/registered/projects" element={<Project />} />
            <Route path="/complaint-orders" element={<ComplaintOrders />} />
            <Route path="evolutionofrera" element={<EvolutionOfRera />} />
            <Route path="taskvstime" element={<TaskVsTime />} />
            <Route path="vendordatabase" element={<VendorDataBase />} />
            <Route path="gradingofpromotors" element={<GradingOfPromoters />} />
            <Route path="ACF" element={<Acf />} />
            <Route path="AudioVisualGallery" element={<AudioVisualGallery />} />
            <Route path="/complaintregistration" element={<ComplaintRegistration />} />
            <Route path="/formsdownload" element={<FormsDownload />} />
            <Route path="/promoter-profile" element={<Promoter_Profile />} />
            <Route path="/project-Details" element={<ProjectDetails />} />
            <Route path="/Development-Details" element={<DevelopmentDetails />} />
            <Route
              path="project-upload-documents"
              element={<ProjectUploadDocuments1 />}
            />
            <Route path="preview" element={<ProjectPreview />} />
            <Route path="/Associate-Details" element={<AssociateDetails />} />
            <Route path="/agent-upload-documents" element={<AgentUploadDocuments />} />
            <Route path="/agent-preview" element={<Preview />} />
            <Route path="/agent-payment" element={<Payment />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/bim" element={<BuildingInformationModelling />} />
            <Route path="/vr" element={<VRInnovation />} />
            <Route path="/rtc" element={<RealTimeContextCapture />} />
            <Route path="/projectapplicationdetails" element={<ProjectApplicationDetails />} />
            <Route path="/extensionprocess" element={<ExtensionProcess />} />
            <Route path="/extensionpaymentpage" element={<ExtensionPaymentPage />} />
            <Route path="/certificate" element={<Certificate />} />
            <Route path="/otplogin" element={<OTPLogin />} />
            <Route path="/InformProject" element={<InformProject />} />
            <Route path="/agent-dashboard" element={<AgentDashboard />} />
            <Route path="/paymentpage" element={<PaymentPage />} />
            <Route path="/projectregistrationexisting" element={<ProjectRegistrationExisting />} />
            <Route path="/prexisting" element={<PRExistingStarting />} />
            <Route path="/prexistingtable" element={<PRExistingtable />} />
            <Route path="/existing-development-details" element={<ExistingDevelopmentDetails />} />
            <Route path="/AgentDetails" element={<AgentDetailsOther />} />
            <Route path="/AgentUploadDocumentotherthan" element={<AgentUploadDocumentOtherthan />} />
            <Route path="/preview-other" element={<PreviewOther />} />
            <Route path="/agent-paymentpage" element={<AgentPaymentpage />} />
            <Route path="/existing-associate-details" element={<ExistingAssociateDetails />} />
            <Route path="/otherthanindividualdd" element={<OtherthanIndividualDD />} />
            <Route path="/existing-development-details-upload-docs/:id" element={<UploadDocumentsWithApi />} />
            <Route path="/existing-project-details" element={<ExistingProjectDetails />} />
            <Route path="/other-than-individual-project-details" element={<OtherThanIndividualProjectDetails />} />
            <Route path="/othertheninduvidual-preview" element={<OtherThanIndividual_ProjectPreview />} />
            <Route path="/other-than-individual-development-details" element={<OtherThanIndividualDevelopmentDetails />} />
            <Route path="/other-than-individual-associate-details" element={<OtherThanIndividualAssociateDetails />} />
            <Route path="/other-than-individual-upload-documents" element={<OtherThanIndividualUploadDocument />} />
            <Route path="/quarterlyupdateexisting" element={<QuarterlyUpdateExisting />} />
            <Route path="/quarterlyexistingtable" element={<QuarterlyExistingtable />} />
            <Route path="/quarterlyupdate" element={<QuarterlyUpdate />} />
            <Route path="/project-blockvilla-details" element={<ProjectBlockVillaDetails />} />
            <Route path="/changerequest" element={<ChangeRequestForm />} />
            <Route path="/changerequestverify" element={<ChangeRequestVerify />} />
            <Route path="/project-closure" element={<ProjectClosure />} />
            <Route path="/closureprocess" element={<ClosureProcess />} />
            <Route path="/promoter" element={<PromoterLogin />} />
            <Route path="/promoterData" element={<PromoterData />} />
            <Route path="/closure" element={<ClosureTable />} />

            <Route path="/" element={<HomePage />} />
            <Route path="/agent-renewal" element={<AgentRenewal />} />

            <Route path="/renewal/upload/:renewalId" element={<RenewalUploadDocuments />} />
            <Route path="/renewal/queries/:renewalId" element={<RenewalQueries />} />
            <Route path="/renewal/preview/:renewalId" element={<RenewalPreview />} />
            <Route path="/renewal/payment/:renewalId" element={<RenewalPayment />} />

            <Route path="/renewal/status" element={<RenewalStatus />} />

            <Route path="/renewal/receipt/:renewalId" element={<RenewalReceipt />} />
            // Admin Dashboard
<Route
  path="/admin-dashboard"
  element={
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  }
/>
            // Admin Requests
<Route
  path="/admin/requests"
  element={
    <ProtectedRoute>
      <AdminRequests />
    </ProtectedRoute>
  }
/>
           // Admin Projects
<Route
  path="/admin/projects"
  element={
    <ProtectedRoute>
      <AdminProjects />
    </ProtectedRoute>
  }
/>
            <Route path="/admin/agents" element={<AdminAgents />} />
            // Admin Complaints
<Route
  path="/admin/complaints"
  element={
    <ProtectedRoute>
      <AdminComplaints />
    </ProtectedRoute>
  }
/>
            // Admin Complaint Detail
<Route
  path="/admin/complaint/:id"
  element={
    <ProtectedRoute>
      <AdminComplaintDetail />
    </ProtectedRoute>
  }
/>
            <Route path="/admin/complaintdetails" element={<AdminComplaintsDetailss />} />
            <Route path="/complaintstatus" element={<ComplaintStatusForm />} />
            // Admin Renewal Dashboard
<Route
  path="/admin/renewal"
  element={
    <ProtectedRoute>
      <AdminRenewal />
    </ProtectedRoute>
  }
/>
            // Admin Renewal List
<Route
  path="/admin/renewals/:status"
  element={
    <ProtectedRoute>
      <AdminRenewalList />
    </ProtectedRoute>
  }
/>
// Admin Renewal Detail
<Route
  path="/admin/renewal/:id"
  element={
    <ProtectedRoute>
      <AdminRenewalDetail />
    </ProtectedRoute>
  }
/>
            <Route path="/admin/renewal/:id" element={<AdminRenewalDetail />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/apply-for-renewal-otp" element={<ApplyForRenewalOTP />} />
            <Route path="/renewal/certificate/:renewalId" element={<RenewalNewCertificate />} />
            <Route path="/promoter-otp-login" element={<PromoterOtpLogin />} />  
           
// Admin Change Requests List
<Route
  path="/admin/change-requests"
  element={
    <ProtectedRoute>
      <AdminChangeRequestList />
    </ProtectedRoute>
  }
/>
            // Admin Change Request Detail
<Route
  path="/admin/change-request/:id"
  element={
    <ProtectedRoute>
      <AdminChangeRequestDetail />
    </ProtectedRoute>
  }
/>
            
            <Route
  path="/agent_change_request_1"
  element={<AgentChangeRequest1 />}
/>
<Route path="/Agentchangerequest2" element={<Agentchangerequest/>} />
<Route
  path="/agent-change-request-payment"
  element={<AgentChangeRequestPayment />}
/>
<Route path="/ChangeRequestProcess" element={<ChangeRequestProcess/>} />
<Route path="/Changerequest1" element={<Changerequest />} />
<Route path="/admin/project/:id" element={<AdminProjectDetails />} />
<Route path="/admin/agent-change-request" element={<AdminAgentChangeRequest />} />

<Route path="scrutinity/scrutiny-engineer" element={<ScrutinyDashboard />} />
              <Route path="/scrutiny/scrutiny-registration" element={<ScrutinyRegistration />} />
  {/* <Route path="/scrutiny/scrutiny-fpms" element={<ScrutinyFpmsDashboard/>} /> */}
  <Route path="/scrutiny/project-registration" element={<ScrutinyProjectRegistration />} />
<Route path="/scrutiny/project-registration_1" element={<ScrutinyProjectRegistration_1 />} />
  <Route path="/scrutiny/project-registration_2" element={<ScrutinyProjectRegistration_2 />} />
  <Route path="/scrutiny/project-registration_3" element={<ScrutinyProjectRegistration_3 />} />
  <Route path="/scrutiny/project-registration_4" element={<ScrutinyProjectRegistration_4 />} />
   <Route path="/scrutiny/project-registration_5" element={<ScrutinyProjectRegistration_5 />} />
   <Route path="/scrutiny/project-registration_action" element={<ScrutinyProjectRegistration_action />} />


  <Route path="/scrutiny/scrutiny-fpms" element={<ScrutinyFpmsDashboard />} />
  <Route path="/scrutiny/create-files" element={<ScrutinyCreateFile />} />
  <Route path="/scrutiny/view-files" element={<ScrutinyViewFiles />} />



          </Routes>
        </Layout></AgentFormProvider>
    </BrowserRouter>
  );
}

export default App;