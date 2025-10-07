console.log("✅ Script loaded successfully");

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
          localStorage.removeItem("userCity");

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
        localStorage.setItem("userCity", result.city);
        


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
      localStorage.removeItem("userCity");

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
  console.log("✅ Script is running...");

  try {
    const response = await fetch("http://localhost:3001/amazon/document/api/products");
    if (!response.ok) throw new Error("Failed to fetch products");

    const products = await response.json();
    console.log("📦 Products received:", products);

    // ✅ Confirm we can find the tbody
    const tbody = document.querySelector("#TayBlade tbody");
    console.log("🔍 Found tbody:", tbody);

    if (!tbody) {
      console.error("❌ Table body not found!");
      return;
    }

    // Clear old content
    tbody.innerHTML = "";

    if (!Array.isArray(products) || products.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted">No products found</td></tr>`;
      console.warn("⚠️ No products found");
      return;
    }

    // ✅ Loop through products and add rows
    products.forEach((product, index) => {
      console.log(`🪶 Adding product ${index + 1}:`, product.name);
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${product.name || "N/A"}</td>
        <td>${product.category?.name || "N/A"}</td>
        <td>${product.numberInStock ?? 0}</td>
        <td>${product.price ?? 0}</td>
        <td><span class="badge bg-success">Paid</span></td>
      `;
      tbody.appendChild(row);
    });

    console.log("✅ Table updated successfully!");
  } catch (error) {
    console.error("🔥 Error loading products:", error);
  }
}

document.addEventListener("DOMContentLoaded", loadProducts);


async function loadDistributorOrders() {
  console.log("✅ Loading distributor orders...");

  try {
    // 1️⃣ Get distributor's city from localStorage
    const distributorCity = localStorage.getItem("userCity");
    if (!distributorCity) {
      console.warn("No distributor city found in localStorage");
      return;
    }

    // 2️⃣ Fetch all orders
    const response = await fetch("http://localhost:3001/amazon/document/api/orders");
    if (!response.ok) throw new Error("Failed to fetch orders");

    const orders = await response.json();
    console.log("📦 Orders received:", orders);

    // 3️⃣ Filter orders by distributor's city (nested in customerSnapshot)
    const cityOrders = orders.filter(
      order => order.customerSnapshot?.city?.toLowerCase() === distributorCity.toLowerCase()
    );
    console.log(`🔍 Orders in city (${distributorCity}):`, cityOrders);

    // 4️⃣ Populate table
    const tbody = document.querySelector("#Allordertable tbody");
    tbody.innerHTML = "";

    if (cityOrders.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted">No orders in your city</td></tr>`;
      return;
    }

    cityOrders.forEach((order) => {
      const row = document.createElement("tr");

      // Join all product names in the order
           const productNames = order.items?.map(item => item.name || "Unnamed")?.join(", ") || "N/A";

      row.innerHTML = `
        <td>${order._id || "N/A"}</td>
        <td>${new Date(order.createdAt).toLocaleDateString() || "N/A"}</td>
        <td>${productNames}</td>
        <td>${order.customerSnapshot?.city || "N/A"}</td>
        <td>${order.deliveryStatus || "N/A"}</td>
      `;

      tbody.appendChild(row);
    });

    console.log("✅ Distributor orders table updated!");
  } catch (error) {
    console.error("🔥 Error loading distributor orders:", error);
  }
}

// Call this when the page loads
document.addEventListener("DOMContentLoaded", loadDistributorOrders);

async function loadTotalSales() {
  try {
    const distributorCity = localStorage.getItem("userCity");
    if (!distributorCity) return;

    const response = await fetch("http://localhost:3001/amazon/document/api/orders");
    if (!response.ok) throw new Error("Failed to fetch orders");

    const orders = await response.json();

    // Filter orders by distributor city and current year
    const currentYear = new Date().getFullYear();
    const cityOrders = orders.filter(order => 
      order.customerSnapshot?.city?.toLowerCase() === distributorCity.toLowerCase() &&
      new Date(order.createdAt).getFullYear() === currentYear
    );

    // Sum totalAmount
    const totalSales = cityOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

    // Animate the number
    const totalSalesElem = document.getElementById("totalSales");
    if (!totalSalesElem) return;

    animateNumber(totalSalesElem, totalSales);

  } catch (error) {
    console.error("🔥 Error loading total sales:", error);
  }
}

// Simple number animation
function animateNumber(element, targetValue, duration = 1500) {
  const startValue = 0;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const currentNumber = Math.floor(progress * targetValue);
    element.textContent = `₦${currentNumber.toLocaleString("en-NG")}`;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

// Call on page load
document.addEventListener("DOMContentLoaded", loadTotalSales);

async function loadDailySales() {
  try {
    const distributorCity = localStorage.getItem("userCity");
    if (!distributorCity) return;

    const response = await fetch("http://localhost:3001/amazon/document/api/orders");
    if (!response.ok) throw new Error("Failed to fetch orders");

    const orders = await response.json();

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const formatDate = date => date.toISOString().split("T")[0]; // "YYYY-MM-DD"
    const todayString = formatDate(today);
    const yesterdayString = formatDate(yesterday);

    // Filter today's orders
    const todayOrders = orders.filter(order => {
      const orderCity = order.customerSnapshot?.city?.toLowerCase();
      const orderDate = new Date(order.createdAt).toISOString().split("T")[0];
      return orderCity === distributorCity.toLowerCase() && orderDate === todayString;
    });

    // Filter yesterday's orders
    const yesterdayOrders = orders.filter(order => {
      const orderCity = order.customerSnapshot?.city?.toLowerCase();
      const orderDate = new Date(order.createdAt).toISOString().split("T")[0];
      return orderCity === distributorCity.toLowerCase() && orderDate === yesterdayString;
    });

    const todayTotal = todayOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const yesterdayTotal = yesterdayOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

    // Animate number
    const totalSalesElem = document.getElementById("totalSalesDaily");
    if (totalSalesElem) animateNumber(totalSalesElem, todayTotal);

    // Calculate percentage difference
    const percentElem = document.querySelector(".metric-card small.text-success");
    if (percentElem) {
      let percentText = "";
      let color = "black";

      if (yesterdayTotal === 0) {
        percentText = todayTotal > 0 ? "N/A" : "0%";
        color = todayTotal > 0 ? "green" : "black";
      } else {
        const percentChange = ((todayTotal - yesterdayTotal) / yesterdayTotal) * 100;
        const sign = percentChange >= 0 ? "+" : "";
        percentText = `${sign}${percentChange.toFixed(1)}%`;
        color = percentChange >= 0 ? "green" : "red";
      }

      percentElem.textContent = `${percentText} vs yesterday`;
      percentElem.style.color = color;
    }

  } catch (error) {
    console.error("🔥 Error loading daily sales:", error);
  }
}


// Reuse the animateNumber function
function animateNumber(element, targetValue, duration = 1500) {
  const startValue = 0;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const currentNumber = Math.floor(progress * targetValue);
    element.textContent = `₦${currentNumber.toLocaleString("en-NG")}`;

    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

document.addEventListener("DOMContentLoaded", loadDailySales);

