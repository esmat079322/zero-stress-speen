const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");

const spinSound = document.getElementById("spinSound");
const resultSound = document.getElementById("resultSound");

let options = [];
let angle = 0;
let spinning = false;

function buildWheel() {
  const text = document.getElementById("input").value.trim();
  options = text.split("\n").map(o => o.trim()).filter(o => o);

  if (options.length < 2) {
    alert("Enter at least 2 decisions.");
    return;
  }

  angle = 0;
  drawWheel();
  document.getElementById("result").innerText = "";
}

function drawWheel() {
  const radius = canvas.width / 2;
  const slice = (2 * Math.PI) / options.length;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  options.forEach((opt, i) => {
    ctx.beginPath();
    ctx.moveTo(radius, radius);
    ctx.arc(
      radius,
      radius,
      radius,
      angle + i * slice,
      angle + (i + 1) * slice
    );
    ctx.fillStyle = `hsl(${i * 360 / options.length}, 80%, 60%)`;
    ctx.fill();

    ctx.save();
    ctx.translate(radius, radius);
    ctx.rotate(angle + (i + 0.5) * slice);
    ctx.fillStyle = "#000";
    ctx.font = "bold 14px sans-serif";
    ctx.fillText(opt, radius / 2, 5);
    ctx.restore();
  });

  // pointer
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.moveTo(radius - 10, 0);
  ctx.lineTo(radius + 10, 0);
  ctx.lineTo(radius, 20);
  ctx.fill();
}

function spinWheel() {
  if (spinning || options.length === 0) return;

  spinning = true;

  spinSound.currentTime = 0;
  spinSound.loop = true;
  spinSound.volume = 0.4;
  spinSound.play();

  let speed = Math.random() * 0.4 + 0.3;

  function spin() {
    angle += speed;
    speed *= 0.97;
    drawWheel();

    if (speed < 0.002) {
      spinning = false;
      spinSound.pause();
      showResult();
      resultSound.currentTime = 0;
      resultSound.play();
      return;
    }
    requestAnimationFrame(spin);
  }

  spin();
}

function showResult() {
  const slice = (2 * Math.PI) / options.length;
  const index = Math.floor(
    ((2 * Math.PI - angle) % (2 * Math.PI)) / slice
  );
  document.getElementById("result").innerText =
    "👉 Do this now: " + options[index];
}
