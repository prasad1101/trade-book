

document.addEventListener("DOMContentLoaded", function () {
    var res;
    var brokreageData;

    function calculateBrokerCommissions(brokers) {
        const clientProfitPercentage = 0.30; // 30% of each client's profit is considered

        // Calculate total amount from all brokers
        let totalAmount = brokers.reduce((sum, broker) => {
            return sum + broker.clients.reduce((clientSum, client) => clientSum + (client.profit * clientProfitPercentage), 0);
        }, 0);

        // Calculate commission, app fee, and remaining amount
        const commissionRate = 0.06; // 6%
        const appFeeRate = 0.02; // 2%
        const commission = totalAmount * commissionRate;
        const appFee = totalAmount * appFeeRate;
        const remainingAmount = totalAmount - (commission + appFee);

        // Update brokers with brokerageGenerated and ibCommission
        const updatedBrokers = brokers.map(broker => {
            const brokerageGenerated = broker.clients.reduce((sum, client) => sum + client.profit * clientProfitPercentage, 0);
            const clientsProfit = broker.clients.reduce((sum, client) => sum + client.profit, 0);

            // Calculate percentage contribution of brokerageGenerated to totalAmount
            const percentageContribution = totalAmount > 0 ? (brokerageGenerated / totalAmount) : 0;

            // Calculate IB commission
            const ibCommission = percentageContribution * remainingAmount;

            return {
                ...broker,
                brokerageGenerated: Number(brokerageGenerated.toFixed(2)),
                ibCommission: Number(ibCommission.toFixed(2)),
                clientsProfit: Number(clientsProfit.toFixed(2))
            };
        });

        return {
            totalAmount: Number(totalAmount.toFixed(2)),
            commission: Number(commission.toFixed(2)),
            appFee: Number(appFee.toFixed(2)),
            remainingAmount: Number(remainingAmount.toFixed(2)),
            brokers: updatedBrokers
        };;
    }

    function updateTable() {
        var input = document.getElementById("input");
        input.innerHTML = JSON.stringify(res);
        brokreageData = calculateBrokerCommissions(res)
        brokersData = brokreageData.brokers;
        const tableBody = document.querySelector("#dataTable tbody");
        console.log("brokreageData", brokreageData);
        document.getElementById("totalBrokerage").innerHTML = brokreageData.totalAmount > 0 ? `${brokreageData.totalAmount} $` : '0 $';
        document.getElementById("fmComm").innerHTML = brokreageData.commission > 0 ? `${brokreageData.commission} $` : '0 $';
        document.getElementById("distAmount").innerHTML = brokreageData.remainingAmount > 0 ? `${brokreageData.remainingAmount} $` : '0 $';
        document.getElementById("appFee").innerHTML = brokreageData.appFee > 0 ? `${brokreageData.appFee} $` : '0 $';



        // Clear existing table rows
        tableBody.innerHTML = "";

        // Populate table with broker data
        brokersData.forEach((broker, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <th scope="row">${index + 1}</th>
                <td>${broker.name}</td>
                <td>${broker.clientsProfit > 0 ? broker.clientsProfit + " $" : '0 $'}</td>
                <td>${broker.brokerageGenerated > 0 ? broker.brokerageGenerated + " $" : '0 $'}</td>
                <td>${broker.ibCommission > 0 ? broker.ibCommission + " $" : '0 $'}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    function getData() {
        fetch('https://jsonblob.com/api/jsonBlob/1339505015072677888')
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
                updateTable();
            })
            .catch(error => {
                // Handle any errors here
                console.error(error); // Example: Logging the error to the console
            });
    }

    getData();
    // Call the function to populate the table
});
