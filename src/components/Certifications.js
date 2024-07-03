export default function Certifications() {
    return(<>
            <div className="container-fluid certifications-background">
            <h1 className="certification-heading"> Certifications </h1>
            <div id="carouselExampleRide" class="carousel slide main-area" data-bs-ride="true">
                    <div class="carousel-inner certificates-page">
                        <div class="carousel-item active ">
                            <div className="row">
                                <div className="col col-lg-5">
                                <div className="d-block w-100 bg-light p-5 h-100">
                                        <a href="https://example.com/certificate-link" style={{textDecoration:"None"}}><h2>Associate Cloud Engineer Completion Certificate</h2></a>
                                        <h4>What I Learned</h4>
                                        <ul>
                                            <li>Understanding of core cloud concepts and architecture.</li>
                                            <li>Practical skills in deploying and managing cloud infrastructure.</li>
                                            <li>Knowledge of cloud security best practices.</li>
                                            <li>Ability to monitor and optimize cloud-based applications and services.</li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="col col-lg-7">
                                    <img src="./images/cloud.png" alt="Cloud Certificate" style={{width:"800px",height:"550px"}} />

                                </div>

                            </div>
                        </div>
                        <div class="carousel-item">
                            <div className="row">
                                <div className="col col-lg-5">
                                <div className="d-block w-100 bg-light p-5 h-100">
                                    <a href="https://www.linkedin.com/in/pavan-kumar-958618263/details/certifications/" style={{textDecoration:"None"}}><h2>Data Science Certificate by Infosys Springboard</h2></a>
                                     <h4>What I Learned</h4>
                                    <ul>
                                        <li>Understanding of core data science concepts and methodologies.</li>
                                        <li>Practical skills in data analysis, visualization, and interpretation.</li>
                                        <li>Knowledge of machine learning algorithms and their applications.</li>
                                        <li>Ability to use data science tools such as Python, R, and SQL.</li>
                                    </ul>
                                </div>
                                </div>
                                <div className="col col-lg-7">
                                    <img src="./images/science.png" alt="Data Science Certificate" style={{width:"800px",height:"550px"}} />

                                </div>

                            </div>
                        </div>
                        <div class="carousel-item">
                            <div className="row">
                                <div className="col col-lg-5">
                                <div className="d-block w-100 bg-light p-5 h-100">
                                    <a href="https://www.linkedin.com/in/pavan-kumar-958618263/details/certifications/" style={{textDecoration:"None"}}><h2>Virtual Internship Completion Certificate - MathWorks</h2></a>
                                   <h4>What I Learned</h4>
                                    <ul>
                                        <li>Fundamentals of Artificial Intelligence and Machine Learning.</li>
                                        <li>Hands-on experience with AI and ML tools and techniques.</li>
                                        <li>Development and deployment of AI models using MathWorks software.</li>
                                        <li>Understanding of AI applications in real-world scenarios.</li>
                                    </ul>
                                </div>
                                </div>
                                <div className="col col-lg-7">
                                    <img src="./images/mathworks.png" alt="Data Science Certificate" style={{width:"800px",height:"550px"}} />

                                </div>

                            </div>
                        </div>
                        <div class="carousel-item">
                            <div className="row">
                                <div className="col col-lg-5">
                                <div className="d-block w-100 bg-light p-5 h-100">
                                    <a href="https://www.linkedin.com/in/pavan-kumar-958618263/details/certifications/" style={{textDecoration:"None"}}><h2>Google Developer Groups Code Vipassana Certificate</h2></a>
                                    <h4>What I Learned</h4>
                                    <ul>
                                        <li>Advanced data processing and analysis techniques.</li>
                                        <li>Hands-on experience with Google Cloud tools and services.</li>
                                        <li>Development and deployment of AI models on Google Cloud.</li>
                                        <li>Practical skills in cloud-based AI solutions and their applications.</li>
                                    </ul>
                                </div>
                                </div>
                                <div className="col col-lg-7">
                                    <img src="./images/vipassana.png" alt="Data Science Certificate" style={{width:"800px",height:"550px"}} />

                                </div>

                            </div>
                        </div>
                    </div>
                    <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleRide" data-bs-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Previous</span>
                    </button>
                    <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleRide" data-bs-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Next</span>
                    </button>
                    </div>
            </div>

    </>)
}