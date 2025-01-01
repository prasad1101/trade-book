var res;
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
            populateTable(res.tradeHistory);
            totalPnl = calculateTotalPnL(res.tradeHistory);
            console.log("res", res, totalPnl)
            document.getElementById("pnl").innerHTML = totalPnl + " INR";
            document.getElementById("capital").innerHTML = res?.cardData?.capital + " INR";
            res.cardData.balance = res?.cardData?.capital + (calculateTotalPnL(res.tradeHistory));
            document.getElementById("balance").innerHTML = res?.cardData?.capital + (calculateTotalPnL(res.tradeHistory)) + " INR";
            let dir = `${res.cardData.balance < res.cardData.capital ? "- " : "+ "}`;
            document.getElementById("gain").innerHTML = dir + (res?.cardData?.balance / res?.cardData?.capital) * 100 + " %";

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
            item.direction + " " + item.pnl / 2,
            item.date,
        ];

        cells.forEach(cellText => {
            const td = document.createElement('td');
            td.textContent = cellText;
            row.appendChild(td);
        });

        tableBody.appendChild(row);
    });
}

function calculateTotalPnL(data) {
    return data.reduce((sum, item) => {
        return item.direction === "+"
            ? sum + item.pnl / 2
            : sum - item.pnl / 2;
    }, 0);
}