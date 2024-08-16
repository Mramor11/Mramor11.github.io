// script.js
document.getElementById('weight').addEventListener('input', function() {
    document.getElementById('weight-value').innerText = this.value;
});

document.getElementById('reps').addEventListener('input', function() {
    document.getElementById('reps-value').innerText = this.value;
});

document.getElementById('calculator-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const weight = parseFloat(document.getElementById('weight').value);
    const reps = parseFloat(document.getElementById('reps').value);

    if (!isNaN(weight) && !isNaN(reps)) {
        const oneRepMax = weight * (1 + (reps / 30));
        document.getElementById('result').innerText = `Your estimated 1 Rep Max is: ${oneRepMax.toFixed(2)} kg.`;
    } else {
        document.getElementById('result').innerText = 'Please enter valid numbers.';
    }
});
