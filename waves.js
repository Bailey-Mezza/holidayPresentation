
var canvas = document.getElementById('introCanvas');

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;


var content = canvas.getContext('2d');

content.fillStyle = 'rgb(184, 191, 158)';
content.fillRect(0, 0, canvas.width, canvas.height);

//variables
mouse = {
    x: canvas.width / 2,
    y: canvas.height / 2
}

var colorArray = [
    'rgb(55, 0, 255)',
    'rgb(69, 49, 143)',
    'rgb(135, 102, 252)'
]

const noise = new Noise(Math.random());

let time = 0;

//event listeners
addEventListener('mousemove',
    event => {
        mouse.x = event.x;
        mouse.y = event.y;
    })

addEventListener('resize',
    () => {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

    })

//Utility Functions
function randomIntFromRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function getDistance(x1, y1, x2, y2) {
    let xDistance = x2 - x1;
    let yDistance = y2 - y1;

    return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}

//Objects
class Particle {
    constructor(particle) {
        this.x = particle.x;
        this.y = particle.y;
        this.radius = particle.radius;
        this.velocity = { x: particle.velocity.x, y: particle.velocity.y };
        this.color = colorArray[randomIntFromRange(0, colorArray.length - 1)];
        this.prevX = this.x;
        this.prevY = this.y;
    }

    draw() {
        content.beginPath();
        content.moveTo(this.prevX, this.prevY);
        content.lineTo(this.x, this.y);
        content.strokeStyle = this.color;
        content.lineWidth = 1;
        content.stroke();
        content.closePath();
    }

    update() {
        this.prevX = this.x;
        this.prevY = this.y;

        const angle = getFlowAngle(this.x, this.y);

        // Calculate desired direction from angle
        const flowVelocity = {
            x: Math.cos(angle),
            y: Math.sin(angle)
        };

        // Smoothly steer toward flow direction
        const steerStrength = 0.1;
        this.velocity.x += (flowVelocity.x - this.velocity.x) * steerStrength;
        this.velocity.y += (flowVelocity.y - this.velocity.y) * steerStrength;

        // Move particle

        if (this.x > canvas.width + 50) {
            this.x = -10;
            this.y = Math.random() * (canvas.height);
            this.prevX = this.x;
            this.prevY = this.y;
        } else if (this.y > canvas.height + 50) {
            this.x = Math.random() * (canvas.width);
            this.y = -10;
            this.prevX = this.x;
            this.prevY = this.y;
        } else if (this.x < 0) {
            this.x = canvas.width + 10;
            this.y = Math.random() * (canvas.height);
            this.prevX = this.x;
            this.prevY = this.y;
        } else if (this.y < -50) {
            this.x = Math.random() * (canvas.width);
            this.y = canvas.height + 10;
            this.prevX = this.x;
            this.prevY = this.y;
        }




        this.draw();

    }
}

function drawField() {
    let xOffset = 0;
    const increment = 0.1;

    for (let x = 0; x < canvas.width; x += 50) {
        let yOffset = 0;
        for (let y = 0; y < canvas.height; y += 50) {
            const noiseValue = getFlowAngle(x, y);

            content.save();
            content.translate(x, y);
            content.rotate(noiseValue);
            content.beginPath();
            content.moveTo(0, 0);
            content.lineTo(20, 0);
            content.stroke();
            content.restore();

            yOffset += increment;
        }
        xOffset += increment;
    }
}

function getFlowAngle(x, y) {
    const increment = 0.1;
    const spacing = 50;

    const xIndex = Math.floor(x / spacing);
    const yIndex = Math.floor(y / spacing);

    const xOffset = xIndex * increment;
    const yOffset = yIndex * increment;

    // Generate noise-based angle
    let angle = noise.perlin3(xOffset, yOffset, time);

    // Map noise (-1 to 1) to angle (π/2 to 3π/2)
    angle = ((angle + 1) / 2) * Math.PI; // Maps to [0, π]
    angle += Math.PI / 2; // Shift to [π/2, 3π/2]

    return angle;
}



let particles;
//Implementation
function init() {
    particles = [];

    for (let index = 0; index < 10000; index++) {
        particles.push
            (new Particle(
                {
                    x: canvas.width * Math.random(),
                    y: canvas.height * Math.random(),
                    radius: 5,
                    velocity: {
                        x: Math.random(),
                        y: Math.random()
                    }
                }
            )
            )
    }
}

//Animate loop
function animate() {
    requestAnimationFrame(animate);
    content.fillStyle = 'rgba(247, 247, 247, 0.02)';
    content.fillRect(0, 0, canvas.width, canvas.height);

    console.log(colorArray);
    

    time += 0.005;
    //drawField();
    // console.log(particles);

    particles.forEach(particle => {
        particle.update();
    });
}

init();
animate();