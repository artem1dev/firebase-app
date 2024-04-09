import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="container">
            <p className="float-right">
                <Link to="#">Back to top</Link>
            </p>
            <p>
                © 2024 Artem Bondar <Link to="#">Privacy</Link> · <Link to="#">Terms</Link>
            </p>
        </footer>
    );
};

export default Footer;
