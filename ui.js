const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");

const spinSound = document.getElementById("spinSound");
const resultSound = document.getElementById("resultSound");
const buildBtn = document.getElementById("buildBtn");
const spinBtn = document.getElementById("spinBtn");
const soundToggle = document.getElementById("soundToggle");
const resultEl = document.getElementById("result");

function drawWheelUI() {
  const radius = canvas.width / 2;
  const slice = (2 * Math.PI) / options.length;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  options.forEach((opt, i) => {
    ctx.beginPath();
    ctx.moveTo(radius, radius);
    ctx.arc(radius, radius, radius, angle + i * slice, angle + (i + 1) * slice);
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

// Button events
buildBtn.addEventListener("click", () => {
  const userInput = document.getElementById("input").value;
  const valid = buildWheelLogic(userInput);
  if (valid) drawWheelUI();
  resultEl.innerText = "";
});

spinBtn.addEventListener("click", () => {
  if (options.length === 0) return;

  if (soundToggle.checked) {
    spinSound.currentTime = 0;
    spinSound.loop = true;
    spinSound.volume = 0.4;
    spinSound.play();
  }

  spinWheelLogic((winner) => {
    if (soundToggle.checked) {
      spinSound.pause();
      resultSound.currentTime = 0;
      resultSound.play();
    }
    resultEl.innerText = "👉 Do this now: " + winner;
  });

  function animateSpin() {
    drawWheelUI();
    if (spinning) requestAnimationFrame(animateSpin);
  }
  animateSpin();
});
