import React from "react";
import {
  Box,
} from "@mui/material";
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  YouTube,
} from "@mui/icons-material";
import "../styles/footer.css";
import { Link } from "react-router-dom";

const Footer = () => {

  return (
    <Box className="aprera-footer">

      {/* POLICY LINKS BAR */}
      <div className="aprera-policy-bar">

        <div className="aprera-policy-links">
          <Link to="/privacy-policy">Privacy Policy</Link> ›
          <Link to="/hyperlinking-policy">Hyperlinking Policy</Link> ›
          <Link to="/copyrightPolicy">Copyright Policy</Link> ›
          <Link to="/disclaimer">Disclaimer</Link> ›
          <Link to="/accessibility">Accessibility</Link> ›
          <Link to="/termsConditions">Terms & Conditions</Link>
        </div>

        {/* SOCIAL MEDIA */}
        <div className="aprera-policy-icons">

          <a
            className="aprera-icon aprera-fb"
            target="_blank"
            rel="noopener noreferrer"
            href="https://facebook.com"
          >
            <Facebook />
          </a>

          <a
            className="aprera-icon aprera-tw"
            target="_blank"
            rel="noopener noreferrer"
            href="https://twitter.com"
          >
            <Twitter />
          </a>

          <a
            className="aprera-icon"
            target="_blank"
            rel="noopener noreferrer"
            href="https://instagram.com"
          >
            <Instagram />
          </a>

          <a
            className="aprera-icon"
            target="_blank"
            rel="noopener noreferrer"
            href="https://linkedin.com"
          >
            <LinkedIn />
          </a>

          <a
            className="aprera-icon aprera-yt"
            target="_blank"
            rel="noopener noreferrer"
            href="https://youtube.com"
          >
            <YouTube />
          </a>

          {/* SCROLL TO TOP */}
          <i
            className="fa fa-angle-double-up aprera-icon aprera-up"
            aria-hidden="true"
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              })
            }
          />

        </div>
      </div>

      {/* COMPANY COPYRIGHT BAR */}
      <div className="aprera-govt-bar">

        <div className="aprera-govt-left">
          © 2026 Jhasina Technologies Pvt. Ltd.
          <br />
          All Rights Reserved.
        </div>

        <div className="aprera-govt-center">
          <span className="aprera-label">
            Real Estate Technology & Digital Solutions
          </span>
        </div>

        <div className="aprera-govt-right">
          Designed and Developed by
          <span className="aprera-aponline">
            {" "}Jhasina Technologies
          </span>
        </div>

      </div>

    </Box>
  );
};

export default Footer;