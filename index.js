function toggleNotification(event) {
    event.preventDefault();
    const notificationPopUp = document.getElementById('notificationPopUp');
    // notificationPopUp.style.display = "block";

    if (notificationPopUp.style.display === 'none' || notificationPopUp.style.display === '') {
        notificationPopUp.style.display = 'block';
    } else {
        notificationPopUp.style.display = 'none';
    }
}

function AllorderTable(event) {
    event.preventDefault();
    document.getElementById('AllorderTable').style.display = 'block';
    document.getElementById('PendingorderTable').style.display = 'none';
    document.getElementById('deliveredgorderTable').style.display = 'none';
    document.getElementById('cancelorderTable').style.display = 'none';

}

function PendingorderTable(event) {
    event.preventDefault();
    document.getElementById('PendingorderTable').style.display = 'block';
    document.getElementById('AllorderTable').style.display = 'none';
    document.getElementById('deliveredgorderTable').style.display = 'none';
    document.getElementById('cancelorderTable').style.display = 'none';

}

function deliveredgorderTable(event) {
    event.preventDefault();
    document.getElementById('deliveredgorderTable').style.display = 'block';
    document.getElementById('PendingorderTable').style.display = 'none';
    document.getElementById('AllorderTable').style.display = 'none';
    document.getElementById('cancelorderTable').style.display = 'none';

}

function cancelorderTable(event) {
    event.preventDefault();
    document.getElementById('cancelorderTable').style.display = 'block';
    document.getElementById('deliveredgorderTable').style.display = 'none';
    document.getElementById('PendingorderTable').style.display = 'none';
    document.getElementById('AllorderTable').style.display = 'none';
}

// ✅ LOGIN FUNCTION
function logIn(event) {
  event.preventDefault();

  const loginBtn = document.getElementById("loginBtn"); // 🔹 your button must have id="loginBtn"
  if (loginBtn) {
    loginBtn.disabled = true;
    loginBtn.textContent = "Logging in..."; // show progress
  }

  const getEmail = document.getElementById('email').value;
  const getPassword = document.getElementById('password').value;

  if (getEmail === "" || getPassword === "") {
    Swal.fire({
      icon: 'info',
      title: 'All fields are required',
      confirmButtonColor: '#F58634'
    }).then(() => {
      if (loginBtn) {
        loginBtn.disabled = false;
        loginBtn.textContent = "Login";
      }
    });
    return;
  }

  const signData = { email: getEmail, password: getPassword };

  fetch('http://localhost:3001/amazon/document/api/login/distributor', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(signData)
  })
    .then(async response => {
      const text = await response.text(); 
      let result;

      try {
        result = JSON.parse(text);
      } catch {
        result = { message: text };
      }

      if (!response.ok) {
        // 🔴 Handle Access Denied separately
        if (response.status === 403) {
          localStorage.removeItem("authToken");
          localStorage.removeItem("role");
          localStorage.removeItem("userEmail");

          Swal.fire({
            icon: 'warning',
            title: 'Access Denied',
            text: result.message || "Not a distributor account.",
            confirmButtonColor: "#FFA500",
            timer: 2000,
            timerProgressBar: true
          }).then(() => {
            location.href = "signin.html";
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text: result.message || text || "Invalid email or password.",
            confirmButtonColor: "#2D85DE"
          }).then(() => {
            if (loginBtn) {
              loginBtn.disabled = false;
              loginBtn.textContent = "Login";
            }
          });
        }
        return;
      }

      // ✅ Successful login
      if (result.token) {
        localStorage.setItem("authToken", result.token);
        localStorage.setItem("role", result.role);
        localStorage.setItem("userEmail", result.email || getEmail);

        Swal.fire({
          icon: 'success',
          title: 'Login successful',
          confirmButtonColor: '#28a745'
        }).then(() => {
          location.href = "index.html";
        });
      }
    })
    .catch(error => {
      console.error('Login error:', error);
      Swal.fire({
        icon: 'error',
        text: "Something went wrong, please try again",
        confirmButtonColor: "#2D85DE"
      }).then(() => {
        if (loginBtn) {
          loginBtn.disabled = false;
          loginBtn.textContent = "Login";
        }
      });
    });
}

function logOut() {
  Swal.fire({
    title: 'Are you sure?',
    text: "You will be logged out of your account.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, log me out',
    cancelButtonText: 'Cancel'
  }).then((result) => {
    if (result.isConfirmed) {
      // 🚨 Clear stored login data
      localStorage.removeItem("authToken");
      localStorage.removeItem("role");
      localStorage.removeItem("userEmail");

      Swal.fire({
        icon: 'success',
        title: 'Logged out',
        text: 'You have been successfully logged out.',
        confirmButtonColor: '#28a745'
      }).then(() => {
        location.href = "signin.html"; // redirect to login page
      });
    }
  });
}

async function loadProducts() {
  try {
    const response = await fetch("http://localhost:3001/amazon/document/api/products"); // update with your API route
    if (!response.ok) throw new Error("Failed to fetch products");

    const products = await response.json();
    const tbody = document.querySelector("#TableId tbody");
    tbody.innerHTML = ""; // clear table first

    products.forEach(product => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${product.name}</td>
        <td>${product.category?.name || "N/A"}</td>
        <td>${product.numberInStock}</td>
        <td>${product.price}</td>
        <td><span class="badge bg-success">Paid</span></td>
      `;

      tbody.appendChild(row);
    });
  } catch (error) {
    console.error("Error loading products:", error);
  }
}

// Call when the page loads
document.addEventListener("DOMContentLoaded", loadProducts);