console.log("✅ Script loaded successfully");

function toggleNotification(event) {
  event.preventDefault();
  const notificationPopUp = document.getElementById("notificationPopUp");
  // notificationPopUp.style.display = "block";

  if (
    notificationPopUp.style.display === "none" ||
    notificationPopUp.style.display === ""
  ) {
    notificationPopUp.style.display = "block";
  } else {
    notificationPopUp.style.display = "none";
  }
}

function AllorderTable(event) {
  event.preventDefault();
  document.getElementById("AllorderTable").style.display = "block";
  document.getElementById("PendingorderTable").style.display = "none";
  document.getElementById("deliveredgorderTable").style.display = "none";
  document.getElementById("cancelorderTable").style.display = "none";
}

function PendingorderTable(event) {
  event.preventDefault();
  document.getElementById("PendingorderTable").style.display = "block";
  document.getElementById("AllorderTable").style.display = "none";
  document.getElementById("deliveredgorderTable").style.display = "none";
  document.getElementById("cancelorderTable").style.display = "none";
}

function deliveredgorderTable(event) {
  event.preventDefault();
  document.getElementById("deliveredgorderTable").style.display = "block";
  document.getElementById("PendingorderTable").style.display = "none";
  document.getElementById("AllorderTable").style.display = "none";
  document.getElementById("cancelorderTable").style.display = "none";
}

function cancelorderTable(event) {
  event.preventDefault();
  document.getElementById("cancelorderTable").style.display = "block";
  document.getElementById("deliveredgorderTable").style.display = "none";
  document.getElementById("PendingorderTable").style.display = "none";
  document.getElementById("AllorderTable").style.display = "none";
}

// ✅ LOGIN FUNCTION
function logIn(event) {
  event.preventDefault();

  const loginBtn = document.getElementById("loginBtn"); // 🔹 your button must have id="loginBtn"
  if (loginBtn) {
    loginBtn.disabled = true;
    loginBtn.textContent = "Logging in..."; // show progress
  }

  const getEmail = document.getElementById("email").value;
  const getPassword = document.getElementById("password").value;

  if (getEmail === "" || getPassword === "") {
    Swal.fire({
      icon: "info",
      title: "All fields are required",
      confirmButtonColor: "#F58634",
    }).then(() => {
      if (loginBtn) {
        loginBtn.disabled = false;
        loginBtn.textContent = "Login";
      }
    });
    return;
  }

  const signData = { email: getEmail, password: getPassword };

  fetch("http://localhost:3001/amazon/document/api/login/distributor", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(signData),
  })
    .then(async (response) => {
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
        localStorage.removeItem("userName", result.name);


          Swal.fire({
            icon: "warning",
            title: "Access Denied",
            text: result.message || "Not a distributor account.",
            confirmButtonColor: "#FFA500",
            timer: 2000,
            timerProgressBar: true,
          }).then(() => {
            location.href = "signin.html";
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Login Failed",
            text: result.message || text || "Invalid email or password.",
            confirmButtonColor: "#2D85DE",
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
        localStorage.setItem("userName", result.name);



        Swal.fire({
          icon: "success",
          title: "Login successful",
          confirmButtonColor: "#28a745",
        }).then(() => {
          location.href = "index.html";
        });
      }
    })
    .catch((error) => {
      console.error("Login error:", error);
      Swal.fire({
        icon: "error",
        text: "Something went wrong, please try again",
        confirmButtonColor: "#2D85DE",
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
    title: "Are you sure?",
    text: "You will be logged out of your account.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, log me out",
    cancelButtonText: "Cancel",
  }).then((result) => {
    if (result.isConfirmed) {
      // 🚨 Clear stored login data
      localStorage.removeItem("authToken");
      localStorage.removeItem("role");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userCity");
      localStorage.removeItem("userName");

      Swal.fire({
        icon: "success",
        title: "Logged out",
        text: "You have been successfully logged out.",
        confirmButtonColor: "#28a745",
      }).then(() => {
        location.href = "signin.html"; // redirect to login page
      });
    }
  });
}

async function loadProducts() {
  console.log("✅ Script is running...");

  try {
    const response = await fetch(
      "http://localhost:3001/amazon/document/api/products"
    );
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

const ordersPerPage = 10;
let currentPage = 1;
let cityOrders = [];

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
    const response = await fetch(
      "http://localhost:3001/amazon/document/api/orders"
    );
    if (!response.ok) throw new Error("Failed to fetch orders");

    const orders = await response.json();
    console.log("📦 Orders received:", orders);

    // 3️⃣ Filter orders by distributor's city (nested in customerSnapshot)
    cityOrders = orders.filter(
      (order) =>
        order.customerSnapshot?.city?.toLowerCase() ===
        distributorCity.toLowerCase()
    );
    console.log(`🔍 Orders in city (${distributorCity}):`, cityOrders);

    renderOrdersTable();
    renderPagination();
  } catch (error) {
    console.error("🔥 Error loading distributor orders:", error);
  }
}

function renderOrdersTable() {
  const tbody = document.querySelector("#Allordertable tbody");
  tbody.innerHTML = "";

  if (cityOrders.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted">No orders in your city</td></tr>`;
    return;
  }

  const start = (currentPage - 1) * ordersPerPage;
  const end = start + ordersPerPage;
  const pageOrders = cityOrders.slice(start, end);

  pageOrders.forEach((order) => {
    const productNames =
      order.items?.map((item) => item.name || "Unnamed")?.join(", ") || "N/A";

    const row = document.createElement("tr");
    row.innerHTML = `
      <td><i class="fa-solid fa-bars me-2" style="color:#1968f0;"></i>${order._id || "N/A"}</td>
      <td><i class="fa-regular fa-calendar me-2" style="color:#eca918;"></i>${new Date(order.createdAt).toLocaleDateString() || "N/A"}</td>
      <td><i class="fa-solid fa-warehouse me-2" style="color:#eead20;"></i>${productNames}</td>
      <td><i class="fa-solid fa-location-dot me-2" style="color:#9bacca;"></i>${order.customerSnapshot?.city || "N/A"}</td>
      <td><i class="fa-solid fa-signal me-2" style="color:#74C0FC;"></i>${order.deliveryStatus || "Pending"}</td>
    `;

    // 🟢 Add click event to show modal
    row.addEventListener("click", () => showOrderModal(order));
    tbody.appendChild(row);
  });

  // Update “Showing X to Y of Z”
  const total = cityOrders.length;
  const showingStart = start + 1;
  const showingEnd = Math.min(end, total);
  document.querySelector(
    ".PaginaTION"
  ).textContent = `Showing ${showingStart} to ${showingEnd} of ${total} items`;
}

function renderPagination() {
  const totalPages = Math.ceil(cityOrders.length / ordersPerPage);
  const pagination = document.querySelector(".pagination");
  pagination.innerHTML = "";

  // Previous button
  pagination.insertAdjacentHTML(
    "beforeend",
    `<li class="page-item ${currentPage === 1 ? "disabled" : ""}">
        <a class="page-link" href="#" aria-label="Previous" onclick="changeOrderPage(${
          currentPage - 1
        })">&laquo;</a>
     </li>`
  );

  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    pagination.insertAdjacentHTML(
      "beforeend",
      `<li class="page-item ${i === currentPage ? "active" : ""}">
        <a class="page-link" href="#" onclick="changeOrderPage(${i})">${i}</a>
      </li>`
    );
  }

  // Next button
  pagination.insertAdjacentHTML(
    "beforeend",
    `<li class="page-item ${currentPage === totalPages ? "disabled" : ""}">
        <a class="page-link" href="#" aria-label="Next" onclick="changeOrderPage(${
          currentPage + 1
        })">&raquo;</a>
     </li>`
  );
}

function changeOrderPage(page) {
  const totalPages = Math.ceil(cityOrders.length / ordersPerPage);
  if (page < 1 || page > totalPages) return;
  currentPage = page;
  renderOrdersTable();
  renderPagination();
}

// Load when ready
document.addEventListener("DOMContentLoaded", loadDistributorOrders);
function showOrderModal(order) {
  const modalContent = document.getElementById("orderDetailsContent");
  const customer = order.customerSnapshot || {};

  // Build product cards
  const itemsHTML = order.items
    .map(
      (item) => `
        <div class="col-md-6 mb-4">
          <div class="card product-card">
            <img src="${item.image || 'https://via.placeholder.com/400x300?text=No+Image'}" 
                 class="card-img-top" 
                 alt="${item.name}">
            <div class="card-body">
              <h6 class="fw-bold mb-1">${item.name}</h6>
              <p class="text-muted small mb-1">Quantity – ${item.quantity || 1}</p>
              <h6 class="text-success fw-semibold">
                ₦${item.price?.toLocaleString() || 0}
              </h6>
            </div>
          </div>
        </div>
      `
    )
    .join("");

  // Build modal body
  modalContent.innerHTML = `
    <div class="order-header d-flex justify-content-between align-items-center">
      <div><strong>#${order._id}</strong></div>
      <div>
        <span class="badge ${
          order.deliveryStatus === "Delivered"
            ? "bg-success"
            : "bg-warning text-dark"
        }">
          ${order.deliveryStatus || "Pending"}
        </span>
      </div>
    </div>

    <div class="row g-4">
      <!-- Left: Product Section -->
      <div class="col-lg-8">
        <div class="row">${itemsHTML}</div>
      </div>

      <!-- Right: Customer Info -->
      <div class="col-lg-4">
        <div class="card customer-card p-3">
          <h6 class="fw-bold mb-3">Customer Information</h6>
          <div class="text-center customer-info">
            <img src="${
              customer.profileImage ||
              "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-social-media-user-vector-image-182145777.jpg"
            }" alt="Customer photo">
            <h6>${customer.firstName || "Unknown Customer"}</h6>
            <p>${customer.email || "No email provided"}</p>
            <p>${customer.phone || "No phone number"}</p>
          </div>
          <hr>
          <div>
            <p><strong>Shipping Address</strong><br>${customer.address || "N/A"}</p>
            <p><strong>Billing Address</strong><br>${customer.address || "N/A"}</p>
          </div>
          <hr>
          <button 
            class="btn ${
              order.deliveryStatus === "Delivered"
                ? "btn-secondary"
                : "btn-success"
            } w-100 mt-2" 
            id="markDeliveredBtn"
            ${order.deliveryStatus === "Delivered" ? "disabled" : ""}
          >
            ${
              order.deliveryStatus === "Delivered"
                ? '<i class="fa-solid fa-check me-2"></i>Delivered'
                : '<i class="fa-solid fa-check me-2"></i>Mark as Delivered'
            }
          </button>
        </div>
      </div>
    </div>
  `;

  const modal = new bootstrap.Modal(document.getElementById("orderModal"));
  modal.show();

  // 🟢 Add event listener only if order isn't delivered
  const deliveredBtn = document.getElementById("markDeliveredBtn");
  if (deliveredBtn && order.deliveryStatus !== "Delivered") {
    deliveredBtn.addEventListener("click", async () => {
      try {
        const res = await fetch(
          `http://localhost:3001/amazon/document/api/orders/${order._id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ deliveryStatus: "Delivered" }),
          }
        );

        if (!res.ok) throw new Error("Failed to update status");

        // ✅ Update locally
        order.deliveryStatus = "Delivered";
        deliveredBtn.disabled = true;
        deliveredBtn.classList.remove("btn-success");
        deliveredBtn.classList.add("btn-secondary");
        deliveredBtn.innerHTML =
          '<i class="fa-solid fa-check me-2"></i>Delivered';

        // ✅ Refresh table
        renderOrdersTable();

        Swal.fire({
          icon: "success",
          title: "Order delivered!",
          text: `Order #${order._id} has been marked as delivered.`,
          confirmButtonColor: "#198754",
        });
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to update order status.",
        });
      }
    });
  }
}




