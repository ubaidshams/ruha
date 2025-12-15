import React from "react";
import ruhaLogo from "../../assets/ruha-logo.png";

const RuhaLogo = () => {
  return (
    <img
      src={ruhaLogo}
      alt="Ruha"
      style={{ objectFit: "contain", height: "60px" }}
    />
  );
};

export default RuhaLogo;
