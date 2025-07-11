let res;
let userDetails;
let grouped;

function getData() {
  fetch("https://jsonblob.com/api/jsonBlob/1319247450992730112")
    .then((response) => {
      if (response.ok) return response.json();
      else throw new Error("API request failed");
    })
    .then((data) => {
      res = data;
      console.log("✅ Data fetched from API:", data);

      const savedUsername = localStorage.getItem("loggedInUsername");

      if (savedUsername) {
        const matched = data.find(
          (item) => item.user.username === savedUsername
        );
        if (matched) {
          userDetails = matched;
          console.log("🔁 Auto-login as:", savedUsername);
          showDashboard();
        }
      }
    })
    .catch((error) => console.error("❌ Fetch Error:", error));
}

function validateCredentials(data, username, password) {
  return (
    data.find(
      (item) => item.user.username === username && item.user.pwd === password
    ) || null
  );
}

function login(un, pwd) {
  const matched = validateCredentials(res, un, pwd);
  if (matched !== null) {
    localStorage.setItem("loggedInUsername", matched.user.username);
    userDetails = matched;
    console.log("✅ Logged in as:", matched.user.username);
    showDashboard();
  } else {
    document.getElementById("loginError").style.display = "block";
  }
}

function logout() {
  localStorage.removeItem("loggedInUsername");
  location.reload();
}

function showDashboard() {
  console.log("🔁 showDashboard called");

  document.getElementById("login").style.display = "none";
  document.getElementById("dashboard").style.display = "block";
  document.getElementById("loginError").style.display = "none";

  document.getElementById("username").innerHTML = `(${userDetails.user.name})`;
  populateTable(userDetails.user.role, userDetails.tradeHistory);

  const totalPnl = calculateTotalPnL(
    userDetails.user.role,
    userDetails.tradeHistory
  );
  const capital = userDetails?.cardData?.capital;
  const balance = capital + totalPnl;
  const gain = ((totalPnl / capital) * 100).toFixed(1);

  document.getElementById("capital").innerHTML = capital + " INR";
  document.getElementById("pnl").innerHTML = totalPnl + " INR";
  document.getElementById("balance").innerHTML = balance + " INR";
  document.getElementById("gain").innerHTML =
    (gain > 0 ? "+" + gain : gain) + " %";

  document.getElementById("gain").classList.add(gain >= 0 ? "gain" : "loss");
  document.getElementById("pnl").classList.add(totalPnl >= 0 ? "gain" : "loss");

  grouped = groupTradesByMonth(userDetails.tradeHistory, userDetails.user.role);
  console.log("📊 Grouped Monthly P&L:", grouped);

  const monthlyTable = document.getElementById("monthlySummary");
  monthlyTable.innerHTML = "";

  Object.entries(grouped).forEach(([monthYear, { totalPnL }]) => {
    const tr = document.createElement("tr");

    const tdMonth = document.createElement("td");
    tdMonth.textContent = monthYear;

    const tdPnL = document.createElement("td");
    tdPnL.textContent = totalPnL.toFixed(2) + " INR";
    tdPnL.classList.add(totalPnL >= 0 ? "gain" : "loss");

    tr.appendChild(tdMonth);
    tr.appendChild(tdPnL);

    monthlyTable.appendChild(tr);
  });
}

function populateTable(role, data) {
  const tableBody = document.querySelector("#investmentTable tbody");
  tableBody.innerHTML = "";
  const percentage = role === "family" ? 0.5 : 0.25;

  data.forEach((item, i) => {
    const row = document.createElement("tr");

    const cells = [
      i + 1,
      item.name,
      item.type,
      item.direction === "+"
        ? item.direction + " " + item.pnl * percentage
        : item.direction + " " + item.pnl / 2,
      item.date,
    ];

    cells.forEach((cellText, j) => {
      const td = document.createElement("td");
      if (j === 3) td.classList.add(item.direction === "+" ? "gain" : "loss");
      td.textContent = cellText;
      row.appendChild(td);
    });

    tableBody.appendChild(row);
  });
}

function calculateTotalPnL(role, data) {
  return data.reduce((sum, item) => {
    const percentage = role === "family" ? 0.5 : 0.25;
    return item.direction === "+"
      ? sum + item.pnl * percentage
      : sum - item.pnl / 2;
  }, 0);
}

function groupTradesByMonth(trades, role) {
  const grouped = {};
  const percentage = role === "family" ? 0.5 : 0.25;

  trades.forEach((trade) => {
    const [day, month, year] = trade.date.split("/");
    const key = `${month}/${year}`; // e.g., "01/2025"
    const pnlValue =
      trade.direction === "+" ? trade.pnl * percentage : -trade.pnl / 2;

    if (!grouped[key]) {
      grouped[key] = {
        trades: [],
        totalPnL: 0,
      };
    }

    grouped[key].trades.push(trade);
    grouped[key].totalPnL += pnlValue;
  });

  return grouped;
}

// Fetch on load
getData();