async function loadYearlySales() {
  try {
    const distributorCity = localStorage.getItem("userCity");
    if (!distributorCity) return;

    const response = await fetch("http://localhost:3001/amazon/document/api/orders");
    if (!response.ok) throw new Error("Failed to fetch orders");

    const orders = await response.json();

    // 🔹 Get current and previous year
    const now = new Date();
    const currentYear = now.getFullYear();
    const previousYear = currentYear - 1;

    // 🔹 Filter orders for current and previous year (by city)
    const currentYearOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return (
        order.customerSnapshot?.city?.toLowerCase() === distributorCity.toLowerCase() &&
        orderDate.getFullYear() === currentYear
      );
    });

    const previousYearOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return (
        order.customerSnapshot?.city?.toLowerCase() === distributorCity.toLowerCase() &&
        orderDate.getFullYear() === previousYear
      );
    });

    // 🔹 Calculate totals
    const yearlySales = currentYearOrders.reduce(
      (sum, order) => sum + Number(order.totalAmount || 0),
      0
    );
    const lastYearSales = previousYearOrders.reduce(
      (sum, order) => sum + Number(order.totalAmount || 0),
      0
    );

    // 🔹 Calculate % change
    const changePercent =
      lastYearSales === 0 ? 0 : ((yearlySales - lastYearSales) / lastYearSales) * 100;

    // 🔹 Update UI
    const yearlySalesElem = document.getElementById("yearlySales");
    const yearlyChangeElem = document.getElementById("yearlyChange");
    const yearlyTitleElem = document.getElementById("yearlySalesTitle");

    if (yearlyTitleElem) {
      yearlyTitleElem.textContent = `Total Sales (${currentYear})`;
    }

    if (yearlySalesElem) animateNumber(yearlySalesElem, yearlySales);
    if (yearlyChangeElem) {
      const sign = changePercent >= 0 ? "+" : "";
      yearlyChangeElem.textContent = `${sign}${changePercent.toFixed(1)}% vs ${previousYear}`;
      yearlyChangeElem.classList.toggle("text-success", changePercent >= 0);
      yearlyChangeElem.classList.toggle("text-danger", changePercent < 0);
    }
  } catch (error) {
    console.error("🔥 Error loading yearly sales:", error);
  }
}

// 🔹 Animation function (same as before)
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

document.addEventListener("DOMContentLoaded", () => {
  loadYearlySales();
});


