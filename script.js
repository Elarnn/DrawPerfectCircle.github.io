document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("drawingCanvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const context = canvas.getContext("2d");
    const percent = document.getElementById("percent");
    const score = document.querySelector('.score')
    const scoreText = document.getElementById('score-text');
    const number = document.getElementById('score-number');
    const startButton = document.getElementById("startButton");
    const info = document.querySelector('.info');
    let centerX = canvas.width / 2;
    let centerY = canvas.height / 2;
    let inputArr = [];
    let firstInput = true;
    let isDrawing = false;
    let radius = 0;
    let bestScore = 0;
    let color;
    let timer;

    function startDrawing(e) {
        e.preventDefault();
        restart();
        isDrawing = true;
        draw(e);
        startTimer();
    }

    function stopDrawing() {
        isDrawing = false;
        context.stroke();
        context.beginPath();

        showBestScore();
        clearTimeout(timer)
    }
    

    function draw(e) {
        e.preventDefault(); 
        if (!isDrawing) return;

        //check event if it is touch 
        const isTouch = e.type === 'touchmove' || e.type === 'touchstart' || e.type === 'touchend';
        const mouseX = isTouch ? e.touches[0].clientX - canvas.offsetLeft : e.clientX - canvas.offsetLeft;
        const mouseY = isTouch ? e.touches[0].clientY - canvas.offsetTop : e.clientY - canvas.offsetTop;


        color = calculate(mouseX, mouseY);
        //checkRadius(radius, mouseX, mouseY);

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
    canvas.addEventListener("mousemove", draw);

    canvas.addEventListener("touchstart", startDrawing);
    canvas.addEventListener("touchmove", draw);


    function calculate(mouseX, mouseY) {
        const input = Math.sqrt(Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2));

        if (firstInput) {
            info.style.display = 'none';
            percent.style.display = 'block'
            radius = input;
            firstInput = false;
        }

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

    startButton.addEventListener("click", function () {
        startButton.style.display = 'none';
        document.querySelector('.overlay').style.display = 'none';
        info.style.display = 'block';
        canvas.style.pointerEvents = 'auto';
    });

    function restart() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        canvas.addEventListener("mouseup", stopDrawing);
        canvas.addEventListener("touchend", stopDrawing);
        inputArr = [];
        firstInput = true;
        sum = 0;
        score.style.display = 'none';
        // context.shadowBlur = 0;
        // context.shadowColor = "transparent";
    }

    // const checkRadius = (radius, mouseX, mouseY) => {
    //     if (radius < 50) {
    //         canvas.removeEventListener('mouseup', stopDrawing);
    //         canvas.removeEventListener("touchend", stopDrawing);
    //         scoreText.style.display = 'block';
    //         scoreText.innerHTML = 'Too close to dot';
    //         isDrawing = false;
    //     }
    // }

    const startTimer = () => {
        timer = setTimeout(() => {
            isDrawing = false;
            context.stroke();
            context.beginPath();
            percent.innerText = 'XX.X%';
            percent.style.color = '#ff0000'
            score.style.display = 'block';
            scoreText.innerHTML = 'Too slow';
            canvas.removeEventListener('mouseup', stopDrawing);
            canvas.removeEventListener("touchend", stopDrawing);
        }, 8000);
        
    }

    function showBestScore() {
        score.style.display = 'block';
        number.style.color = color;

        if (parseFloat(percent.innerText) > bestScore) {
            bestScore = parseFloat(percent.innerText);
            scoreText.innerHTML = 'New best score'
            number.innerHTML = '';
         }
         else {
            scoreText.innerHTML = 'Best: '
            number.innerHTML = bestScore + '%';
         }
    }

    window.addEventListener("resize", function () {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        centerX = canvas.width / 2;
        centerY = canvas.height / 2;
    });
});