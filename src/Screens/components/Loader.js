import React from "react";

function Loader() {
  return (
    <div id="loader-container">
      <img width="120px" src={require("../../assets/loader3.gif")} />
    </div>
  );
}

export default Loader;
