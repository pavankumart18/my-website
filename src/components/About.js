import React from 'react';

export default function About() {
    return (
        <div className="about-container">
            <div className="blur-bg"></div> {/* Blurred background overlay */}
            <div className="container-fluid">
                <div className="row">
                    <div className="col-lg-7 d-flex align-items-center justify-content-center">
                        <div className="text text-center p-4">
                            <p>
                                I am T Pavan Kumar, an undergraduate at CBIT in the Department of Artificial Intelligence and Data Science.
                                I am an aspiring professional in MERN Stack, Google Cloud, Machine Learning, and Data Science.
                            </p>
                        </div>
                    </div>
                    <div className="col-lg-5 p-0">
                        <img className="Myimage img-fluid" src="./images/image.png" alt="Pavans" />
                    </div>
                </div>
            </div>
        </div>
    );
}
