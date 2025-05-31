function scrollToId() {
    let section = document.getElementById("SubSection");
    section.scrollIntoView({ behavior: 'smooth' });
}

let scrollLink = document.querySelector("#scroll-link");
scrollLink.addEventListener("click", scrollToId);

let scrollButton = document.querySelector("#scroll-button");
scrollButton.addEventListener("click", scrollToId);

let centerX = 300; // Centrato nel canvas 600x600
let centerY = 300;
let totalPoints = 0;
let hits = 0; // Tutti i colpi che colpiscono il bersaglio
let bullseyes = 0; // Solo i bullseye (centro)
let totalShots = 0;
let canvas;
let showStats = false;

function setup() {
    canvas = createCanvas(600, 600);
    canvas.parent('canvas');
    canvas.mousePressed(checkHit);
    noLoop();
    
    // Responsive canvas con centri corretti
    if (window.innerWidth < 768) {
        resizeCanvas(300, 300);
        centerX = 150;
        centerY = 150;
    } else if (window.innerWidth < 1024) {
        resizeCanvas(400, 400);
        centerX = 200;
        centerY = 200;
    }
}

function draw() {
    // Sfondo del contenitore: #ffdede convertito in RGB
    background(255, 222, 222);
    drawTarget(width / 2, height / 2, width * 0.8);
}

function drawTarget(x, y, size) {
    let colors = [
        color(240, 240, 240),  // White
        color(200, 200, 200),  // Light gray
        color(70, 130, 220),   // Blue
        color(220, 50, 50),    // Red
        color(255, 215, 0)     // Gold (centro)
    ];
    let rings = colors.length;
    let step = size / rings;
    
    // Draw rings from outside to inside
    for (let i = 0; i < rings; i++) {
        fill(colors[i]);
        stroke(40);
        strokeWeight(2);
        ellipse(x, y, size - step * i);
    }
    
    // Add crosshairs
    stroke(60);
    strokeWeight(1);
    line(x - size/2 + 20, y, x + size/2 - 20, y);
    line(x, y - size/2 + 20, x, y + size/2 - 20);
    
    // Add scoring rings indicators
    noFill();
    stroke(60);
    strokeWeight(1);
    for (let i = 1; i < rings; i++) {
        ellipse(x, y, size - step * i);
    }
}

function checkHit() {
    let d = dist(mouseX, mouseY, width/2, height/2); // Usa il centro effettivo del canvas
    let message = document.getElementById("message");
    let counter = document.getElementById("counter");
    let pointsDisplay = document.getElementById("points");
    let accuracyBar = document.getElementById("accuracy-bar");
    
    totalShots++;
    let score = 0;
    let feedback = "";
    
    let maxRadius = width * 0.4;
    
    if (d < maxRadius * 0.2) {
        score = 35;
        feedback = "Perfect shot! Bullseye!";
        hits++;
        bullseyes++; // Incrementa solo per i bullseye
    } else if (d < maxRadius * 0.4) {
        score = 25;
        feedback = "Excellent accuracy";
        hits++;
    } else if (d < maxRadius * 0.6) {
        score = 15;
        feedback = "Good shot";
        hits++;
    } else if (d < maxRadius * 0.8) {
        score = 10;
        feedback = "On target";
        hits++;
    } else if (d < maxRadius) {
        score = 5;
        feedback = "Target hit";
        hits++;
    }

    if (score > 0) {
        totalPoints += score;
        message.textContent = `${feedback} (+${score}pt)`;
        
        // Draw impact marker
        stroke(255, 255, 255);
        strokeWeight(3);
        line(mouseX - 8, mouseY, mouseX + 8, mouseY);
        line(mouseX, mouseY - 8, mouseX, mouseY + 8);
    } else {
        message.textContent = "Shot missed";
    }

    // Aggiorna il counter con i bullseye, non tutti i colpi
    counter.textContent = bullseyes;
    pointsDisplay.textContent = totalPoints;
    
    // Update accuracy bar basata sui colpi che colpiscono il bersaglio
    let accuracy = totalShots > 0 ? (hits / totalShots) * 100 : 0;
    accuracyBar.style.width = accuracy + '%';
}

function resetGame() {
    totalPoints = 0;
    hits = 0;
    bullseyes = 0;
    totalShots = 0;
    document.getElementById("message").textContent = "Click on the target to begin";
    document.getElementById("counter").textContent = "0";
    document.getElementById("points").textContent = "0";
    document.getElementById("accuracy-bar").style.width = "0%";
    redraw();
}

function windowResized() {
    if (window.innerWidth < 768) {
        resizeCanvas(300, 300);
        centerX = 150;
        centerY = 150;
    } else if (window.innerWidth < 1024) {
        resizeCanvas(400, 400);
        centerX = 200;
        centerY = 200;
    } else {
        resizeCanvas(600, 600);
        centerX = 300;
        centerY = 300;
    }
    redraw();
}