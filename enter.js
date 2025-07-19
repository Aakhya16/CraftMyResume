import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

import { firebaseConfig } from './firebase-config.js';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const themeSwitch = document.getElementById("theme-switch");
if (themeSwitch) {
  themeSwitch.addEventListener("change", () => {
    document.body.classList.toggle("dark-mode");
  });
}

window.addCustomSection = function () {
  const container = document.getElementById("custom-sections");

  const wrapper = document.createElement("div");
  wrapper.classList.add("custom-section");

  const titleInput = document.createElement("input");
  titleInput.type = "text";
  titleInput.placeholder = "Section Title";

  const contentInput = document.createElement("textarea");
  contentInput.placeholder = "Section Content";

  wrapper.appendChild(titleInput);
  wrapper.appendChild(contentInput);
  container.appendChild(wrapper);
};

window.generateResume = function () {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const summary = document.getElementById("summary").value.trim();
  const skills = document.getElementById("skills").value.trim();
  const education = document.getElementById("education").value.trim();
  const experience = document.getElementById("experience").value.trim();
  const template = document.getElementById("template-select").value;

  const customSections = document.querySelectorAll("#custom-sections .custom-section");
  let customHTML = "";

  customSections.forEach(section => {
    const title = section.querySelector("input").value.trim();
    const content = section.querySelector("textarea").value.trim();
    if (title && content) {
      customHTML += `
        <section>
          <h3>${title}</h3>
          <p>${content}</p>
        </section>
      `;
    }
  });

  const previewHTML = `
    <div class="resume-output resume ${template}">
      <h1>${name}</h1>
      <p><strong>Email:</strong> ${email} | <strong>Phone:</strong> ${phone}</p>

      <section>
        <h3>Professional Summary</h3>
        <p>${summary}</p>
      </section>

      <section>
        <h3>Skills</h3>
        <p>${skills}</p>
      </section>

      <section>
        <h3>Education</h3>
        <p>${education}</p>
      </section>

      <section>
        <h3>Experience</h3>
        <p>${experience}</p>
      </section>

      ${customHTML}
    </div>
  `;

  document.getElementById("resume-preview").innerHTML = previewHTML;

  const resumeData = {
    name, email, phone, summary, skills, education, experience, template,
    timestamp: new Date().toISOString()
  };

  addDoc(collection(db, "resumes"), resumeData)
    .then(() => console.log("Resume saved"))
    .catch(err => alert("Error saving resume: " + err.message));
};

window.downloadPDF = function () {
  const content = document.getElementById("resume-preview").innerText;
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "CraftMyResume.txt";
  link.click();
};