async function loadDailySales() {
  try {
    const distributorCity = localStorage.getItem("userCity");
    if (!distributorCity) return;

    const response = await fetch(
      "http://localhost:3001/amazon/document/api/orders"
    );
    if (!response.ok) throw new Error("Failed to fetch orders");

    const orders = await response.json();

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const formatDate = (date) => date.toISOString().split("T")[0]; // "YYYY-MM-DD"
    const todayString = formatDate(today);
    const yesterdayString = formatDate(yesterday);

    // Filter today's orders
    const todayOrders = orders.filter((order) => {
      const orderCity = order.customerSnapshot?.city?.toLowerCase();
      const orderDate = new Date(order.createdAt).toISOString().split("T")[0];
      return (
        orderCity === distributorCity.toLowerCase() && orderDate === todayString
      );
    });

    // Filter yesterday's orders
    const yesterdayOrders = orders.filter((order) => {
      const orderCity = order.customerSnapshot?.city?.toLowerCase();
      const orderDate = new Date(order.createdAt).toISOString().split("T")[0];
      return (
        orderCity === distributorCity.toLowerCase() &&
        orderDate === yesterdayString
      );
    });

    const todayTotal = todayOrders.reduce(
      (sum, order) => sum + (order.totalAmount || 0),
      0
    );
    const yesterdayTotal = yesterdayOrders.reduce(
      (sum, order) => sum + (order.totalAmount || 0),
      0
    );

    // Animate number
    const totalSalesElem = document.getElementById("totalSalesDaily");
    if (totalSalesElem) animateNumber(totalSalesElem, todayTotal);

    // Calculate percentage difference
    const percentElem = document.querySelector(
      ".metric-card small.text-success"
    );
    if (percentElem) {
      let percentText = "";
      let color = "black";

      if (yesterdayTotal === 0) {
        percentText = todayTotal > 0 ? "N/A" : "0%";
        color = todayTotal > 0 ? "green" : "black";
      } else {
        const percentChange =
          ((todayTotal - yesterdayTotal) / yesterdayTotal) * 100;
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

async function loadWeeklySales() {
  try {
    const distributorCity = localStorage.getItem("userCity");
    if (!distributorCity) return;

    const response = await fetch("http://localhost:3001/amazon/document/api/orders");
    if (!response.ok) throw new Error("Failed to fetch orders");

    const orders = await response.json();

    // 🔹 Get current date and last 7 days range
    const now = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);

    // Format helper (e.g. "Oct 6")
    const formatDate = (date) =>
      date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

    const rangeLabel = `${formatDate(sevenDaysAgo)} – ${formatDate(now)}`;

    // 🔹 Filter by city and last 7 days
    const weeklyOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return (
        order.customerSnapshot?.city?.toLowerCase() === distributorCity.toLowerCase() &&
        orderDate >= sevenDaysAgo &&
        orderDate <= now
      );
    });

    // 🔹 Calculate total weekly sales
    const weeklySales = weeklyOrders.reduce(
      (sum, order) => sum + Number(order.totalAmount || 0),
      0
    );

    // 🔹 Compare with previous week
    const prevWeekStart = new Date(sevenDaysAgo);
    const prevWeekEnd = new Date(sevenDaysAgo);
    prevWeekStart.setDate(sevenDaysAgo.getDate() - 7);

    const prevWeekOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return (
        order.customerSnapshot?.city?.toLowerCase() === distributorCity.toLowerCase() &&
        orderDate >= prevWeekStart &&
        orderDate < sevenDaysAgo
      );
    });

    const prevWeekSales = prevWeekOrders.reduce(
      (sum, order) => sum + Number(order.totalAmount || 0),
      0
    );

    const changePercent =
      prevWeekSales === 0 ? 0 : ((weeklySales - prevWeekSales) / prevWeekSales) * 100;

    // 🔹 Update UI
    const weeklySalesElem = document.getElementById("weeklySales");
    const weeklyChangeElem = document.getElementById("weeklyChange");
    const weeklyTitleElem = document.getElementById("weeklySalesTitle");

    if (weeklyTitleElem) {
      weeklyTitleElem.textContent = `Total Sales (${rangeLabel})`;
    }

    if (weeklySalesElem) animateNumber(weeklySalesElem, weeklySales);
    if (weeklyChangeElem) {
      const sign = changePercent >= 0 ? "+" : "";
      weeklyChangeElem.textContent = `${sign}${changePercent.toFixed(1)}% vs last week`;
      weeklyChangeElem.classList.toggle("text-success", changePercent >= 0);
      weeklyChangeElem.classList.toggle("text-danger", changePercent < 0);
    }
  } catch (error) {
    console.error("🔥 Error loading weekly sales:", error);
  }
}

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

document.addEventListener("DOMContentLoaded", () => {
  loadWeeklySales();
});



async function loadMonthlySales() {
  try {
    const distributorCity = localStorage.getItem("userCity");
    if (!distributorCity) return;

    const response = await fetch("http://localhost:3001/amazon/document/api/orders");
    if (!response.ok) throw new Error("Failed to fetch orders");

    const orders = await response.json();

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    // 🔹 Month names for display
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const currentMonthName = monthNames[currentMonth];

    // 🔹 Filter for current month
    const monthlyOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return (
        order.customerSnapshot?.city?.toLowerCase() === distributorCity.toLowerCase() &&
        orderDate.getMonth() === currentMonth &&
        orderDate.getFullYear() === currentYear
      );
    });

    // 🔹 Calculate total monthly sales
    const monthlySales = monthlyOrders.reduce(
      (sum, order) => sum + Number(order.totalAmount || 0),
      0
    );

    // 🔹 Filter for previous month
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const prevMonthOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return (
        order.customerSnapshot?.city?.toLowerCase() === distributorCity.toLowerCase() &&
        orderDate.getMonth() === prevMonth &&
        orderDate.getFullYear() === prevYear
      );
    });

    const prevMonthSales = prevMonthOrders.reduce(
      (sum, order) => sum + Number(order.totalAmount || 0),
      0
    );

    // 🔹 Calculate percentage change
    const changePercent =
      prevMonthSales === 0 ? 0 : ((monthlySales - prevMonthSales) / prevMonthSales) * 100;

    // 🔹 Display and animate
    const monthlySalesElem = document.getElementById("monthlySales");
    const monthlyChangeElem = document.getElementById("monthlySalesChange");
    const monthlyTitleElem = document.getElementById("monthlySalesTitle");

    if (monthlyTitleElem) {
      monthlyTitleElem.textContent = `Total Sales (${currentMonthName})`;
    }

    if (monthlySalesElem) animateNumber(monthlySalesElem, monthlySales);
    if (monthlyChangeElem) {
      const sign = changePercent >= 0 ? "+" : "";
      monthlyChangeElem.textContent = `${sign}${changePercent.toFixed(1)}% vs last month`;
      monthlyChangeElem.classList.toggle("text-success", changePercent >= 0);
      monthlyChangeElem.classList.toggle("text-danger", changePercent < 0);
    }
  } catch (error) {
    console.error("🔥 Error loading monthly sales:", error);
  }
}

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

document.addEventListener("DOMContentLoaded", () => {
  loadMonthlySales();
});





// async function loadDistributorUsers() {
//   try {
//     const distributorCity = localStorage.getItem("userCity");
//     if (!distributorCity) return console.warn("Distributor city not found");

//     const res = await fetch("http://localhost:3001/amazon/document/api/orders");
//     if (!res.ok) throw new Error("Failed to fetch orders");
//     const orders = await res.json();

//     const filteredOrders = orders.filter(order =>
//       order.customerSnapshot?.city?.toLowerCase() === distributorCity.toLowerCase()
//     );

//     const tbody = document.getElementById("usersTableBody");
//     tbody.innerHTML = "";

//     if (filteredOrders.length === 0) {
//       tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted">No users found for ${distributorCity}</td></tr>`;
//       return;
//     }

//     // Collect unique users
//     const uniqueUsers = {};
//     filteredOrders.forEach(order => {
//       const c = order.customerSnapshot;
//       if (c?.email && !uniqueUsers[c.email]) {
//         const fullName = `${c.firstName || ""} ${c.lastName || ""}`.trim();
//         uniqueUsers[c.email] = {
//           fullName,
//           email: c.email,
//           city: c.city,
//           phone: c.phone,
//           image: "./images/New Customers List (3).png"
//         };
//       }
//     });

//     // Fetch lastSeen from backend
//     const userEmails = Object.keys(uniqueUsers);
//     const statusRes = await fetch("http://localhost:3001/amazon/document/api/register/get-last-seen", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ emails: userEmails })
//     });
//     const statusData = await statusRes.json();

//     Object.values(uniqueUsers).forEach(user => {
//       const lastSeen = statusData[user.email] || 0;
//       const isOnline = Date.now() - lastSeen < 1000 * 60 * 5; // within 5 mins
//       const statusColor = isOnline ? "#00A859" : "#9bacca";
//       const statusText = isOnline ? "Active" : "Offline";
//       const pulseClass = isOnline ? "pulse" : "";

//       const row = `
//         <tr id="row-${user.email.replace(/[@.]/g, '-')}" data-email="${user.email}">
//           <td>
//             <div class="d-flex align-items-center">
//               <img src="${user.image}" style="width: 25px;" alt="">
//               <div class="ms-2 custOmerPtag">
//                 <small style="color: #171725;">${user.fullName}</small><br>
//                 <small style="color: #8D98AF; font-size: 10px;">@${user.fullName.split(" ")[0].toLowerCase()}</small>
//               </div>
//             </div>
//           </td>
//           <td class="status-cell" data-email="${user.email}">
//             <div class="status-wrapper">
//               <i class="fa-solid fa-circle me-2 status-icon ${pulseClass}" style="color: ${statusColor};"></i>
//               <span class="status-text">${statusText}</span>
//             </div>
//           </td>
//           <td>${user.email}</td>
//           <td><i class="fa-solid fa-location-dot me-2" style="color: #9bacca;"></i>${user.city}</td>
//           <td>${user.phone}</td>
//           <td><i class="fa-solid fa-ellipsis" style="color: #cbd3e1;"></i></td>
//         </tr>
//       `;
//       tbody.insertAdjacentHTML("beforeend", row);
//     });
//   } catch (err) {
//     console.error("Error loading distributor users:", err);
//   }
// }

