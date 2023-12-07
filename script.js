document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("drawingCanvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const context = canvas.getContext("2d");
    const percent = document.getElementById("percent");
    const score = document.querySelector('.score')
    let centerX = canvas.width / 2;
    let centerY = canvas.height / 2;
    let inputArr = [];
    let firstInput = true;
    let radius = 0;
    let bestScore = 0;
    let color;

    let isDrawing = false;

    function startDrawing(e) {
        restart();
        isDrawing = true;
        draw(e);
    }

    function stopDrawing() {
        isDrawing = false;
        context.stroke();
        context.beginPath();

        showBestScore();
    }

    function draw(e) {
        if (!isDrawing) return;

        const mouseX = e.clientX - canvas.offsetLeft;
        const mouseY = e.clientY - canvas.offsetTop;

        color = calculate(mouseX, mouseY);

        percent.style.color = color;

        context.shadowBlur = 10;
        context.shadowColor = color;

        context.lineWidth = 5;
        context.lineCap = "round";
        context.strokeStyle = color;

        context.lineTo(mouseX, mouseY);
        context.stroke();
        context.beginPath();
        context.moveTo(mouseX, mouseY);

    }

    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mousemove", draw);


    function calculate(mouseX, mouseY) {
        if (firstInput) {
            radius = Math.sqrt(Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2));
            firstInput = false;
        }

        const input = Math.sqrt(Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2));

        const deviation = (Math.pow(input - radius, 2));
        inputArr.push(deviation);

        let sum = inputArr.reduce(function (acc, currentValue) {
            return acc + currentValue;
        }, 0);
        const standartDeviation = (Math.sqrt(sum/inputArr.length));
        const inPercents = parseFloat((standartDeviation/radius * 100).toFixed(2));

        percent.innerText = (100-inPercents).toFixed(2) + '%';

        const green = 255 - (deviation/8); 
        const red = deviation/2;

        return `rgb(${red},${green},0)`;
    }

    function restart() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        inputArr = [];
        firstInput = true;
        sum = 0;
        score.style.display = 'none';
        // context.shadowBlur = 0;
        // context.shadowColor = "transparent";
    }

    const text = document.getElementById('text');
    const number = document.getElementById('score-number');
    function showBestScore() {
        score.style.display = 'block';
        number.style.color = color;

        if (parseFloat(percent.innerText) > bestScore) {
            bestScore = parseFloat(percent.innerText);
            text.innerHTML = 'New best score'
            number.innerHTML = '';
         }
         else {
            text.innerHTML = 'Best: '
            number.innerHTML = bestScore + '%';
         }
    }

    window.addEventListener("resize", function () {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        centerX = canvas.width / 2;
        centerY = canvas.height / 2;
    
        // console.log(`Центр холста: X = ${centerX}, Y = ${centerY}`);
    });
});