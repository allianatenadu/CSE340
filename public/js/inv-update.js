// public/js/inv-update.js
const form = document.querySelector("#updateForm")
if (form) {
  form.addEventListener("change", function () {
    const updateBtn = document.querySelector("button")
    updateBtn.removeAttribute("disabled")
  })
}