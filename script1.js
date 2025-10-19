function calculateRisk(sabaBaseline, isPollutionTrigger) {
    const SABA_WEIGHT = 0.7;
    const AQI_WEIGHT = 0.3;

    const mockCurrentSabaUsage = sabaBaseline * 2.5;
    const mockCurrentAQI = 118;
    const AQI_THRESHOLD = 100;

    const sabaRiskFactor = mockCurrentSabaUsage / sabaBaseline;

    let aqiRiskFactor = 0;
    if (mockCurrentAQI > AQI_THRESHOLD) {
        aqiRiskFactor = ((mockCurrentAQI - AQI_THRESHOLD) / AQI_THRESHOLD) * (isPollutionTrigger ? 1.5 : 1);
    }

    const normalizedSaba = Math.min(1, sabaRiskFactor * SABA_WEIGHT);
    const normalizedAqi = Math.min(1, aqiRiskFactor * AQI_WEIGHT);

    let score = (normalizedSaba + normalizedAqi) * 100;
    score = Math.min(99, score);

    let level = "Optimal Control";
    if (score >= 75) level = "CRITICAL: Imminent Exacerbation Risk";
    else if (score >= 50) level = "HIGH ALERT: Action Recommended";
    else if (score >= 25) level = "Elevated Risk Detected";

    return {
        score: score.toFixed(0),
        level,
        aqiValue: mockCurrentAQI,
        sabaBaseline: sabaBaseline.toFixed(2),
        currentSabaUsage: mockCurrentSabaUsage.toFixed(2),
        isPollutionSensitive: isPollutionTrigger
    };
}

document.addEventListener('DOMContentLoaded', () => {
    const calibrationForm = document.getElementById('calibration-form');
    const statusMsg = document.getElementById('statusMsg');
    const logoutBtn = document.getElementById('logoutBtn');
    const userNameElement = document.getElementById('userName');

    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        userNameElement.textContent = currentUser;
    } else {
        window.location.href = 'index.html';
    }

    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('AeroCareRiskData');
        window.location.href = 'index.html';
    });

    calibrationForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const sabaBaseline = parseFloat(document.getElementById('saba-baseline').value);
        const isPollutionTrigger = document.getElementById('air').checked;

        const riskData = calculateRisk(sabaBaseline, isPollutionTrigger);
        localStorage.setItem('AeroCareRiskData', JSON.stringify(riskData));

        statusMsg.textContent = 'Calibration Complete. Generating Predictive Dashboard...';
        statusMsg.classList.remove('hidden', 'text-indigo-400');
        statusMsg.classList.add('text-green-500');

        setTimeout(() => {
            console.log('Redirecting to dashboard.html...');
            window.location.href = 'dashboard.html';
        }, 1500);
    });
});
