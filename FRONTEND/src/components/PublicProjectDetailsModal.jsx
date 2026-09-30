import React, { useEffect, useState } from "react";
import { fetchPublicProjectDetails } from "../services/searchService";
import GalleryCarousel from "./GalleryCarousel";
import "../styles/PublicProjectDetailsModal.css";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const safe = (v) => (v !== undefined && v !== null && v !== "" ? String(v) : "NA");

const PLAN_AUTHORITY_MAP = {
  "4": "Vice Chairman, UDA",
  "5": "APCRDA",
  "6": "ULB",
  "7": "DTCP",
  "9": "VMRDA",
};

const PROJECT_TYPE_MAP = {
  "1": "Residential",
  "2": "Commercial",
  "3": "Mixed Development",
  "7": "Layout for Plots",
  "8": "Layouts for Plots & Buildings",
};

const PROJECT_STATUS_MAP = {
  "3": "Under Development",
  "4": "New Project",
};

// ─── Section wrapper ───────────────────────────────────────────────────────────
const Section = ({ title, children }) => (
  <div className="ppdm-section">
    <div className="ppdm-sec-header">{title}</div>
    <div className="ppdm-sec-body">{children}</div>
  </div>
);

const Field = ({ label, value }) => (
  <div className="ppdm-field">
    <span className="ppdm-field-label">{label}</span>
    <span className="ppdm-field-value">{safe(value)}</span>
  </div>
);

const Row = ({ children }) => <div className="ppdm-row">{children}</div>;

