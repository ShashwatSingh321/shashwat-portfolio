
import { useEffect, useState } from "react";
import profile from "./data/profile";
import projects from "./data/projects";
import skills from "./data/skills";
import certificates from "./data/certificates";
import "./App.css"; // Keep this if you have other custom App-level styles, or remove if index.css covers everything. I recommend importing index.css in main.jsx instead.

function App() {
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [githubMetadata, setGithubMetadata] = useState({});

  const featuredProjects = projects.filter((project) => project.featured);
  const displayedProjects = showAllProjects ? projects : featuredProjects;

  useEffect(() => {
    let cancelled = false;

    async function fetchGitHubMetadata() {
      const results = await Promise.allSettled(
        projects.map(async (project) => {
          if (!project.repoUrl) return null;

          const repoPath = new URL(project.repoUrl).pathname
            .replace(/^\/|\/$/g, "")
            .replace(/\.git$/, "");

          const response = await fetch(
            `https://api.github.com/repos/${repoPath}`
          );

          if (!response.ok) {
            throw new Error(`GitHub API returned ${response.status}`);
          }

          const data = await response.json();

          return {
            id: project.id,
            language: data.language,
            stars: data.stargazers_count,
            forks: data.forks_count,
          };
        })
      );

      if (cancelled) return;

      const metadata = {};

      results.forEach((result) => {
        if (result.status === "fulfilled" && result.value) {
          metadata[result.value.id] = result.value;
        }
      });

      setGithubMetadata(metadata);
    }

    fetchGitHubMetadata();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="portfolio">
      <header className="navbar">
        <a className="brand" href="#home">
          SS<span>.</span>
        </a>

        <nav className="nav-links" aria-label="Main navigation">
          <a href="#about">About</a>
          <a href="#projects">Projects</a>
          <a href="#skills">Skills</a>
          <a href="#certificates">Certificates</a>
        </nav>

        <a className="nav-contact" href="#contact">
          Let's connect ↗
        </a>
      </header>

      <main>
        {/* HERO SECTION */}
        <section className="hero section-container" id="home">
          <div className="hero-content">
            <div className="availability">
              <span className="availability-dot" />
              Open to software engineering opportunities
            </div>

            <p className="eyebrow">HELLO, I'M</p>

            <h1>
              {profile.name}
              <span className="name-period">.</span>
            </h1>

            <h2>{profile.role}</h2>

            <p className="hero-description">{profile.introduction}</p>

            <div className="hero-actions">
              <a className="button button-primary" href="#projects">
                View My Work <span>↗</span>
              </a>

              <a className="button button-secondary" href="#contact">
                Contact Me
              </a>

              {profile.resume && (
                <a
                  className="button button-secondary"
                  href={profile.resume}
                  download="Shashwat_Singh_Resume.pdf"
                >
                  Download Resume ↓
                </a>
              )}
            </div>

            <div className="social-links">
              <a href={profile.social.github} target="_blank" rel="noreferrer">
                GitHub ↗
              </a>

              {profile.social.linkedin && (
                <a
                  href={profile.social.linkedin}
                  target="_blank"
                  rel="noreferrer"
                >
                  LinkedIn ↗
                </a>
              )}

              {profile.email && (
                <a href={`mailto:${profile.email}`}>Email ↗</a>
              )}
            </div>
          </div>

          <div className="hero-visual">
            <div className="portrait-frame">
              {!imgError && profile.photo ? (
                <img
                  src={profile.photo}
                  alt={`Portrait of ${profile.name}`}
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="portrait-placeholder">
                  <span>{profile.name?.charAt(0) || "S"}</span>
                  <p>Your photo goes here</p>
                  <small>public/images/profile.jpg</small>
                </div>
              )}
            </div>

            <div className="floating-card">
              <span className="floating-card-icon">✳</span>
              <div>
                <strong>Building & learning</strong>
                <p>One project at a time.</p>
              </div>
            </div>
          </div>
        </section>

        {/* INTRO STRIP */}
        <section className="intro-strip">
          <div className="section-container intro-strip-inner">
            <span>SOFTWARE DEVELOPMENT</span>
            <span className="strip-divider">✳</span>
            <span>BACKEND SYSTEMS</span>
            <span className="strip-divider">✳</span>
            <span>ARTIFICIAL INTELLIGENCE</span>
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section className="section-container content-section" id="about">
          <div className="section-heading">
            <p className="eyebrow">A LITTLE ABOUT ME</p>
            <h2>
              Curious by nature.
              <br />
              <span>Builder by choice.</span>
            </h2>
          </div>

          <div className="about-content">
            <p>
              I'm pursuing my degree in Computer Science and Engineering at{" "}
              {profile.education.university}. I enjoy exploring how software
              systems work and turning ideas into useful applications.
            </p>

            <p>
              My interests include backend development, application
              architecture, and AI-powered solutions. I focus on learning by
              building projects and understanding the technology behind them.
            </p>

            <div className="about-facts">
              <div>
                <span>EDUCATION</span>
                <strong>{profile.education.degree}</strong>
              </div>

              <div>
                <span>UNIVERSITY</span>
                <strong>{profile.education.university}</strong>
              </div>

              <div>
                <span>EXPECTED GRADUATION</span>
                <strong>{profile.education.graduationYear}</strong>
              </div>

              {profile.education.cgpa && (
                <div>
                  <span>CGPA</span>
                  <strong>{profile.education.cgpa}/10</strong>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* PROJECTS SECTION */}
        <section className="projects-section" id="projects">
          <div className="section-container">
            <div className="section-heading section-heading-row">
              <div>
                <p className="eyebrow">SELECTED WORK</p>
                <h2>
                  Projects I've <span>built.</span>
                </h2>
              </div>

              <a
                className="text-link"
                href={profile.social.github}
                target="_blank"
                rel="noreferrer"
              >
                More on GitHub ↗
              </a>
            </div>

            <div className="project-grid">
              {displayedProjects.map((project, index) => (
                <article className="project-card" key={project.id}>
                  <div className={`project-art project-art-${(index % 2) + 1}`}>
                    <span className="project-number">
                      PROJECT / 0{index + 1}
                    </span>

                    <span className="project-art-symbol">
                      {index % 2 === 0 ? "⌘" : "◈"}
                    </span>

                    <span className="project-art-caption">
                      {project.category}
                    </span>
                  </div>

                  <div className="project-details">
                    <div className="project-title-row">
                      <h3>{project.name}</h3>
                      <span className="project-arrow">↗</span>
                    </div>

                    <p>{project.description}</p>

                    {project.technologies?.length > 0 && (
                      <div className="project-tech">
                        {project.technologies.map((technology) => (
                          <span key={technology}>{technology}</span>
                        ))}
                      </div>
                    )}

                    {githubMetadata[project.id] && (
                      <div className="github-stats">
                        {githubMetadata[project.id].language && (
                          <span>
                            <span className="language-dot" />
                            {githubMetadata[project.id].language}
                          </span>
                        )}

                        <span>
                          ★ {githubMetadata[project.id].stars} stars
                        </span>

                        <span>
                          ⑂ {githubMetadata[project.id].forks} forks
                        </span>
                      </div>
                    )}

                    <div className="project-actions">
                      {project.repoUrl && (
                        <a
                          className="project-link"
                          href={project.repoUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Source Code ↗
                        </a>
                      )}

                      {project.liveUrl && (
                        <a
                          className="project-link"
                          href={project.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Live Demo ↗
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {featuredProjects.length === 0 && (
              <p className="empty-state">
                Projects will appear here as you add them.
              </p>
            )}

            {projects.length > featuredProjects.length && (
              <div className="projects-footer">
                <button
                  className="button button-secondary"
                  onClick={() => setShowAllProjects((current) => !current)}
                >
                  {showAllProjects
                    ? "Show Featured Projects ↑"
                    : "View All Projects ↗"}
                </button>
              </div>
            )}
          </div>
        </section>

        {/* SKILLS SECTION */}
        <section className="section-container content-section" id="skills">
          <div className="section-heading">
            <p className="eyebrow">MY TOOLKIT</p>
            <h2>
              Tools I work <span>with.</span>
            </h2>
          </div>

          <div className="skills-grid">
            {skills.map((group) => (
              <div className="skill-group" key={group.category}>
                <h3>{group.category}</h3>

                <div className="skill-tags">
                  {group.items.map((skill) => (
                    <span key={skill}>{skill}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CERTIFICATES SECTION */}
        <section className="certificate-section" id="certificates">
          <div className="section-container certificate-inner">
            <div className="section-heading">
              <p className="eyebrow">LEARNING & ACHIEVEMENTS</p>
              <h2>
                Certificates & <span>recognition.</span>
              </h2>
            </div>

            {certificates.length > 0 ? (
              <div className="certificate-grid">
                {certificates.map((certificate) => (
                  <article className="certificate-card" key={certificate.id}>
                    <span className="certificate-icon">↗</span>
                    <h3>{certificate.title}</h3>
                    <p>{certificate.issuer}</p>
                    <span className="certificate-date">
                      {certificate.date}
                    </span>

                    {certificate.fileUrl && (
                      <a
                        className="text-link"
                        href={certificate.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={{ marginRight: '12px' }}
                      >
                        View ↗
                      </a>
                    )}

                    {certificate.verificationUrl && (
                      <a
                        className="text-link"
                        href={certificate.verificationUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Verify ↗
                      </a>
                    )}
                  </article>
                ))}
              </div>
            ) : (
              <div className="certificate-empty">
                <span className="certificate-empty-icon">＋</span>
                <div>
                  <h3>Credentials worth sharing.</h3>
                  <p>
                    My certificates and verified achievements will be added
                    here.
                  </p>
                </div>
                <span className="coming-soon">COMING SOON</span>
              </div>
            )}
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section className="section-container contact-section" id="contact">
          <p className="eyebrow">HAVE AN OPPORTUNITY?</p>

          <h2>
            Let's build something
            <br />
            <span>meaningful.</span>
          </h2>

          <p className="contact-description">
            I'm interested in connecting with people working on interesting
            software, backend, and AI projects.
          </p>

          <div className="contact-actions">
            {profile.email ? (
              <a
                className="button button-primary"
                href={`mailto:${profile.email}`}
              >
                Get in touch ↗
              </a>
            ) : (
              <span className="contact-email-pending">
                Contact details coming soon
              </span>
            )}

            <a
              className="button button-secondary"
              href={profile.social.github}
              target="_blank"
              rel="noreferrer"
            >
              Visit GitHub ↗
            </a>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="section-container footer-inner">
          <a className="brand" href="#home">
            SS<span>.</span>
          </a>

          <p>
            Designed & built by {profile.name} · {new Date().getFullYear()}
          </p>

          <a href="#home">Back to top ↑</a>
        </div>
      </footer>
    </div>
  );
}

export default App;