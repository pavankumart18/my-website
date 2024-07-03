import React from 'react';
import { Link } from 'react-scroll';

export default function Navbar() {
    return (
        <>
            <nav className="navbar navbar-expand-lg fixed-top">
                <div className="container-fluid">
                    <a className="navbar-brand active" href="/" style={{fontSize: "2rem"}}>Pavan Kumar</a>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div
                        className="collapse navbar-collapse justify-content-center"
                        id="navbarNav"
                    >
                        <ul className="navbar-nav justify-content-center">
                            <li className="nav-item">
                                <Link
                                    className="nav-link"
                                    to="about"
                                    smooth={true}
                                    duration={300}
                                    spy={true}
                                    offset={-70}
                                    activeClass="active"
                                >
                                    <div style={{fontSize:"1.5rem"}}>About</div>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link
                                    className="nav-link"
                                    to="skills"
                                    smooth={true}
                                    duration={300}
                                    spy={true}
                                    offset={-70}
                                    activeClass="active"
                                >
                                    <div style={{fontSize:"1.5rem"}}>Skills</div>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link
                                    className="nav-link"
                                    to="projects"
                                    smooth={true}
                                    duration={300}
                                    spy={true}
                                    offset={-70}
                                    activeClass="active"
                                >
                                   <div style={{fontSize:"1.5rem"}}>Projects</div>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link
                                    className="nav-link"
                                    to="certifications"
                                    smooth={true}
                                    duration={300}
                                    spy={true}
                                    offset={-70}
                                    activeClass="active"
                                >
                                    <div style={{fontSize:"1.5rem"}}>Certifications</div>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link
                                    className="nav-link"
                                    to="contact"
                                    smooth={true}
                                    duration={300}
                                    spy={true}
                                    offset={-70}
                                    activeClass="active"
                                >
                                    <div style={{fontSize:"1.5rem"}}>Connect</div>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    );
}
