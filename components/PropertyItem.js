export default function PropertyItem(props) {
  const { deviceType, componenet } = props
  return deviceType === "desktop" ? (
    <div style={{ borderBottom: "1px solid #3c3c3c", color: "white", }}>
      <p
        style={{
          height: "40px",
          backgroundColor: "#000",
          margin: 0,
          padding: "0.5rem 1rem",
          borderBottom: "1px solid #3c3c3c"
        }}
      >
        {componenet.props.name}
      </p>
      <div style={{ padding: "0.5rem 1rem", }}>
        {componenet}
      </div>
    </div>
  ) : (
    <>
      {componenet}
    </>
  );
}
