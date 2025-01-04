// Toggle mobile menu
const mobileMenu = document.getElementById("mobile-menu");
const navList = document.querySelector(".nav-list");

mobileMenu.addEventListener("click", () => {
  navList.classList.toggle("active");
});

// script for alert-sms
document.addEventListener("DOMContentLoaded", function () {
  const alertSms = document.getElementById("alert-sms");
  if (alertSms) {
    setTimeout(() => {
      alertSms.classList.add("visible");
    }, 100);

    setTimeout(() => {
      alertSms.classList.remove("visible");
      setTimeout(() => {
        alertSms.remove();
      }, 2000);
    }, 2500);
  }
});

// script for pop-up profile window
// JavaScript to handle the pop-up visibility
document.addEventListener("DOMContentLoaded", () => {
  const profileSection = document.getElementById("profileSection");
  console.log(profileSection);
  const popup = document.getElementById("popup");

  if (profileSection && popup) {
    // Show the pop-up when clicking on the profile icon
    profileSection.addEventListener("click", () => {
      event.stopPropagation();
      console.log("hello");
      popup.style.display = "block";
    });

    // Close the pop-up when clicking outside of it
    window.addEventListener("click", (event) => {
      if (
        event.target !== popup &&
        !popup.contains(event.target) &&
        event.target !== profileSection &&
        !profileSection.contains(event.target)
      ) {
        popup.style.display = "none";
      }
    });
    popup.addEventListener("click", (event) => {
      event.stopPropagation();
    });
  }
});
