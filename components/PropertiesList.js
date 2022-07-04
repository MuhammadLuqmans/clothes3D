import PropertyItem from "/components/PropertyItem";
import snapState from "/components/snapState";
import { useSnapshot } from "valtio";

const desktopLayoutStyle = {
  width: "100%",
  backgroundColor: "#282828",
  height: "calc(100vh - 60px)",
  overflowY: "auto",
  flexDirection: "column"
}

const mobileLayoutStyle = {
  width: "100%",
  height: "100%",
  backgroundColor: "#282828",
  padding: "0 0.5rem",
  alignItems: "center",
  justifyContent: "space-between"
}

export default function PropertiesList(props) {
  const { deviceType, items } = props;
  const snap = useSnapshot(snapState);

  return (
    <div
      className={snap.current ? "d-flex" : "d-none"}
      style={deviceType === "desktop" ? desktopLayoutStyle : mobileLayoutStyle}
    >
      {items.map((item, index) => (
        <PropertyItem
          key={index}
          deviceType={deviceType}
          componenet={item}
        />
      ))}
    </div>
  );
}
