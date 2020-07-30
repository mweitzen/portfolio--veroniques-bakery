/* STICKY NAVBAR */
var navbar = document.getElementById("navbar");
var stickingPoint = navbar.offsetTop;

export function attachFixedClassToNavbar() {
  if (window.pageYOffset >= stickingPoint) {
    navbar.classList.add("fixed-top")
  } else {
    navbar.classList.remove("fixed-top");
  }
}
