export default function Contact(){
    return (
        <>
            <section className="contact" id="contact">
                <div className="container">
                    <div className="heading text-center">
                        <h2>Let's Grow
                            <span> Together </span></h2>
                        <p></p>
                    </div>
                    <div className="row">
                        <div className="col-md-6 d-flex flex-column justify-content-center">
                            <div className="title text-center">
                            <h2>Connect
                            <span> With Me</span></h2>
                        <p></p>
                            </div>
                            <div className="content">
                                <div className="row">
                                    <div className="info col-12 text-center my-3">
                                        <i className="fas fa-mobile-alt"></i>
                                        <h4 className="d-inline-block font-weight-bold">PHONE:<br /><span className="main-content">+91 9652156129</span></h4>
                                    </div>
                                    <div className="info col-12 text-center my-3">
                                        <a href="mailto:pavankumart7052@gmail.com" className="text-decoration-none">
                                            <i className="far fa-envelope"></i>
                                            <h4 className="d-inline-block font-weight-bold">EMAIL:<br /><span className="main-content">pavankumart7052@gmail.com</span></h4>
                                        </a>
                                    </div>

                                    <div className="info col-12 text-center my-3">
                                        <a href="https://www.linkedin.com/in/pavan-kumar-958618263/" target="_blank" rel="noopener noreferrer">
                                            <i className="fa-brands fa-linkedin-in"></i>
                                            <h4 className="d-inline-block font-weight-bold">LinkedIn</h4>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 text-center mt-5">
                            <img src="./images/person.png" alt="Contact Us" className="img-fluid" />
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