// // ✅ Add click listeners for each row

// // 🔁 Update only statuses smoothly
// async function refreshUserStatuses() {
//   const rows = document.querySelectorAll(".status-cell");
//   if (rows.length === 0) return;

//   const emails = Array.from(rows).map(cell => cell.dataset.email);
//   const res = await fetch("http://localhost:3001/amazon/document/api/register/get-last-seen", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ emails })
//   });
//   const data = await res.json();

//   rows.forEach(cell => {
//     const email = cell.dataset.email;
//     const lastSeen = data[email] || 0;
//     const isOnline = Date.now() - lastSeen < 1000 * 60 * 5;
//     const newColor = isOnline ? "#00A859" : "#9bacca";
//     const newText = isOnline ? "Active" : "Offline";
//     const icon = cell.querySelector(".status-icon");
//     const text = cell.querySelector(".status-text");

//     // Fade transition
//     if (text.textContent !== newText) {
//       cell.style.transition = "opacity 0.3s ease";
//       cell.style.opacity = "0.3";
//       setTimeout(() => {
//         icon.style.color = newColor;
//         text.textContent = newText;
//         icon.classList.toggle("pulse", isOnline);
//         cell.style.opacity = "1";
//       }, 300);
//     }
//   });
// }

// document.addEventListener("DOMContentLoaded", () => {
//   loadDistributorUsers();
//   setInterval(refreshUserStatuses, 20000);
// });

let globalUsers = {}; // store users globally for filtering

// ✅ Main function (existing, slightly enhanced)
async function loadDistributorUsers(filter = "all") {
  try {
    const distributorCity = localStorage.getItem("userCity");
    if (!distributorCity) return console.warn("Distributor city not found");

    const res = await fetch("http://localhost:3001/amazon/document/api/orders");
    if (!res.ok) throw new Error("Failed to fetch orders");
    const orders = await res.json();

    const filteredOrders = orders.filter(
      (order) =>
        order.customerSnapshot?.city?.toLowerCase() ===
        distributorCity.toLowerCase()
    );

    const tbody = document.getElementById("usersTableBody");
    tbody.innerHTML = "";

    if (filteredOrders.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted">No users found for ${distributorCity}</td></tr>`;
      return;
    }

    // Collect unique users
    const uniqueUsers = {};
    filteredOrders.forEach((order) => {
      const c = order.customerSnapshot;
      if (c?.email && !uniqueUsers[c.email]) {
        const fullName = `${c.firstName || ""} ${c.lastName || ""}`.trim();
        uniqueUsers[c.email] = {
          fullName,
          email: c.email,
          city: c.city,
          phone: c.phone,
          image: "./images/New Customers List (3).png",
        };
      }
    });

    // Fetch lastSeen from backend
    const userEmails = Object.keys(uniqueUsers);
    const statusRes = await fetch(
      "http://localhost:3001/amazon/document/api/register/get-last-seen",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emails: userEmails }),
      }
    );
    const statusData = await statusRes.json();

    // Add status data and store globally
    Object.values(uniqueUsers).forEach((user) => {
      const lastSeen = statusData[user.email] || 0;
      const isOnline = Date.now() - lastSeen < 1000 * 60 * 5;
      user.status = isOnline ? "active" : "offline";
    });

    globalUsers = uniqueUsers;

    // Render users (filtered)
    renderUsers(filter);
  } catch (err) {
    console.error("Error loading distributor users:", err);
  }
}

// ✅ Function to render users based on filter
function renderUsers(filter = "all") {
  const tbody = document.getElementById("usersTableBody");
  tbody.innerHTML = "";

  const users = Object.values(globalUsers).filter((user) => {
    if (filter === "all") return true;
    return user.status === filter;
  });

  if (!users.length) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted">No ${filter} users found</td></tr>`;
    return;
  }

  users.forEach((user) => {
    const statusColor = user.status === "active" ? "#00A859" : "#9bacca";
    const statusText = user.status === "active" ? "Active" : "Offline";
    const pulseClass = user.status === "active" ? "pulse" : "";

    const row = `
      <tr id="row-${user.email.replace(/[@.]/g, "-")}" data-email="${
      user.email
    }">
        <td>
          <div class="d-flex align-items-center">
            <img src="${user.image}" style="width: 25px;" alt="">
            <div class="ms-2 custOmerPtag">
              <small style="color: #171725;">${user.fullName}</small><br>
              <small style="color: #8D98AF; font-size: 10px;">${
                user.role || "Customer"
              }</small>
            </div>
          </div>
        </td>
        <td class="status-cell" data-email="${user.email}">
          <div class="status-wrapper">
            <i class="fa-solid fa-circle me-2 status-icon ${pulseClass}" style="color: ${statusColor};"></i>
            <span class="status-text">${statusText}</span>
          </div>
        </td>
        <td>${user.email}</td>
        <td><i class="fa-solid fa-location-dot me-2" style="color: #9bacca;"></i>${
          user.city
        }</td>
        <td>${user.phone}</td>
        <td><i class="fa-solid fa-ellipsis" style="color: #cbd3e1;"></i></td>
      </tr>
    `;
    tbody.insertAdjacentHTML("beforeend", row);
  });
}

// ✅ Refresh statuses (your existing function)
async function refreshUserStatuses() {
  const rows = document.querySelectorAll(".status-cell");
  if (rows.length === 0) return;

  const emails = Array.from(rows).map((cell) => cell.dataset.email);
  const res = await fetch(
    "http://localhost:3001/amazon/document/api/register/get-last-seen",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emails }),
    }
  );
  const data = await res.json();

  rows.forEach((cell) => {
    const email = cell.dataset.email;
    const lastSeen = data[email] || 0;
    const isOnline = Date.now() - lastSeen < 1000 * 60 * 5;
    const newColor = isOnline ? "#00A859" : "#9bacca";
    const newText = isOnline ? "Active" : "Offline";
    const icon = cell.querySelector(".status-icon");
    const text = cell.querySelector(".status-text");

    // Update global data
    if (globalUsers[email])
      globalUsers[email].status = isOnline ? "active" : "offline";

    if (text.textContent !== newText) {
      cell.style.transition = "opacity 0.3s ease";
      cell.style.opacity = "0.3";
      setTimeout(() => {
        icon.style.color = newColor;
        text.textContent = newText;
        icon.classList.toggle("pulse", isOnline);
        cell.style.opacity = "1";
      }, 300);
    }
  });
}

// ✅ Event listeners for filter buttons
document.addEventListener("DOMContentLoaded", () => {
  loadDistributorUsers();

  document.querySelectorAll(".user-filter").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const filter = btn.dataset.filter;

      // Highlight active tab
      document
        .querySelectorAll(".user-filter")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      renderUsers(filter);
    });
  });

  // Refresh online/offline statuses every 20 seconds
  setInterval(() => {
    refreshUserStatuses();
  }, 20000);
});

// let currentCustomerOrders = [];

// // When a customer row is clicked
// document.addEventListener("click", async (e) => {
//   const row = e.target.closest("tr[data-email]");
//   if (!row) return;

//   const email = row.dataset.email;
//   const fullName = row.querySelector(".custOmerPtag small")?.textContent || "Customer";

//   const modal = new bootstrap.Modal(document.getElementById("customerOrdersModal"));
//   modal.show();

//   // Show loading spinner
//   const tbody = document.getElementById("customerOrdersTableBody");
//   tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-3">
//     <div class="spinner-border text-primary" role="status"></div>
//     <p class="mt-2">Loading orders for ${fullName}...</p>
//   </td></tr>`;

//   // Show customer info in modal header
//   document.getElementById("customerInfo").innerHTML = `
//     <div class="d-flex align-items-center">
//       <img src="./images/New Customers List (3).png" class="rounded-circle me-3" width="45" height="45" alt="">
//       <div>
//         <p class="fw-bold mb-0">${fullName}</p>
//         <small class="text-muted">${email}</small>
//       </div>
//     </div>
//   `;

