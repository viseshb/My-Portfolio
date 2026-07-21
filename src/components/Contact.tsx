import { MdArrowOutward, MdCopyright } from "react-icons/md";
import "./styles/Contact.css";

const Contact = () => {
  return (
    <div className="contact-section section-container" id="contact">
      <div className="contact-container">
        <h3>Contact</h3>
        <div className="contact-flex">
          <div className="contact-box">
            <h4>Email</h4>
            <p>
              <a href="mailto:visesh66@gmail.com" data-cursor="disable">
                visesh66@gmail.com
              </a>
            </p>
            <h4>Education</h4>
            <p>
              MS in Computer Science, Texas A&amp;M University,
              Graduated May 2026
            </p>
          </div>
          <div className="contact-box">
            <h4>Social</h4>
            <a
              href="https://github.com/viseshb"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              Github <MdArrowOutward aria-hidden="true" />
            </a>
            <a
              href="https://www.linkedin.com/in/viseshb"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              Linkedin <MdArrowOutward aria-hidden="true" />
            </a>
            <a
              href="https://www.instagram.com/visesh_visu/"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="disable"
              className="contact-social"
            >
              Instagram <MdArrowOutward aria-hidden="true" />
            </a>
          </div>
          <div className="contact-box">
          <p className="contact-credit">
            Made with love ❤️ by <span>Visesh Bentula</span>
          </p>
            <p className="contact-built-with">
              Built with React, TypeScript &amp; Three.js
            </p>
            <p className="contact-copyright">
              <MdCopyright aria-hidden="true" /> 2026 Visesh Bentula
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
