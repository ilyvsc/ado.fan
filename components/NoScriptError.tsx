import type { FC } from "react";

const NoScriptError: FC = () => {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .no-script-container {
            display: none;
          }

          noscript .no-script-container {
            display: flex;
          }

          @media (max-width: 768px) {
            .no-script-container {
              padding: 1rem !important;
              height: 100vh !important;
              height: 100dvh !important;
            }

            .no-script-content {
              padding: 2rem !important;
              max-width: 100% !important;
              margin: 0 !important;
            }

            .no-script-title {
              font-size: 1.5rem !important;
            }

            .no-script-text {
              font-size: 1rem !important;
            }

            .no-script-instructions {
              padding: 1rem !important;
              font-size: 0.875rem !important;
            }
          }
        `,
        }}
      />

      <noscript>
        <div
          className="no-script-container"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "#0f0f23",
            color: "#ffffff",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            padding: "2rem",
            fontFamily: "Inter, system-ui, -apple-system, sans-serif",
          }}
        >
          <div
            className="no-script-content"
            style={{
              maxWidth: "700px",
              padding: "3rem",
              backgroundColor: "#1a1a2e",
              borderRadius: "16px",
              border: "1px solid #333366",
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.5)",
            }}
          >
            <h1
              className="no-script-title"
              style={{
                fontSize: "2rem",
                fontWeight: "bold",
                marginBottom: "1rem",
                color: "#ef4444",
              }}
            >
              JavaScript Required
            </h1>

            <p
              className="no-script-text"
              style={{
                fontSize: "1.125rem",
                lineHeight: "1.7",
                marginBottom: "2rem",
                color: "#cccccc",
              }}
            >
              Please enable JavaScript in your browser settings to experience
              the full interactive features.
            </p>

            <div
              className="no-script-instructions"
              style={{
                backgroundColor: "#2a2a3e",
                padding: "1.5rem",
                borderRadius: "8px",
                marginBottom: "2rem",
                border: "1px solid #444466",
              }}
            >
              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  marginBottom: "1rem",
                  color: "#ef4444",
                }}
              >
                How to enable JavaScript:
              </h2>
              <ul
                style={{
                  textAlign: "left",
                  lineHeight: "1.6",
                  color: "#dddddd",
                }}
              >
                <li style={{ marginBottom: "0.5rem" }}>
                  <strong>Chrome:</strong> Settings → Privacy and security →
                  Site Settings → JavaScript
                </li>
                <li style={{ marginBottom: "0.5rem" }}>
                  <strong>Firefox:</strong> about:config → javascript.enabled →
                  true
                </li>
                <li style={{ marginBottom: "0.5rem" }}>
                  <strong>Safari:</strong> Preferences → Security → Enable
                  JavaScript
                </li>
                <li>
                  <strong>Edge:</strong> Settings → Site permissions →
                  JavaScript
                </li>
              </ul>
            </div>
          </div>
        </div>
      </noscript>
    </>
  );
};

export default NoScriptError;
