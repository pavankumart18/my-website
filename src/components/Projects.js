export default function Projects() {
    return (
        <>  
            <div className="container-fluid" style={{ backgroundImage: `url('./images/background.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '100vh' ,filter: '7px'}}>
                <h2 className="project-heading">My Projects</h2>
                <div class="container my-4" style={{fontSize:"2rem",justifyContent:"center",alignItems:"center"}}>
                        <p>Here are my projects that I have completed based on the above skills and using the mentioned tools. Contributions to my projects are always welcome!</p>
                        
                        <a class="btn btn-primary btn-lg mb-3" href="https://github.com/pavankumart18" role="button"><i class="fa-brands fa-github"></i>  Visit My GitHub</a>
                        
                        <p>Alternatively, click the title of any project below to access its repository.</p>
                        </div>

                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div id="carouselExampleCaptions" className="carousel slide" data-bs-ride="carousel">
                            <div className="carousel-indicators">
                                <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                                <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
                                <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
                                <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="3" aria-label="Slide 4"></button>
                                <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="4" aria-label="Slide 5"></button>
                                <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="5" aria-label="Slide 6"></button>
                                <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="6" aria-label="Slide 7"></button>
                            </div>
                            <div className="carousel-inner">
                                <div className="carousel-item" style={{backgroundImage: `url(./images/bus.png)`}}>
                                    <div className="d-block w-100 bg-light p-5">
                                        <a href="https://github.com/pavankumart18/BusTicketReservation" style={{textDecoration:"None"}}><h2>Bus Reservation System</h2></a>
                                        <p>This is a simple <strong>bus reservation system</strong> that allows users to reserve seats on a bus. The system ensures that seat allocation respects <strong>gender-based</strong> adjacency preferences and provides a visual representation of the seating arrangement.</p>
                                        <h4>Features</h4>
                                        <ul>
                                            <li><strong>User Input:</strong> Collects user details such as name, age, and gender.</li>
                                            <li><strong>Berth Allotment:</strong> Allocates seats based on availability and gender-based adjacency preferences.</li>
                                            <li><strong>Visual Representation:</strong> Provides a visual representation of the seating arrangement.</li>
                                            <li><strong>Reservation Details:</strong> Displays the reservation details after each successful booking.</li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="carousel-item active" style={{backgroundImage: `url(./images/train.png)`}}>
                                    <div className="d-block w-100 bg-light p-5">
                                    <a href="https://github.com/pavankumart18/Railway-Ticket-Reservation-System" style={{textDecoration:"None"}}><h2>Railway Ticket Reservation System - Based on Gender</h2></a>
                                        <p>This project implements a <strong>train berth booking system</strong> in Python. It allows for booking train berths across different classes and seat types, it also makes <strong>secure seat allocation for females and aged people</strong>,while also providing visual representations of each class's seating arrangement</p>
                                        <h4>Features</h4>
                                        <ul>
                                            <li><strong>Berth Booking:</strong> Collects user details such as name, age, and gender,seat type and class type.</li>
                                            <li><strong>Seat Allocation:</strong> Allocates seats based on availability and gender-based adjacency preferences.</li>
                                            <li><strong>Visual Representation:</strong> Provides a visual representation of the seating arrangement.</li>
                                            <li><strong>Reservation Details:</strong> Displays the reservation details after each successful booking.</li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="carousel-item" style={{backgroundImage: `url(./images/news.png)`}}>
                                    <div className="d-block w-100 bg-light p-5" >
                                        <a href="https://github.com/pavankumart18/Railway-Ticket-Reservation-System" style={{textDecoration:"None"}}><h2>NEWS AGGREGATOR AND SUMMARIZER</h2></a>
                                        <p>The AI News <strong>Aggregator</strong> and <strong>Summarizer</strong>, powered by the <strong>MERN </strong>stack and integrated with the <strong>ChatGPT API</strong>, represents a cutting-edge solution to the modern challenge of accessing relevant and trustworthy news amidst the vast array of online source.</p>
                                        <h4>Features</h4>
                                        <ul>
                                            <li><strong>Summarization:</strong> The ChatGPT API is utilized to generate concise summaries of news articles.</li>
                                            <li><strong>Personalization:</strong> Through continuous learning and adaptation, the platform tailors news summaries to individual user preferences.</li>
                                            <li><strong>Timeliness:</strong> With real-time access to the ChatGPT API, the platform delivers timely news summaries as soon as articles are collected.</li>
                                            <li><strong>Automation:</strong> Automatically it Collects News from top website using NEWS API.</li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="carousel-item" style={{backgroundImage: `url(./images/shape.png)`}}>
                                    <div className="d-block w-100 bg-light p-5" >
                                        <a href="https://github.com/pavankumart18/Smart-Hair" style={{textDecoration:"None"}}><h2>Smart Hair Recommendation</h2></a>
                                        <p>The $20B hair care industry has the opportunity to evolve and differentiate to meet the needs of today’s high-tech, on-the-move women. Hair salons that appeal to these high-earning women must satisfy them by offering a differentiating level of service. With this project, we attempt to address this challenge by developing a <strong>hairstyle recommendation system that identifies the user’s face shape and recommends the most flattering hairstyle</strong>.</p>
                                        <h4>Features</h4>
                                        <ul>
                                            <li><strong>Face Shape Classification:</strong> Utilizes facial feature mapping and machine learning models to classify the user's face shape into one of five categories: heart, long, oval, round, or square.</li>
                                            <li><strong>Hair Type Preference:</strong> Captures user preferences for hair type, such as straight, curly, wavy, etc., which influences the recommended hairstyles.</li>
                                            <li><strong>User Interface:</strong> Enhanced with User Interface By asking some Questions and getting user priorities.</li>
                                            <li><strong>FaceShape:</strong> User can Know What type of Face Shape They are having for future decisions.</li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="carousel-item" style={{backgroundImage: `url(./images/climate.png)`}}>
                                <div className="d-block w-100 bg-light p-5">
                                    <a href="https://github.com/pavankumart18/Climate-Cast" style={{textDecoration:"None"}}><h2>Climate Cast - Analysis of Climate Change</h2></a>
                                    <p>The ongoing issue of climate change has sparked significant interest and concern worldwide. With this project, we aim to provide a comprehensive analysis of climate change by developing a <strong>system that analyzes climate data and provides insights into trends and patterns</strong>.</p>
                                    <h4>Features</h4>
                                    <ul>
                                        <li><strong>Data Collection:</strong> Aggregates climate data from various reliable sources to ensure comprehensive coverage and accuracy.</li>
                                        <li><strong>Trend Analysis:</strong> Utilizes advanced statistical methods and machine learning models to identify trends and patterns in the climate data.</li>
                                        <li><strong>Impact Assessment:</strong> Evaluates the potential impacts of climate change on different regions and sectors.</li>
                                        <li><strong>Actionable Insights:</strong> Provides recommendations for mitigating the effects of climate change based on the analysis.</li>
                                    </ul>
                                </div>
                                </div>
                                <div className="carousel-item" style={{backgroundImage: `url(./images/community.png)`}}>
                                <div className="d-block w-100 bg-light p-5">
                                        <a href="https://github.com/pavankumart18/StudyBuddy" style={{textDecoration:"None"}}><h2>Study Buddy</h2></a>
                                        <p>The "Study Buddy" project is designed to facilitate group communication and collaboration among students. This Django-based website allows users to create profiles, form groups, and engage in discussions within virtual rooms. Users can also comment on others' rooms after obtaining permission, promoting a collaborative learning environment.</p>
                                        <h4>Features</h4>
                                        <ul>
                                            <li><strong>User Profiles:</strong> Enables users to create and customize their profiles for better identification and interaction.</li>
                                            <li><strong>Room Creation:</strong> Allows users to create rooms for group communication and collaboration on various topics.</li>
                                            <li><strong>Group Communication:</strong> Facilitates communication within groups through dedicated discussion rooms.</li>
                                            <li><strong>Commenting System:</strong> Users can comment on discussions in other rooms after receiving permission, fostering a respectful and secure environment.</li>
                                            <li><strong>Permission-Based Interaction:</strong> Ensures that users can interact in others' rooms only with the appropriate permissions, maintaining privacy and control over discussions.</li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="carousel-item" style={{backgroundImage: `url(./images/notes.png)`}}>
                                <div className="d-block w-100 bg-light p-5">
                                    <a href="https://github.com/pavankumart18/Student-Portal" style={{textDecoration:"None"}}><h2>Student Portal</h2></a>
                                    <p>Welcome to our Student Portal GitHub repository – the central hub for all our academic resources and collaboration tools! Our repository is designed to streamline the academic experience for students, offering a range of features to enhance learning and communication.</p>
                                    <h4>Features</h4>
                                    <ul>
                                        <li><strong>Download and Upload Notes:</strong> Access lecture materials and class notes effortlessly. Download notes to study on-the-go and contribute by uploading your own notes to share with fellow students.</li>
                                        <li><strong>Assignment Submission:</strong> Seamlessly submit assignments and classwork directly through GitHub. Keep track of deadlines and collaborate with classmates on group projects.</li>
                                        <li><strong>Event Tracking:</strong> Stay informed about upcoming events, workshops, and academic deadlines. Our event tracking system ensures you never miss an important academic or extracurricular activity.</li>
                                        <li><strong>Class Timetable:</strong> Plan your schedule effectively with our dynamic class timetable feature. View your weekly schedule and stay organized for all your classes.</li>
                                    </ul>
                                </div>

                                </div>
                            </div>
                            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
                                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">Previous</span>
                            </button>
                            <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
                                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">Next</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
