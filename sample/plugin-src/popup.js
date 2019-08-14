console.info("Change anything here!");

import "./style.css";

const element = document.createElement("span");
element.innerText = "You clicked me! :)";

document
  .getElementById("button")
  .addEventListener("click", () => document.body.appendChild(element));
