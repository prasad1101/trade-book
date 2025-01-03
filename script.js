var res;
var userDetails;
function getData() {
    fetch('https://jsonblob.com/api/jsonBlob/1319247450992730112')
        .then(response => {
            if (response.ok) {
                return response.json(); // Parse the response data as JSON
            } else {
                throw new Error('API request failed');
            }
        })
        .then(data => {
            // Process the response data here
            res = data;
        })
        .catch(error => {
            // Handle any errors here
            console.error(error); // Example: Logging the error to the console
        });
}

function populateTable(data) {
    const tableBody = document.querySelector('#investmentTable tbody');
    data.forEach((item, i) => {
        const row = document.createElement('tr');

        const cells = [
            i + 1, // Handle missing "id"
            item.name,
            item.type,
            item.direction === "+" ? item.direction + " " + item.pnl * 0.25 : item.direction + " " + item.pnl / 2,
            item.date,
        ];

        cells.forEach((cellText, i) => {
            const td = document.createElement('td');
            if (i === 3) {
                if (item.direction === "+") {
                    td.classList.add("gain")
                } else {
                    td.classList.add("loss")
                }
            }
            td.textContent = cellText;
            row.appendChild(td);
        });

        tableBody.appendChild(row);
    });
}

function calculateTotalPnL(data) {
    return data.reduce((sum, item) => {
        return item.direction === "+"
            ? sum + (item.pnl * 0.25)
            : sum - item.pnl / 2;
    }, 0);
}

function login(un, pwd) {
    if (validateCredentials(res, un, pwd) !== null) {
        document.getElementById("login").style = "display:none;"
        document.getElementById("dashboard").style = "display:block;"
        document.getElementById("loginError").style = "display:none;"

        userDetails = validateCredentials(res, un, pwd);

        document.getElementById("username").innerHTML = `(${userDetails.user.name})`;
        populateTable(userDetails.tradeHistory);
        totalPnl = calculateTotalPnL(userDetails.tradeHistory);
        document.getElementById("pnl").innerHTML = totalPnl + " INR";
        document.getElementById("capital").innerHTML = userDetails?.cardData?.capital + " INR";
        userDetails.cardData.balance = userDetails?.cardData?.capital + (calculateTotalPnL(userDetails.tradeHistory));
        document.getElementById("balance").innerHTML = userDetails?.cardData?.capital + (calculateTotalPnL(userDetails.tradeHistory)) + " INR";
        let dir = `${userDetails.cardData.balance < userDetails.cardData.capital ? "-" : "+"}`;
        document.getElementById("gain").innerHTML = dir + (userDetails?.cardData?.balance / userDetails?.cardData?.capital) * 100 + " %";
        if (dir === "+") {
            document.getElementById("gain").classList.add("gain")
        } else {
            document.getElementById("gain").classList.add("loss")
        }

        if (totalPnl > 0) {
            document.getElementById("pnl").classList.add("gain")
        } else {
            document.getElementById("pnl").classList.add("loss")
        }
    } else {
        document.getElementById("dashboard").style = "display:none;"
        document.getElementById("loginError").style = "display:block;"
    }


}

function validateCredentials(data, username, password) {
    const matchedUser = data.find(item =>
        item.user.username === username && item.user.pwd === password
    );
    return matchedUser || null; // Return the matched user or null if no match
}