//   try {
//     const res = await fetch("http://localhost:3001/amazon/document/api/orders");
//     if (!res.ok) throw new Error("Failed to fetch orders");
//     const orders = await res.json();

//     // Filter by customer's email
//     currentCustomerOrders = orders.filter(
//       o => o.customerSnapshot?.email?.toLowerCase() === email.toLowerCase()
//     );

//     renderCustomerOrders("all");
//   } catch (err) {
//     console.error("Error loading customer orders:", err);
//     tbody.innerHTML = `<tr><td colspan="6" class="text-center text-danger">Error loading orders</td></tr>`;
//   }
// });

// // Render filtered orders
// function renderCustomerOrders(filter = "all") {
//   const tbody = document.getElementById("customerOrdersTableBody");
//   tbody.innerHTML = "";

//   let filteredOrders = currentCustomerOrders;
//   if (filter !== "all") {
//     filteredOrders = filteredOrders.filter(
//       o => o.paymentStatus?.toLowerCase() === filter
//     );
//   }

//   if (!filteredOrders.length) {
//     tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-3">No ${filter} orders found</td></tr>`;
//     return;
//   }

//   filteredOrders.forEach(order => {
//     const status = order.paymentStatus?.toLowerCase() || "pending";
//     const statusIcon =
//       status === "paid"
//         ? `<i class="fa-solid fa-circle-check text-success"></i> Paid`
//         : status === "failed"
//         ? `<i class="fa-solid fa-circle-xmark text-danger"></i> Failed`
//         : `<i class="fa-solid fa-circle-notch text-warning"></i> Pending`;

//     const date = order.createdAt
//       ? new Date(order.createdAt).toLocaleDateString("en-GB")
//       : "N/A";

//     const productNames = order.items?.map(i => i.name).join(", ") || "—";
//     const location = order.customerSnapshot?.city || "—";

//     tbody.insertAdjacentHTML(
//       "beforeend",
//       `
//       <tr>
//         <td>#${order._id.slice(-6)}</td>
//         <td>${date}</td>
//         <td>${productNames}</td>
//         <td>${location}</td>
//         <td>${order.paymentGateway || "N/A"}</td>
//         <td>${statusIcon}</td>
//       </tr>
//       `
//     );
//   });
// }

// // Handle tab clicks
// document.querySelectorAll(".order-tab").forEach(tab => {
//   tab.addEventListener("click", e => {
//     e.preventDefault();
//     document.querySelectorAll(".order-tab").forEach(t => t.classList.remove("active"));
//     tab.classList.add("active");
//     renderCustomerOrders(tab.dataset.status);
//   });
// });

let currentCustomerOrders = [];
let currentPages = 1;
const pageSize = 10;
let currentFilter = "all";

// Handle click on customer rows
document.addEventListener("click", async (e) => {
  const row = e.target.closest("tr[data-email]");
  if (!row) return;

  const email = row.dataset.email;
  const fullName =
    row.querySelector(".custOmerPtag small")?.textContent || "Customer";

  const modal = new bootstrap.Modal(
    document.getElementById("customerOrdersModal")
  );
  modal.show();

  document.getElementById("customerOrdersTableBody").innerHTML = `
    <tr><td colspan="6" class="text-center text-muted py-3">
      <div class="spinner-border text-primary" role="status"></div>
      <p class="mt-2">Loading orders for ${fullName}...</p>
    </td></tr>
  `;

  document.getElementById("customerInfo").innerHTML = `
    <div class="d-flex align-items-center">
      <img src="./images/New Customers List (3).png" class="rounded-circle me-3" width="45" height="45" alt="">
      <div>
        <p class="fw-bold mb-0">${fullName}</p>
        <small class="text-muted">${email}</small>
      </div>
    </div>
  `;

  try {
    const res = await fetch("http://localhost:3001/amazon/document/api/orders");
    if (!res.ok) throw new Error("Failed to fetch orders");
    const orders = await res.json();

    currentCustomerOrders = orders.filter(
      (o) => o.customerSnapshot?.email?.toLowerCase() === email.toLowerCase()
    );

    currentPages = 1;
    renderCustomerOrders("all");
  } catch (err) {
    console.error("Error loading orders:", err);
    document.getElementById(
      "customerOrdersTableBody"
    ).innerHTML = `<tr><td colspan="6" class="text-center text-danger">Error loading orders</td></tr>`;
  }
});

// Render orders with pagination
function renderCustomerOrders(filter = currentFilter) {
  currentFilter = filter;
  const tbody = document.getElementById("customerOrdersTableBody");
  tbody.innerHTML = "";

  // Apply filter
  let filtered = currentCustomerOrders;
  if (filter !== "all") {
    filtered = filtered.filter(
      (o) => o.paymentStatus?.toLowerCase() === filter
    );
  }

  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  if (totalPages === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-3">No ${filter} orders found</td></tr>`;
    document.getElementById("paginationInfo").textContent =
      "Showing 0 of 0 items";
    document.getElementById("paginationControls").innerHTML = "";
    return;
  }

  // Slice data for current page
  const start = (currentPages - 1) * pageSize;
  const paginated = filtered.slice(start, start + pageSize);

  // Fill table
  paginated.forEach((order) => {
    const date = new Date(order.createdAt).toLocaleDateString("en-GB");
    const products = order.items?.map((i) => i.name).join(", ") || "—";
    const city = order.customerSnapshot?.city || "—";
    const gateway = order.totalAmount || "N/A";

    const status = order.paymentStatus?.toLowerCase();
    const statusHTML =
      status === "paid"
        ? `<i class="fa-solid fa-circle-check text-success"></i> Paid`
        : status === "failed"
        ? `<i class="fa-solid fa-circle-xmark text-danger"></i> Failed`
        : `<i class="fa-solid fa-circle-notch text-warning"></i> Pending`;

    tbody.insertAdjacentHTML(
      "beforeend",
      `
      <tr>
        <td>#${order._id.slice(-6)}</td>
        <td>${date}</td>
        <td>${products}</td>
        <td>${city}</td>
        <td>${gateway}</td>
        <td>${statusHTML}</td>
      </tr>
      `
    );
  });

  // Pagination info
  const showingFrom = start + 1;
  const showingTo = Math.min(start + pageSize, totalItems);
  document.getElementById(
    "paginationInfo"
  ).textContent = `Showing ${showingFrom} to ${showingTo} of ${totalItems} items`;

  renderPaginationControls(totalPages);
}

// Build pagination controls
function renderPaginationControls(totalPages) {
  const pagination = document.getElementById("paginationControls");
  pagination.innerHTML = "";

  const prevDisabled = currentPages === 1 ? "disabled" : "";
  const nextDisabled = currentPages === totalPages ? "disabled" : "";

  pagination.insertAdjacentHTML(
    "beforeend",
    `<li class="page-item ${prevDisabled}">
       <a class="page-link" href="#" id="prevPage">&laquo;</a>
     </li>`
  );

  for (let i = 1; i <= totalPages; i++) {
    const active = currentPages === i ? "active" : "";
    pagination.insertAdjacentHTML(
      "beforeend",
      `<li class="page-item ${active}"><a class="page-link page-num" href="#">${i}</a></li>`
    );
  }

  pagination.insertAdjacentHTML(
    "beforeend",
    `<li class="page-item ${nextDisabled}">
       <a class="page-link" href="#" id="nextPage">&raquo;</a>
     </li>`
  );

  // Handlers
  pagination.querySelectorAll(".page-num").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      currentPages = parseInt(link.textContent);
      renderCustomerOrders(currentFilter);
    });
  });

  const prev = pagination.querySelector("#prevPage");
  const next = pagination.querySelector("#nextPage");
  if (prev)
    prev.addEventListener("click", (e) => {
      e.preventDefault();
      if (currentPages > 1) {
        currentPages--;
        renderCustomerOrders(currentFilter);
      }
    });
  if (next)
    next.addEventListener("click", (e) => {
      e.preventDefault();
      if (currentPages < totalPages) {
        currentPages++;
        renderCustomerOrders(currentFilter);
      }
    });
}

