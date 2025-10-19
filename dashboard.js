document.addEventListener('DOMContentLoaded', () => {
    const riskDataString = localStorage.getItem('AeroCareRiskData');

    if (!riskDataString) {
        alert("Error: Calibration data not found. Please complete the calibration form.");
        window.location.href = "calibration.html"; 
        return;
    }

    const riskData = JSON.parse(riskDataString);

    const aqi = parseFloat(riskData.aqiValue);
    const sabaBaseline = parseFloat(riskData.sabaBaseline);
    const sabaSpike = parseFloat(riskData.currentSabaUsage);

    document.getElementById('aqi-value').textContent = aqi || '--';
    document.getElementById('saba-baseline-display').textContent = sabaBaseline || '--';
    document.getElementById('current-saba-spike').textContent = sabaSpike || '--';

    
    let condition;
    let color;

    if (aqi <= 100 && sabaSpike <= 2) {
        condition = "Safe";
        color = "#10b981"; 
    } else if (aqi <= 150 && sabaSpike <= 3.5) {
        condition = "OK";
        color = "#fbbf24"; 
    } else {
        condition = "Risk";
        color = "#dc2626"; 
    }

    
    const conditionEl = document.getElementById('user-condition');
    conditionEl.textContent = condition;
    conditionEl.style.color = color;

    
    const steps = document.querySelectorAll('.flow-step');
    steps.forEach(step => step.classList.remove('active', 'inactive'));

    if (condition === "Safe") steps[0].classList.add('active');
    else if (condition === "OK") steps[2].classList.add('active');
    else steps[3].classList.add('active');

    steps.forEach(step => {
        if (!step.classList.contains('active')) step.classList.add('inactive');
    });
});

function logout() {
    localStorage.removeItem('AeroCareUser');
    localStorage.removeItem('AeroCareRiskData');
    window.location.href = 'index.html';
}