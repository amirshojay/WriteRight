$(function () {
  const token = localStorage.getItem("jwt");
  if (!token) {
    window.location.href = "notloggedin";
  } else {
    $(".menu-link").click(function () {
      $(".menu-link").removeClass("is-active");
      $(this).addClass("is-active");
    });
    $(".main-header-link").click(function () {
      $(".main-header-link").removeClass("is-active");
      $(this).addClass("is-active");
    });
  }
});

// $(function () {
//   $(".main-header-link").click(function () {
//     $(".main-header-link").removeClass("is-active");
//     $(this).addClass("is-active");
//   });
// });

$(".search-bar input")
  .focus(function () {
    $(".header").addClass("wide");
  })
  .blur(function () {
    $(".header").removeClass("wide");
  });

$(document).click(function (e) {
  var container = $(".status-button");
  var dd = $(".dropdown");
  if (!container.is(e.target) && container.has(e.target).length === 0) {
    dd.removeClass("is-active");
  }
});

$(function () {
  $(".dropdown").on("click", function (e) {
    $(".content-wrapper").addClass("overlay");
    e.stopPropagation();
  });
  $(document).on("click", function (e) {
    if ($(e.target).is(".dropdown") === false) {
      $(".content-wrapper").removeClass("overlay");
    }
  });
});

$(function () {
  $(".status-button:not(.open)").on("click", function (e) {
    $(".overlay-app").addClass("is-active");
  });
  $(".pop-up .close").click(function () {
    $(".overlay-app").removeClass("is-active");
  });
});

$(".status-button:not(.open)").click(function () {
  $(".pop-up").addClass("visible");
});

$(".pop-up .close").click(function () {
  $(".pop-up").removeClass("visible");
});

const toggleButton = document.querySelector(".dark-light");

toggleButton.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
});

const userInput = document.getElementById("userInput");
const userOutput = document.getElementById("userOutput");

const userBtn = document.getElementById("userBtn");

userBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  try {
    const token = localStorage.getItem("jwt");
    const response = await fetch("http://localhost:3000/index", {
      method: "POST",
      body: JSON.stringify({ prompt: userInput.value }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    // Check if the response indicates that the user is not authorized
    if (response.status === 401) {
      window.location.href = "/register";
    }
    const data = await response.json();
    userOutput.value = data.response.replace(/\n/g, "");
  } catch (error) {
    console.error(error);
  }
});

$(document).ready(function () {
  $(".notification").click(function () {
    // Make an API call to get the user's debt
    const token = localStorage.getItem("jwt");
    fetch("http://localhost:3000/debt", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // Update the debtAmount span with the user's debt
        $("#debtAmount").text(data.debt);

        // Show the notification-layer
        $(".notification-layer").removeClass("hidden");
      })
      .catch((error) => {
        console.error(error);
      });
  });

  // Hide the notification-layer when the user clicks outside of it
  $(".overlay-app").click(function () {
    $(".notification-layer").addClass("hidden");
  });
});

function logout() {
  fetch("/logout", {
    method: "GET",
  })
    .then(() => {
      localStorage.removeItem("jwt"); // remove JWT token from local storage
      window.location.href = "/register"; // redirect user to login page
    })
    .catch((err) => {
      console.log(err);
    });
}

const logoutelement = document.getElementById("logout");
logoutelement.addEventListener("click", logout);
