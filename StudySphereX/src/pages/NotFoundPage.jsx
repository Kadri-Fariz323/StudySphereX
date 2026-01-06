export const NotFoundPage = () => {
  return (
    <div
      style={{
        backgroundColor: "#000",
        color: "#fff",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "1rem",
      }}
    >
      <div>
        <h1 style={{ fontSize: "4rem", marginBottom: "1rem" }}>404</h1>
        <p style={{ fontSize: "1.25rem", opacity: 0.8 }}>
          Oops! The page you’re looking for doesn’t exist.
        </p>
      </div>
    </div>
  )
}