// ─── Main Component ────────────────────────────────────────────────────────────
export default function PublicProjectDetailsModal({ applicationNumber, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetchPublicProjectDetails(applicationNumber);
        if (res && res.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error("Error fetching project details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [applicationNumber]);

  // Prevent background scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const proj = data?.project_details || {};
  const promoter = data?.promoter_details || {};
  const associates = data?.associate_details || {};
  const devDetails = data?.development_details?.development_details || {};
  const externalWork = data?.development_details?.external_development_work || {};
  const materialFacts = data?.material_facts || {};
  const gallery = data?.gallery || [];

  const apartmentRows = devDetails?.apartments_flats?.rows || [];
  const plotRows = devDetails?.plots?.rows || [];
  const villaRows = devDetails?.villas?.rows || [];
  const commercialRows = devDetails?.commercial?.rows || [];

  const planAuthority = PLAN_AUTHORITY_MAP[String(proj["Plan Approving Authority"] || "")] ||
    safe(proj["Plan Approving Authority"]);

  return (
    <div className="ppdm-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="ppdm-modal">
        {/* Header */}
        <div className="ppdm-header">
          <h2>Project Details</h2>
          <button className="ppdm-close" onClick={onClose} title="Close">×</button>
        </div>

        <div className="ppdm-content">
          {loading ? (
            <div className="ppdm-loading">
              <div className="ppdm-spinner"></div>
              <p>Loading project details...</p>
            </div>
          ) : !data ? (
            <div className="ppdm-error">Failed to load project details.</div>
          ) : (
            <>
              {/* Top Info Bar */}
              <div className="ppdm-top-info">
                <div>
                  <strong>Registration Number :</strong>
                  <span className="ppdm-reg-val">{applicationNumber}</span>
                </div>
                <div>
                  <strong>Date of Registration :</strong>
                  <span className="ppdm-reg-val">{safe(proj["Project Starting Date"])}</span>
                </div>
              </div>

              <div className="ppdm-main-grid">
                {/* Sidebar */}
                <div className="ppdm-sidebar">
                  <div className="ppdm-sb-block">
                    <h4>Project Status</h4>
                    <p>{PROJECT_STATUS_MAP[String(proj["Project Status"] || "")] || safe(proj["Project Status"])}</p>
                  </div>
                  <div className="ppdm-sb-block">
                    <h4>Planning Authority</h4>
                    <p>{planAuthority}</p>
                  </div>
                  <div className="ppdm-sb-block ppdm-sb-light">
                    <h4>Promoter Type</h4>
                    <p>{data.promoter_type === "other" ? "Organization" : "Individual"}</p>
                  </div>
                  <div className="ppdm-sb-block ppdm-sb-light">
                    <h4>Project Type</h4>
                    <p>{PROJECT_TYPE_MAP[String(proj["Project Type"] || "")] || safe(proj["Project Type"])}</p>
                  </div>
                </div>

                {/* Main */}
                <div className="ppdm-main">

                  {/* ── Basic Details ── */}
                  <Section title="Basic Details">
                    <Row>
                      <Field label="Project Name" value={proj["Project Name"]} />
                      <Field label="Project Description" value={proj["Project Description"]} />
                      <Field label="Project Website" value={proj["Project Website"]} />
                    </Row>
                    <Row>
                      <Field label="Building Plan No" value={proj["Building Plan No"]} />
                      <Field label="Permission Validity From" value={proj["Building Permission Validity From"]} />
                      <Field label="Permission Validity To" value={proj["Building Permission Validity To"]} />
                    </Row>
                    <Row>
                      <Field label="Date of Commencement" value={proj["Project Starting Date"]} />
                      <Field label="Proposed Completion Date" value={proj["Proposed Completion Date"]} />
                      <Field label="Survey No" value={proj["Survey No"]} />
                    </Row>
                  </Section>

                  {/* ── Promoter Details ── */}
                  <Section title="Promoter Details">
                    <Row>
                      <Field label="Promoter Name" value={promoter["Promoter Name"]} />
                      <Field label="Father Name" value={promoter["Father Name"]} />
                      <Field label="Mobile Number" value={promoter["Mobile Number"]} />
                    </Row>
                    <Row>
                      <Field label="Email ID" value={promoter["Email"]} />
                      <Field label="Landline" value={promoter["Landline"]} />
                      <Field label="PAN Card Number" value={promoter["PAN"]} />
                    </Row>
                    <Row>
                      <Field label="State/UT" value={promoter["State"]} />
                      <Field label="District" value={promoter["District"]} />
                      <Field label="GST Number" value={promoter["GST Number"]} />
                    </Row>
                    <Row>
                      <Field label="License Number" value={promoter["License Number"]} />
                      <Field label="License Issued Date" value={promoter["License Issued Date"]} />
                      <Field label="Promoter Website" value={promoter["Promoter Website"]} />
                    </Row>
                  </Section>

                  {/* ── Bank Details ── */}
                  <Section title="Project Bank Details">
                    <Row>
                      <Field label="Bank State" value={promoter["Bank State"]} />
                      <Field label="Bank Name" value={promoter["Bank Name"]} />
                      <Field label="Branch Name" value={promoter["Branch Name"]} />
                    </Row>
                    <Row>
                      <Field label="Account Number" value={promoter["Account Number"]} />
                      <Field label="IFSC Code" value={promoter["IFSC Code"]} />
                      <Field label="Account Holder Name" value={promoter["Account Holder Name"]} />
                    </Row>
                  </Section>

                  {/* ── Project Site Address ── */}
                  <Section title="Project Site Address">
                    <Row>
                      <Field label="Door No / Address Line 1" value={proj["Project Address"]} />
                      <Field label="District" value={proj["District"]} />
                      <Field label="Mandal" value={proj["Mandal"]} />
                    </Row>
                    <Row>
                      <Field label="Village" value={proj["Village"]} />
                      <Field label="Pincode" value={proj["Pincode"]} />
                      <Field label="Plan Approving Authority" value={planAuthority} />
                    </Row>
                    <Row>
                      <Field label="Latitude" value={proj["Latitude"]} />
                      <Field label="Longitude" value={proj["Longitude"]} />
                    </Row>
                  </Section>

                  {/* ── Local Address ── */}
                  <Section title="Local Address">
                    <Row>
                      <Field label="Address Line 1" value={proj["Local Address Line1"]} />
                      <Field label="Address Line 2" value={proj["Local Address Line2"]} />
                      <Field label="District" value={proj["Local District"]} />
                    </Row>
                    <Row>
                      <Field label="Mandal" value={proj["Local Mandal"]} />
                      <Field label="Village" value={proj["Local Village"]} />
                      <Field label="Pincode" value={proj["Local Pincode"]} />
                    </Row>
                  </Section>

                  {/* ── Land Area & Cost ── */}
                  <Section title="Land Area & Construction Cost">
                    <Row>
                      <Field label="Total Land Area (Sq.m)" value={proj["Total Area of Land (Sq.m)"]} />
                      <Field label="Total Plinth Area (Sq.m)" value={proj["Total Plinth Area (Sq.m)"]} />
                      <Field label="Total Open Area (Sq.m)" value={proj["Total Open Area (Sq.m)"]} />
                    </Row>
                    <Row>
                      <Field label="Total Built-up Area (Sq.m)" value={proj["Total Built-up Area (Sq.m)"]} />
                      <Field label="Height of Building (m)" value={proj["Height of Building (m)"]} />
                    </Row>
                    <Row>
                      <Field label="Estimated Construction Cost (₹)" value={proj["Estimated Cost of Construction"]} />
                      <Field label="Cost of Land (₹)" value={proj["Cost of Land"]} />
                      <Field label="Total Project Cost (₹)" value={proj["Total Project Cost (₹)"]} />
                    </Row>
                  </Section>

                  {/* ── Parking & Garages ── */}
                  <Section title="Parking & Garage Details">
                    <Row>
                      <Field label="No. of Garages for Sale" value={proj["No of Garages Available for Sale"]} />
                      <Field label="Total Garage Area" value={proj["Total Area of Garages"]} />
                    </Row>
                    <Row>
                      <Field label="No. of Open Parking" value={proj["No of Open Parking Spaces"]} />
                      <Field label="Total Open Parking Area" value={proj["Total Open Parking"]} />
                    </Row>
                    <Row>
                      <Field label="No. of Covered Parking" value={proj["No of Covered Parking"]} />
                      <Field label="Total Covered Parking Area" value={proj["Total Covered Parking Area"]} />
                    </Row>
                  </Section>

                  {/* ── Material Facts ── */}
                  <Section title="Material Facts">
                    <Row>
                      <Field label="No. of Units in Project" value={materialFacts["No of Units in the project"]} />
                      <Field label="Units with Advance Taken" value={materialFacts["No of Units advances taken"]} />
                    </Row>
                    <Row>
                      <Field label="Units with Agreement for Sale" value={materialFacts["No of units where agreement for sale entered"]} />
                      <Field label="No. of Units Sold" value={materialFacts["No of units sold in the project"]} />
                    </Row>
                  </Section>

                  {/* ── Apartments Table ── */}
                  {apartmentRows.length > 0 && (
                    <Section title="Summary of Apartments / Units">
                      <div className="ppdm-table-wrap">
                        <table className="ppdm-table">
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Block Name</th>
                              <th>Apartment Type</th>
                              <th>Carpet Area (Sq.m)</th>
                              <th>No. of Apartments</th>
                            </tr>
                          </thead>
                          <tbody>
                            {apartmentRows.map((apt, idx) => (
                              <tr key={idx}>
                                <td>{idx + 1}</td>
                                <td>{safe(apt.name_of_the_block)}</td>
                                <td>{safe(apt.apartment_type)}</td>
                                <td>{safe(apt.carpet_area)}</td>
                                <td>{safe(apt.number_of_apartments)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </Section>
                  )}

                  {/* ── Plots Table ── */}
                  {plotRows.length > 0 && (
                    <Section title="Summary of Plots">
                      <div className="ppdm-table-wrap">
                        <table className="ppdm-table">
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Plot Type</th>
                              <th>Plot Area (Sq.m)</th>
                              <th>No. of Plots</th>
                            </tr>
                          </thead>
                          <tbody>
                            {plotRows.map((p, idx) => (
                              <tr key={idx}>
                                <td>{idx + 1}</td>
                                <td>{safe(p.plot_type)}</td>
                                <td>{safe(p.plot_area)}</td>
                                <td>{safe(p.number_of_plots)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </Section>
                  )}

                  {/* ── Associates ── */}
                  {(associates.architects || []).length > 0 && (
                    <Section title="Architects">
                      <div className="ppdm-table-wrap">
                        <table className="ppdm-table">
                          <thead>
                            <tr><th>#</th><th>Name</th><th>Mobile</th><th>Email</th><th>COA Reg No</th></tr>
                          </thead>
                          <tbody>
                            {associates.architects.map((a, i) => (
                              <tr key={i}>
                                <td>{i + 1}</td>
                                <td>{safe(a.name)}</td>
                                <td>{safe(a.mobile)}</td>
                                <td>{safe(a.email)}</td>
                                <td>{safe(a.reg_number)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </Section>
                  )}

                  {(associates.engineers || []).length > 0 && (
                    <Section title="Engineers">
                      <div className="ppdm-table-wrap">
                        <table className="ppdm-table">
                          <thead>
                            <tr><th>#</th><th>Name</th><th>Mobile</th><th>Email</th><th>Licence No</th></tr>
                          </thead>
                          <tbody>
                            {associates.engineers.map((e, i) => (
                              <tr key={i}>
                                <td>{i + 1}</td>
                                <td>{safe(e.name)}</td>
                                <td>{safe(e.mobile)}</td>
                                <td>{safe(e.email)}</td>
                                <td>{safe(e.licence_number)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </Section>
                  )}

                  {(associates.accountants || []).length > 0 && (
                    <Section title="Chartered Accountants">
                      <div className="ppdm-table-wrap">
                        <table className="ppdm-table">
                          <thead>
                            <tr><th>#</th><th>Name</th><th>Mobile</th><th>Email</th><th>ICAI Member ID</th></tr>
                          </thead>
                          <tbody>
                            {associates.accountants.map((a, i) => (
                              <tr key={i}>
                                <td>{i + 1}</td>
                                <td>{safe(a.name)}</td>
                                <td>{safe(a.mobile)}</td>
                                <td>{safe(a.email)}</td>
                                <td>{safe(a.icai_member_id)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </Section>
                  )}

                  {(associates.agents || []).length > 0 && (
                    <Section title="Associated Agents">
                      <div className="ppdm-table-wrap">
                        <table className="ppdm-table">
                          <thead>
                            <tr><th>#</th><th>Name</th><th>Mobile</th><th>RERA Registration No</th></tr>
                          </thead>
                          <tbody>
                            {associates.agents.map((a, i) => (
                              <tr key={i}>
                                <td>{i + 1}</td>
                                <td>{safe(a.name)}</td>
                                <td>{safe(a.mobile)}</td>
                                <td>{safe(a.registration_number)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </Section>
                  )}

                  {/* ── Gallery ── */}
                  <Section title="Project Gallery">
                    {gallery.length > 0 ? (
                      <div style={{ height: "400px" }}>
                        <GalleryCarousel images={gallery} />
                      </div>
                    ) : (
                      <p style={{ color: "#888", fontStyle: "italic" }}>No gallery images available.</p>
                    )}
                  </Section>

                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}