// Tab clicks
document.querySelectorAll(".order-tab").forEach((tab) => {
  tab.addEventListener("click", (e) => {
    e.preventDefault();
    document
      .querySelectorAll(".order-tab")
      .forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    currentPages = 1;
    renderCustomerOrders(tab.dataset.status);
  });
});


async function loadCustomerCards() {
  try {
    const res = await fetch("http://localhost:3001/amazon/document/api/orders");
    if (!res.ok) throw new Error("Failed to fetch orders");
    const orders = await res.json();
    // Extract unique customers
    const uniqueCustomers = {};
    orders.forEach(order => {
      const c = order.customerSnapshot;
      if (c && c.email && !uniqueCustomers[c.email]) {
        uniqueCustomers[c.email] = { ...c, id: order._id };
      }
    });
    // Take the last 4 (latest)
    const customers = Object.values(uniqueCustomers).slice(-4).reverse();
    const listContainer = document.getElementById("customerList");
    listContainer.innerHTML = "";
    customers.forEach(c => {
      const fullName = `${c.firstName || ""} ${c.lastName || ""}`.trim();
      const shortId = c.id ? c.id.slice(-5) : "N/A";
      const item = `
        <div class="d-flex align-items-center mb-3">
          <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random"
               class="rounded-circle me-3" width="40" height="40" alt="${fullName}">
          <div>
            <strong class="d-block">${fullName || "Unknown"}</strong>
            <small class="text-muted">Customer ID#${shortId}</small>
          </div>
        </div>
      `;
      listContainer.insertAdjacentHTML("beforeend", item);
    });
  } catch (err) {
    console.error("Error loading customer cards:", err);
  }
}
document.addEventListener("DOMContentLoaded", loadCustomerCards);

async function loadLatestOrders() {
  try {
    const res = await fetch("http://localhost:3001/amazon/document/api/orders");
    if (!res.ok) throw new Error("Failed to fetch orders");
    const orders = await res.json();
    // Sort by createdAt (newest first)
    const latestOrders = orders
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 4);
    const tbody = document.getElementById("latestOrdersBody");
    tbody.innerHTML = "";
    latestOrders.forEach(order => {
      const date = new Date(order.createdAt).toLocaleString("en-GB");
      const amount = `₦${order.totalAmount.toLocaleString()}`;
      const status = order.paymentStatus?.toLowerCase();
      let statusHTML = "";
      if (status === "paid") {
        statusHTML = `<span class="badge bg-success">Completed</span>`;
      } else if (status === "failed") {
        statusHTML = `<span class="badge bg-danger">Declined</span>`;
      } else {
        statusHTML = `<span class="badge bg-warning">Pending</span>`;
      }
      const row = `
        <tr>
          <td>Payment from #${order._id.slice(-5)}</td>
          <td>${date}</td>
          <td>${amount}</td>
          <td>${statusHTML}</td>
        </tr>
      `;
      tbody.insertAdjacentHTML("beforeend", row);
    });
  } catch (err) {
    console.error("Error loading latest orders:", err);
  }
}
document.addEventListener("DOMContentLoaded", loadLatestOrders);



// LOAD CUSTOMER NOTIFICATION FEED (with unseen tracking)
// =====================
let lastSeenOrderTime = localStorage.getItem("lastSeenOrderTime")
  ? new Date(localStorage.getItem("lastSeenOrderTime"))
  : new Date(0);
document.addEventListener("DOMContentLoaded", () => {
  loadCityOrdersFeed();
  // :white_check_mark: Bell click → mark as seen
  document.body.addEventListener("click", (e) => {
    if (e.target.closest(".btnSharp")) {
      const badges = [
        document.getElementById("notificationBadge"),
        document.getElementById("notificationBadge1"),
      ];
      badges.forEach((badge) => {
        if (badge) badge.style.display = "none";
      });
      // Mark latest order time as seen
      localStorage.setItem("lastSeenOrderTime", new Date().toISOString());
    }
  });
  // :repeat: Auto-refresh every 30 seconds
  setInterval(loadCityOrdersFeed, 30000);
});
async function loadCityOrdersFeed() {
  try {
    const distributorCity = localStorage.getItem("userCity");
    if (!distributorCity) {
      console.warn("Distributor city not found in localStorage.");
      return;
    }
    const res = await fetch("http://localhost:3001/amazon/document/api/orders");
    const orders = await res.json();
    // :white_check_mark: Filter orders by city
    const filteredOrders = orders.filter(
      (o) =>
        o.customerSnapshot?.city?.toLowerCase() ===
        distributorCity.toLowerCase()
    );
    // :white_check_mark: Sort newest first
    const sortedOrders = filteredOrders.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    const feeds = [
      document.getElementById("activityFeed"),
      document.getElementById("activityFeed1"),
    ];
    feeds.forEach((feed) => {
      if (!feed) return;
      feed.innerHTML = "";
      if (sortedOrders.length === 0) {
        feed.innerHTML = `<li class="text-muted text-center">No recent activity in ${distributorCity}</li>`;
        return;
      }
      // :white_check_mark: Show 5 recent
      sortedOrders.slice(0, 5).forEach((order) => {
        const firstName = order.customerSnapshot?.firstName || "Unknown";
        const lastName = order.customerSnapshot?.lastName
          ? order.customerSnapshot.lastName.charAt(0) + "."
          : "";
        const total = order.totalAmount
          ? order.totalAmount.toLocaleString()
          : "0";
        const payment = order.paymentStatus || "pending";
        const createdAt = new Date(order.createdAt);
        const timeAgo = formatTimeAgo(createdAt);
        const badgeClass =
          payment.toLowerCase() === "paid"
            ? "bg-success-subtle text-success"
            : payment.toLowerCase() === "failed"
            ? "bg-danger-subtle text-danger"
            : "bg-warning-subtle text-warning";
        const avatar = `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=random`;
        feed.insertAdjacentHTML(
          "beforeend",
          `
          <li class="d-flex align-items-center mb-3 border-bottom pb-2">
            <img src="${avatar}" class="rounded-circle me-3" width="40" height="40" alt="${firstName}">
            <div class="flex-grow-1">
              <div class="d-flex justify-content-between">
                <strong>${firstName} ${lastName}</strong>
                <small class="text-muted">${timeAgo}</small>
              </div>
              <div class="text-muted small">Placed an order worth ₦${total}</div>
            </div>
            <span class="badge rounded-pill ${badgeClass}">${payment}</span>
          </li>
          `
        );
      });
      // :white_check_mark: Add “See all notifications” button (bottom)
      feed.insertAdjacentHTML(
        "beforeend",
        `
        <li class="text-center mt-2">
          <button class="btn btn-success w-100 fw-semibold"
            onclick="window.location.href='notifications.html'">
            See all notifications
          </button>
        </li>
        `
      );
    });
    // :white_check_mark: New unseen notifications logic
    const newOrders = sortedOrders.filter(
      (o) => new Date(o.createdAt) > lastSeenOrderTime
    );
    updateNotificationBadge(newOrders.length);
  } catch (err) {
    console.error("Error loading city orders feed:", err);
  }
}
// :clock3: Helper function → format time ago
function formatTimeAgo(date) {
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "min", seconds: 60 },
  ];
  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1)
      return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
  }
  return "just now";
}
// :bell: Update notification badge (both desktop + mobile)
function updateNotificationBadge(count) {
  const badges = [
    document.getElementById("notificationBadge"),
    document.getElementById("notificationBadge1"),
  ];
  badges.forEach((badge) => {
    if (!badge) return;
    if (count > 0) {
      badge.style.display = "inline-block";
      badge.textContent = count > 9 ? "9+" : count;
    } else {
      badge.style.display = "none";
    }
  });
}

