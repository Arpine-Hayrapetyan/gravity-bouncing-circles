const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const restartButton = document.getElementById('restart-button') as HTMLButtonElement;
const ctx = canvas.getContext('2d')!;

let circles: Circle[] = [];

const gravity: number = 11;
const damping: number = 0.8;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

restartButton.addEventListener("click", function () {
    circles = [];
});

class Circle {
    x: number;
    y: number;
    radius: number;
    color: string;
    velocityY: number;

    constructor(x: number, y: number, radius: number, color: string) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocityY = 0;
    }

    draw(): void {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    update(deltaTime: number): void {
        this.velocityY += gravity * deltaTime;
        this.y += this.velocityY;

        if (this.y + this.radius > canvas.height) {
            this.y = canvas.height - this.radius;
            this.velocityY *= -damping;
        }

        this.draw();
    }
}

function spawnCircle(x: number, y: number): void {
    const radius: number = 20;
    const color: string = getRandomColor();
    const circle: Circle = new Circle(x, y, radius, color);
    circles.push(circle);
}

function getRandomColor(): string {
    const letters: string = '0123456789ABCDEF';
    let color: string = '#';
    for (let i: number = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

let lastTime: number;
function tick(currentTime: number): void {
    const deltaTime: number = (currentTime - lastTime) / 1000;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    circles.forEach(circle => {
        circle.update(deltaTime);
    });

    lastTime = currentTime;
    requestAnimationFrame(tick);
}

requestAnimationFrame((currentTime: number) => {
    lastTime = currentTime;
    tick(currentTime);
});

canvas.addEventListener('click', (e: MouseEvent) => {
    const mouseX: number = e.clientX;
    const mouseY: number = e.clientY;

    if (circles.length < 15) {
        spawnCircle(mouseX, mouseY);
    }
});
