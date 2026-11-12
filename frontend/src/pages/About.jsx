import "./About.css";

function About() {
  return (
    <div className="about-page">
      <section className="about-hero">
        <span>ABOUT FIXMYCITY</span>
        <h1>Making Our Cities <span>Better Together.</span></h1>
        <p>
          FixMyCity empowers citizens to report local problems
          and work together towards cleaner, safer communities.
        </p>
      </section>

      <section className="about-content">
        <h2>Why FixMyCity?</h2>
        <p>
          Many problems in our cities go unnoticed or unresolved.
          Our platform gives citizens a simple way to report
          problems, track progress and encourage positive change.
        </p>

        <div className="about-cards">
          <div>
            <h3>Our Mission</h3>
            <p>Connect citizens with solutions to local problems.</p>
          </div>

          <div>
            <h3>Our Vision</h3>
            <p>Build cleaner, safer and smarter communities.</p>
          </div>

          <div>
            <h3>Our Goal</h3>
            <p>Make every citizen part of city improvement.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;