async function loadNotifications() {
  try {
    const distributorCity = localStorage.getItem("userCity");
    if (!distributorCity) return console.warn("No distributor city found in localStorage.");

    const res = await fetch("http://localhost:3001/amazon/document/api/orders");
    if (!res.ok) throw new Error("Failed to fetch orders");
    const orders = await res.json();

    // ✅ Filter by customerSnapshot.city instead of distributorCity
    const filteredOrders = orders.filter(order =>
      order?.customerSnapshot?.city?.toLowerCase() === distributorCity.toLowerCase()
    );

    renderNotifications(filteredOrders);
  } catch (err) {
    console.error("Error loading notifications:", err);
  }
}

function renderNotifications(orders) {
  const list = document.getElementById("notificationsList");
  const showingText = document.getElementById("showingText");
  const pagination = document.getElementById("pagination");

  const itemsPerPage = 10;
  let currentPage = 1;
  const totalPages = Math.ceil(orders.length / itemsPerPage);

  function renderPage(page) {
    list.innerHTML = "";
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedOrders = orders.slice(start, end);

    paginatedOrders.forEach(order => {
      const firstName = order?.customerSnapshot?.firstName || "";
      const lastName = order?.customerSnapshot?.lastName || "";
      const customerName = `${firstName} ${lastName}`.trim() || "Unknown Customer";

      const items = order?.items
        ?.map(i => `${i.quantity} ${i.name}`)
        .join(" and ") || "some items";
      
      const avatar = `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=random`;
      const createdAt = new Date(order.createdAt);
      const time = createdAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const todayLabel =
        createdAt.toDateString() === new Date().toDateString() ? "Today" : createdAt.toDateString();

      const html = `
        <div class="d-flex align-items-center border-bottom py-2">
          <img src="${avatar}"
               alt="Profile" class="rounded-circle me-2" width="40" height="40">
          <div class="flex-grow-1">
            <strong>${customerName}</strong>, just ordered ${items}.
          </div>
          <small class="text-muted">${time} ${todayLabel}</small>
        </div>
      `;
      list.insertAdjacentHTML("beforeend", html);
    });

    showingText.textContent = `Showing ${start + 1} to ${Math.min(end, orders.length)} Items`;
    renderPagination(page);
  }

  function renderPagination(activePage) {
    pagination.innerHTML = "";

    const prevDisabled = activePage === 1 ? "disabled" : "";
    const nextDisabled = activePage === totalPages ? "disabled" : "";

    pagination.innerHTML += `
      <li class="page-item ${prevDisabled}">
        <a class="page-link" href="#" data-page="${activePage - 1}">&lt;</a>
      </li>
    `;

    for (let i = 1; i <= totalPages; i++) {
      pagination.innerHTML += `
        <li class="page-item ${i === activePage ? "active" : ""}">
          <a class="page-link" href="#" data-page="${i}">${i}</a>
        </li>
      `;
    }

    pagination.innerHTML += `
      <li class="page-item ${nextDisabled}">
        <a class="page-link" href="#" data-page="${activePage + 1}">&gt;</a>
      </li>
    `;

    pagination.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", e => {
        e.preventDefault();
        const page = parseInt(e.target.dataset.page);
        if (page >= 1 && page <= totalPages) {
          currentPage = page;
          renderPage(currentPage);
        }
      });
    });
  }

  renderPage(currentPage);
}

document.addEventListener("DOMContentLoaded", loadNotifications);

document.addEventListener("DOMContentLoaded", () => {
  const currentPage = window.location.pathname.split("/").pop();
  const links = document.querySelectorAll(".sidebar .nav-link");
  links.forEach(link => {
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("active");
    }
  });
});





document.addEventListener("DOMContentLoaded", () => {
  const searchBtn = document.getElementById("mobileSearchBtn");
  const searchInput = document.getElementById("mobileSearchInput");
  // Toggle search input visibility
  searchBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (searchInput.style.width === "0px" || searchInput.style.width === "") {
      searchInput.style.width = "180px";
      searchInput.style.opacity = "1";
      searchInput.focus();
    } else {
      searchInput.style.width = "0";
      searchInput.style.opacity = "0";
      searchInput.value = "";
      filterDashboardItems(""); // reset search
    }
  });
  // Search typing logic
  searchInput.addEventListener("input", (e) => {
    const value = e.target.value.toLowerCase().trim();
    filterDashboardItems(value);
  });
});
// ========== Dashboard Filter Function ==========
function filterDashboardItems(searchValue) {
  const rows = document.querySelectorAll("#ordersTableBody tr, #usersTableBody tr");
  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(searchValue) ? "" : "none";
  });
}



document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".search-container");
  const btn = document.getElementById("mobileSearchBtn");
  const input = document.getElementById("mobileSearchInput");
  if (!container || !btn || !input) return;
  // Expand / collapse input
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    const isExpanded = container.classList.contains("expanded");
    if (!isExpanded) {
      container.classList.add("expanded");
      input.focus();
    } else {
      if (input.value.trim() !== "") {
        input.value = "";
        filterDashboardItems("");
        input.focus();
      } else {
        container.classList.remove("expanded");
      }
    }
  });
  // Live search while typing
  input.addEventListener("input", (e) => {
    const value = e.target.value.toLowerCase().trim();
    filterDashboardItems(value);
  });
  // Collapse when clicking outside
  document.addEventListener("click", (e) => {
    if (!container.contains(e.target) && input.value.trim() === "") {
      container.classList.remove("expanded");
    }
  });
  // Collapse on blur if empty
  input.addEventListener("blur", () => {
    setTimeout(() => {
      if (input.value.trim() === "") {
        container.classList.remove("expanded");
      }
    }, 120);
  });
});
// :broom: Normalize text for matching
function normalizeText(text) {
  return text.toLowerCase().replace(/₦|,|\s+/g, "").trim();
}
// :sleuth_or_spy: Main dashboard filter logic
function filterDashboardItems(searchValue) {
  const cleanSearch = normalizeText(searchValue);
  const tables = document.querySelectorAll("table");
  const metricCards = document.querySelectorAll(".metric-card");
  const customerItems = document.querySelectorAll("#customerList > div");
  // Remove old “no results” if any
  let existingMsg = document.getElementById("noResultsMsg");
  if (existingMsg) existingMsg.remove();
  let resultsFound = false;
  // Reset everything when input empty
  if (cleanSearch === "") {
    tables.forEach((t) => t.querySelectorAll("tr").forEach((tr) => (tr.style.display = "")));
    metricCards.forEach((c) => (c.style.display = ""));
    customerItems.forEach((d) => (d.style.display = ""));
    return;
  }
  // :white_check_mark: Filter metric cards
  metricCards.forEach((card) => {
    const text = normalizeText(card.textContent);
    const visible = text.includes(cleanSearch);
    card.style.display = visible ? "" : "none";
    if (visible) resultsFound = true;
  });
  // :white_check_mark: Filter customer list
  customerItems.forEach((div) => {
    const text = normalizeText(div.textContent);
    const visible = text.includes(cleanSearch);
    div.style.display = visible ? "" : "none";
    if (visible) resultsFound = true;
  });
  // :white_check_mark: Filter all tables
  tables.forEach((table) => {
    const headers = Array.from(table.querySelectorAll("thead th"))
      .map((th) => normalizeText(th.textContent))
      .join(" ");
    const rows = table.querySelectorAll("tbody tr");
    let tableHasMatch = false;
    rows.forEach((tr) => {
      const rowText = normalizeText(tr.textContent);
      const visible = rowText.includes(cleanSearch) || headers.includes(cleanSearch);
      tr.style.display = visible ? "" : "none";
      if (visible) {
        tableHasMatch = true;
        resultsFound = true;
      }
    });
    // If no rows matched but header matches, show table anyway
    if (!tableHasMatch && headers.includes(cleanSearch)) {
      rows.forEach((tr) => (tr.style.display = ""));
      resultsFound = true;
    }
  });
  // :no_entry_sign: Show “No results found” overlay
  if (!resultsFound) {
    const msg = document.createElement("div");
    msg.id = "noResultsMsg";
    msg.textContent = "No results found";
    Object.assign(msg.style, {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      background: "rgba(255,255,255,0.95)",
      padding: "15px 25px",
      borderRadius: "12px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
      fontWeight: "500",
      color: "#444",
      zIndex: "2000",
    });
    document.body.appendChild(msg);
    // Auto-remove message after 2 seconds
    setTimeout(() => {
      if (msg && msg.parentNode) msg.remove();
    }, 2000);
  }
}


