/**
 * Neither this file or any dependency (like style.css) should trigger
 * the plugin reload. This way the popup will not close clearing it state
 */
import "./style.css";

const element = document.createElement("span");
element.innerText = "You clicked me! :)";

document
  .getElementById("button")
  .addEventListener("click", () => document.body.appendChild(element));
