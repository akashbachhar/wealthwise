document.addEventListener('DOMContentLoaded', () => {
    const resultContainer = document.getElementById('result-container');
    const responseData = JSON.parse(localStorage.getItem('responseData'));

    if (responseData) {
        console.log(responseData)

        function capitalizeFirstLetter(text) {
            if (typeof text === "string" && text.length > 0) {
                return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
            }
            return text;
        }

// Function to populate user data boxes
        function populateUserDataBoxes(data) {
            document.getElementById("riskTolerance").textContent = capitalizeFirstLetter(data.risk_tolerance);
            document.getElementById("financialGoals").textContent = capitalizeFirstLetter(data.financial_goals);
            document.getElementById("timeline").textContent = capitalizeFirstLetter(data.timeline);
            document.getElementById("initialInvestment").textContent = capitalizeFirstLetter(data.initial_investment);
        }

        populateUserDataBoxes(responseData);


        // Extract the main JSON data between ``` marks
        const jsonStart = responseData.response.indexOf('```json');
        const jsonEnd = responseData.response.indexOf('```', jsonStart + 1);
        const portfolioData = responseData.response.slice(jsonStart + 7, jsonEnd).trim();
        const data = JSON.parse(portfolioData);

        const specificRecommendations = data.Specific_Recommendations;

// Get the container for recommendations display
        const recommendationsBox = document.getElementById("recommendationsBox");

// Function to dynamically render recommendations based on selected section
        function renderRecommendations(category) {
            const recommendations = data.Specific_Recommendations[category];
            const recommendationsBox = document.getElementById("recommendationsBox");
            recommendationsBox.innerHTML = ""; // Clear previous content

            if (Array.isArray(recommendations)) {
                // Handle array of recommendations
                recommendations.forEach((item) => {
                    const recBox = document.createElement("div");
                    recBox.classList.add("recommendation-item");
                    recBox.style.borderLeft = "5px solid #007bff";
                    recBox.style.padding = "10px";
                    recBox.style.marginBottom = "10px";

                    // Generate recommendation details dynamically
                    recBox.innerHTML = `
        ${item.Name ? `<h4>${item.Name}</h4>` : ""}
        ${item.City ? `<h4>${item.City}</h4>` : ""}
        ${item.Type ? `<h4>${item.Type}</h4>` : ""}
        ${item.CAGR ? `<p><strong>CAGR:</strong> ${item.CAGR}</p>` : ""}
        ${item["1-Year_Return"] ? `<p><strong>1-Year Return:</strong> ${item["1-Year_Return"]}</p>` : ""}
        ${item.Recent_Performance ? `<p><strong>Recent Performance:</strong> ${item.Recent_Performance}</p>` : ""}
        ${item.Sector ? `<p><strong>Sector:</strong> ${item.Sector}</p>` : ""}
        ${item.Appreciation ? `<p><strong>Appreciation:</strong> ${item.Appreciation}</p>` : ""}
        ${item.Current_Yield ? `<p><strong>Current Yield:</strong> ${item.Current_Yield}</p>` : ""}
        ${item.Current_Price ? `<p><strong>Current Price:</strong> ${item.Current_Price}</p>` : ""}
        ${item.Details ? `<p><strong>Details:</strong> ${item.Details}</p>` : ""}
      `;

                    recommendationsBox.appendChild(recBox);
                });
            } else if (typeof recommendations === "string") {
                // Handle single string recommendation
                const recBox = document.createElement("div");
                recBox.classList.add("recommendation-item");
                recBox.style.borderLeft = "5px solid #28a745";
                recBox.style.padding = "10px";
                recBox.style.marginBottom = "10px";
                recBox.innerHTML = `<p>${recommendations}</p>`;
                recommendationsBox.appendChild(recBox);
            } else {
                // Fallback case for unhandled data types
                recommendationsBox.innerHTML = "<p>No specific recommendations available for this category.</p>";
            }
        }

// Portfolio Allocation Pie Chart with Click Event
        const ctx1 = document.getElementById("portfolioPieChart").getContext("2d");
        const portfolioChart = new Chart(ctx1, {
            type: "pie",
            data: {
                labels: Object.keys(data.Portfolio_Allocation),
                datasets: [
                    {
                        data: Object.values(data.Portfolio_Allocation),
                        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"],
                    },
                ],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: "top",
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const dataset = context.dataset;
                                const total = dataset.data.reduce((sum, value) => sum + value, 0);
                                const currentValue = dataset.data[context.dataIndex];
                                const percentage = ((currentValue / total) * 100).toFixed(2);
                                return `${context.label}: ${currentValue} (${percentage}%)`;
                            },
                        },
                    },
                    datalabels: {
                        formatter: (value, context) => {
                            const total = context.chart.data.datasets[0].data.reduce((sum, val) => sum + val, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${percentage}%`;
                        },
                        color: "#fff",
                        font: {
                            weight: "bold",
                        },
                    },
                },
                onClick: (event, elements) => {
                    if (elements.length > 0) {
                        const chartIndex = elements[0].index;
                        const selectedSection = portfolioChart.data.labels[chartIndex];
                        renderRecommendations(selectedSection);
                    }
                },
            },
            plugins: [ChartDataLabels], // Add the DataLabels plugin
        });

        renderRecommendations("Equities");

        const infoBoxes = document.getElementById("infoBoxes");

        const marketTrendsBox = document.createElement("div");
        marketTrendsBox.classList.add("info-box");
        marketTrendsBox.innerHTML = `
    <h3>Key Market Trends</h3>
    <ul>
      ${data.Key_Market_Trends.map((trend) => `<li>${trend}</li>`).join("")}
    </ul>
  `;
        infoBoxes.appendChild(marketTrendsBox);

        const actionableStepsBox = document.createElement("div");
        actionableStepsBox.classList.add("info-box");
        actionableStepsBox.innerHTML = `
    <h3>Actionable Steps</h3>
    <ul>
      ${data.Actionable_Steps.map((step) => `<li>${step}</li>`).join("")}
    </ul>
  `;
        infoBoxes.appendChild(actionableStepsBox);


    } else {
        resultContainer.innerHTML = '<p>No data found. Please try again.</p>';
    }
});