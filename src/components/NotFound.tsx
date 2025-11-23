import React from "react";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => {
  return (
    <main
      className="not-found page container"
      style={{
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "3rem 1rem",
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: 720 }}>
        <h1
          className="not-found__code"
          style={{
            margin: 0,
            fontSize: "clamp(2rem, 8vw, 4.5rem)",
            lineHeight: 1,
          }}
        >
          404
        </h1>

        <h2
          className="not-found__title"
          style={{ marginTop: "0.5rem", fontSize: "1.25rem", fontWeight: 600 }}
        >
          Page not found
        </h2>

        <p
          className="not-found__message muted"
          style={{ marginTop: "0.5rem", color: "var(--muted, #6b7280)" }}
        >
          The page you are looking for doesn't exist or has been moved.
        </p>

        <div style={{ marginTop: "1.25rem" }}>
          <Link
            to="/"
            className="btn btn-primary"
            style={{
              display: "inline-block",
              padding: "0.6rem 1.1rem",
              borderRadius: 8,
              background: "var(--brand, #2563eb)",
              color: "#fff",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Return home
          </Link>
        </div>
      </div>
    </main>
  );
};

export default NotFound;
