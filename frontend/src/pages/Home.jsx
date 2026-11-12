import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div className="home">

      <section className="hero-section">

        <div className="hero-content">

          <div className="hero-tag">
            <span></span> BUILDING BETTER COMMUNITIES
          </div>

          <h1>
            Your City.
            <br />
            <span>Our Responsibility.</span>
          </h1>

          <p>
            See something wrong? Say something.
            FixMyCity connects citizens with local authorities
            to build cleaner, safer, and better communities.
          </p>

          <div className="hero-buttons">
            <Link to="/report" className="report-btn">
              Report an Issue <span>→</span>
            </Link>

            <Link to="/categories" className="explore-btn">
              Explore Issues
            </Link>
          </div>

          <div className="hero-stats">
            <div>
              <h3>01</h3>
              <span>Report Problems</span>
            </div>

            <div>
              <h3>02</h3>
              <span>Track Progress</span>
            </div>

            <div>
              <h3>03</h3>
              <span>Create Impact</span>
            </div>
          </div>

        </div>

        <div className="hero-image">
          <img src="/src/assets/hero.png" alt="Better city community" />
        </div>

      </section>

      <section className="home-about">
        <span className="section-tag">OUR MISSION</span>

        <h2>
          Small Actions.
          <span> Big Changes.</span>
        </h2>

        <p>
          Every citizen deserves a better city.
          Together, we can identify problems, raise awareness,
          and make our neighborhoods better places to live.
        </p>
      </section>

    </div>
  );
}

export default Home;