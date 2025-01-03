var lotSizeWithRisk = 0;
var res;
var slPoint = 0;
var maxLoss = 0;

function calculate(capital, entry, sl, risk) {
    if (entry <= 0 || sl <= 0 || capital <= 0 || risk <= 0) {
        console.log("All inputs must be positive numbers.");
    }
    const riskAmount = capital * risk;
    const priceDifference = Math.abs(entry - sl);
    if (priceDifference === 0) {
        console.log("Entry price and stop-loss price cannot be the same.");
    }
    const lotSize = riskAmount / priceDifference;
    console.log("lotsize", lotSize)
}

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
            res = data;
            console.log("res in calc", res);
            document.getElementById("capital").value = res.calcData.capital;
            document.getElementById("risk").value = res.calcData.risk;
        })
};

getData();