// Best-selling products (donut) with year navigation and robust handling
document.addEventListener("DOMContentLoaded", () => {
  const yearLabel = document.getElementById("chartYear");
  if (!yearLabel) return;
  let currentYear = new Date().getFullYear();
  yearLabel.textContent = currentYear;
  // Set up arrows
  const leftArrow = document.querySelector(".fa-chevron-left");
  const rightArrow = document.querySelector(".fa-chevron-right");
  [leftArrow, rightArrow].forEach(el => el.style.cursor = "pointer");
  leftArrow.addEventListener("click", () => {
    currentYear--;
    yearLabel.textContent = currentYear;
    loadBestSellingProducts(currentYear);
  });
  rightArrow.addEventListener("click", () => {
    currentYear++;
    yearLabel.textContent = currentYear;
    loadBestSellingProducts(currentYear);
  });
  // Load current year by default
  loadBestSellingProducts(currentYear);
});
async function loadBestSellingProducts(year) {
  const canvas = document.getElementById("bestSellingChart");
  const legend = document.getElementById("productLegend");
  const ctx = canvas.getContext("2d");
  if (!canvas || !legend) return;
  // Clean up any previous chart
  if (window.bestSellingChart && typeof window.bestSellingChart.destroy === "function") {
    window.bestSellingChart.destroy();
  }
  legend.innerHTML = `<p class="text-muted text-center">Loading...</p>`;
  try {
    const distributorCity = localStorage.getItem("userCity");
    if (!distributorCity) {
      legend.innerHTML = `<p class="text-muted text-center">Distributor city not set</p>`;
      drawEmptyCenter(canvas, "0", "Best-Selling");
      return;
    }
    const res = await fetch("http://localhost:3001/amazon/document/api/orders");
    if (!res.ok) throw new Error("Failed to fetch orders");
    const orders = await res.json();
    // Filter by city & year
    const filteredOrders = orders.filter(
      (o) =>
        o.customerSnapshot?.city?.toLowerCase() === distributorCity.toLowerCase() &&
        new Date(o.createdAt).getFullYear() === year
    );
    if (!filteredOrders.length) {
      legend.innerHTML = `<p class="text-muted text-center">No data for ${year}</p>`;
      drawEmptyCenter(canvas, "0", `No data ${year}`);
      return;
    }
    // Aggregate product data
    const productMap = {};
    filteredOrders.forEach((order) => {
      order.items?.forEach((item) => {
        if (!productMap[item.name]) {
          productMap[item.name] = { quantity: 0, image: item.image || "" };
        }
        productMap[item.name].quantity += item.quantity || 0;
      });
    });
    const topProducts = Object.entries(productMap)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 4);
    const totalUnits = topProducts.reduce((sum, p) => sum + p.quantity, 0);
    const colors = ["#3B82F6", "#A855F7", "#22C55E", "#F97316"];
    // Draw chart
    const centerTextPlugin = {
      id: "centerText",
      afterDraw(chart) {
        const { ctx, chartArea } = chart;
        if (!chartArea) return;
        const { left, right, top, bottom } = chartArea;
        const x = (left + right) / 2;
        const y = (top + bottom) / 2;
        ctx.save();
        ctx.font = "bold 22px 'Poppins', sans-serif";
        ctx.fillStyle = "#111827";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(totalUnits.toLocaleString(), x, y - 8);
        ctx.font = "11px 'Poppins', sans-serif";
        ctx.fillStyle = "#6B7280";
        ctx.fillText("Best-Selling", x, y + 14);
        ctx.restore();
      },
    };
    window.bestSellingChart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: topProducts.map((p) => p.name),
        datasets: [
          {
            data: topProducts.map((p) => p.quantity),
            backgroundColor: colors.slice(0, topProducts.length),
            borderWidth: 0,
            cutout: "75%",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
      },
      plugins: [centerTextPlugin],
    });
    // Render product legend
    legend.innerHTML = "";
    topProducts.forEach((p, i) => {
      legend.insertAdjacentHTML(
        "beforeend",
        `
        <div class="d-flex align-items-center mb-2">
          <span class="me-2" style="width:10px; height:10px; background:${colors[i]}; border-radius:50%;"></span>
          <img src="${p.image}" width="30" height="30" class="rounded me-2" alt="${p.name}">
          <span class="fw-semibold">${p.name}</span>
          <span class="ms-auto text-muted">${formatK(p.quantity)}</span>
        </div>
        `
      );
    });
  } catch (err) {
    console.error("Error loading best-selling products:", err);
    legend.innerHTML = `<p class="text-muted text-center">Error loading data</p>`;
    drawEmptyCenter(canvas, "0", "Error");
  }
}
function drawEmptyCenter(canvas, main = "0", sub = "Best-Selling") {
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const x = canvas.width / 2;
  const y = canvas.height / 2;
  ctx.save();
  ctx.font = "bold 22px 'Poppins', sans-serif";
  ctx.fillStyle = "#111827";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(main, x, y - 8);
  ctx.font = "11px 'Poppins', sans-serif";
  ctx.fillStyle = "#6B7280";
  ctx.fillText(sub, x, y + 14);
  ctx.restore();
}
function formatK(num) {
  return num >= 1000 ? (num / 1000).toFixed(1) + "k" : num.toString();
}


document.addEventListener("DOMContentLoaded", () => {
  const nameSpan = document.getElementById("distributorName");
  const distributorName = localStorage.getItem("userName");
  if (nameSpan && distributorName) {
    nameSpan.textContent = distributorName;
  }
});

function showToast(message, duration = 4000, type = "success") {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.classList.add("toast");

  // Optionally change color based on type
  if (type === "error") toast.style.backgroundColor = "#dc3545";
  if (type === "info") toast.style.backgroundColor = "#00A859";

  toast.textContent = message;
  container.appendChild(toast);

  // Trigger animation
  setTimeout(() => toast.classList.add("show"), 100);

  // Auto-remove after duration
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 500);
  }, duration);
}
showToast("Welcome back to your dashboard!", 5000, "info");


async function loadPlatformOrdersChart() {
  try {
    const response = await fetch("http://localhost:3001/amazon/document/api/orders");
    if (!response.ok) throw new Error("Failed to fetch orders");

    const orders = await response.json();
    const currentYear = new Date().getFullYear();

    // Group counts by month and platform
    const monthlyData = {
      mobile: Array(12).fill(0),
      desktop: Array(12).fill(0),
    };

    orders.forEach(order => {
      const orderDate = new Date(order.createdAt);
      if (orderDate.getFullYear() !== currentYear) return;

      const month = orderDate.getMonth(); // 0 = Jan, 11 = Dec
      const platform = (order.platform || "").toLowerCase(); // e.g. "mobile" or "desktop"

      if (platform.includes("mobile")) monthlyData.mobile[month]++;
      else if (platform.includes("desktop")) monthlyData.desktop[month]++;
    });

    const ctx = document.getElementById("visitInsightsChart").getContext("2d");

    new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [
          {
            label: "Mobile Browser",
            data: monthlyData.mobile,
            backgroundColor: "#16a34a", // Green
            borderRadius: 8,
            barPercentage: 0.4,
          },
          {
            label: "Desktop",
            data: monthlyData.desktop,
            backgroundColor: "rgba(22, 163, 74, 0.3)", // Light green
            borderRadius: 8,
            barPercentage: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "#111",
            titleColor: "#fff",
            bodyColor: "#fff",
            callbacks: {
              label: ctx => `${ctx.dataset.label}: ${ctx.formattedValue} orders`,
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: "#999", font: { size: 12 } },
          },
          y: {
            grid: { color: "rgba(0,0,0,0.05)" },
            ticks: { display: false },
            border: { display: false },
          },
        },
      },
    });
  } catch (error) {
    console.error("🔥 Error loading platform orders chart:", error);
  }
}

// Run after page loads
document.addEventListener("DOMContentLoaded", loadPlatformOrdersChart);
