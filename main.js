/* &&&& Game-Settings: Variables, Constants &&&& */

var canvas,
 ctx;

var pongXAxis = 50,
 pongYAxis = 50,
 pongVelocity_XAxis = 10,
 pongVelocity_YAxis = 4;

var paddleYAxis_st = 250,
  paddleYAxis_nd = 250,
  paddleScore_st = 0, 
  paddleScore_nd = 0;

var showingWinScreen = false;

const PADDLE_THICKNESS = 10;
const PADDLE_HEIGHT = 100;
const WINNING_SCORE = 6;
const FRAMES_PER_SECOND = 30;


function calculateMousePos(evt) {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;
  var mouseX = evt.clientX - rect.left - root.scrollLeft;
  var mouseY = evt.clientY - rect.top - root.scrollTop;
  return {
    x: mouseX,
    y: mouseY,
  };
}

function handleMouseClick(event) {
  if(showingWinScreen) {
    paddleScore_st = 0;
    paddleScore_nd = 0;
    showingWinScreen = false;
  }  
}

window.onload = function () {
  canvas = document.getElementById("gameCanvas");
  ctx = canvas.getContext("2d");

  setInterval(function () {
    buildMovement();
    buildSchema();
  }, 1000 / FRAMES_PER_SECOND);

  canvas.addEventListener("mousedown", handleMouseClick);

  canvas.addEventListener("mousemove", function (evt) {
    var mousePos = calculateMousePos(evt);
    paddleYAxis_st = mousePos.y - PADDLE_HEIGHT / 2;
  });

  document.addEventListener("keydown", function (event) {
    if (event.keyCode == 40) {
      paddleYAxis_st += 6;
    } else if (event.keyCode == 38) {
      paddleYAxis_st -= 6;
    }
  });
  
};

function pongRestart() {
  if(paddleScore_nd >= WINNING_SCORE || paddleScore_st >= WINNING_SCORE) {  
    showingWinScreen = true;
  }
  pongVelocity_XAxis = -pongVelocity_XAxis;
  pongXAxis = canvas.width / 2;
  pongYAxis = canvas.height / 2;
}

/* &&&& Game-Build Functions: Movement and Schematic &&&& */

function buildComputerMovement() {
  var paddleYCenter_nd = paddleYAxis_nd + (PADDLE_HEIGHT / 2);
if (paddleYCenter_nd < pongYAxis - 35) {
  paddleYAxis_nd += 6;
} else if(paddleYCenter_nd > pongYAxis + 35) {
  paddleYAxis_nd -= 6;
}
}

function buildMovement() {
  if(showingWinScreen) return;
  buildComputerMovement();

  pongXAxis += pongVelocity_XAxis;
  pongYAxis += pongVelocity_YAxis;

  if (pongXAxis < 0) {
    if (
      pongYAxis > paddleYAxis_st &&
      pongYAxis < paddleYAxis_st + PADDLE_HEIGHT
    ) {
      pongVelocity_XAxis = -pongVelocity_XAxis;
      pongVelocity_YAxis = [pongYAxis - (paddleYAxis_st + PADDLE_HEIGHT / 2)] * 0.35; // delta-YAxis
    } else {
      paddleScore_nd++;
      pongRestart();
    }
  }
  if (pongXAxis > canvas.width) {
    if (
      pongYAxis > paddleYAxis_nd &&
      pongYAxis < paddleYAxis_nd + PADDLE_HEIGHT
    ) {
      pongVelocity_XAxis = -pongVelocity_XAxis;
      pongVelocity_YAxis = [pongYAxis - (paddleYAxis_nd + PADDLE_HEIGHT / 2)] * 0.35; // delta-YAxis
    } else {
      paddleScore_st++;
      pongRestart();
    }
  }
  if (pongYAxis < 0 || pongYAxis > canvas.height) {
    pongVelocity_YAxis = -pongVelocity_YAxis;
  }
}

function buildSchema() {
  renderRect(0, 0, canvas.width, canvas.height, "black");
  if(showingWinScreen) {
    renderText(`${paddleScore_st >= WINNING_SCORE ? 'Right' : 'Left'} WON!`, 350, 200, 25);
    renderText(`Press any key to continue`, 320, 220, 17);
    return;
  }
  renderRect(0, paddleYAxis_st, PADDLE_THICKNESS, PADDLE_HEIGHT, "white");
  renderRect(canvas.width - PADDLE_THICKNESS, paddleYAxis_nd, PADDLE_THICKNESS, PADDLE_HEIGHT, "white");
  renderNet();
  renderPong(pongXAxis, pongYAxis, 10, "white");
  renderText(('0'+paddleScore_st).slice(-2), (canvas.width / 2) - 40, 50, 30);
  renderText(('0'+paddleScore_nd).slice(-2), (canvas.width / 2) + 5, 50, 30);
}

/* &&&& Rendering Functions &&&& */

function renderRect(leftX, topY, width, height, drawColor) {
  ctx.fillStyle = drawColor;
  ctx.fillRect(leftX, topY, width, height);
}

function renderNet() {
  for(var i = 0; i < canvas.height; i += 40) 
  renderRect((canvas.width / 2) - 1, i, 2, 20, 'white');
}

function renderPong(centerX, centerY, radius, drawColor) {
  ctx.fillStyle = drawColor;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
  ctx.fill();
}

function renderText(text, xAxis, yAxis, fontsize) {
  ctx.font = `${fontsize}px Share Tech Mono`;
  ctx.fillStyle = "white";
  ctx.fillText(text, xAxis, yAxis);
}