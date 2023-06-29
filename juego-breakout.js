const WIDTH = 1200;
const HEIGHT = 800;
const MARGIN = 10;

const FPS = 60;
const TIME_INCREMENT = 1000 / FPS;

const N_ROWS = 6;
const N_COLUMNS = 10;

const PLAYER_STEP = 10;

const COLORS = ['red', 'yellow', 'green'];

const blocks = [];

const x0 = 55;
const y0 = 60;
const deltaX = 110;
const deltaY = 40;

const projectile = {
  x: 550,
  y: 500,
  vx: 2,
  vy: 2,
  height: 15,
  width: 15,
}

const player = {
  x: 550,
  y: 750,
  height: 20,
  width: 200,
  action: {
    ArrowRight: () => {
      const maxX = WIDTH + MARGIN - player.width;

      player.x += PLAYER_STEP;

      if (player.x >= maxX) {
        player.x = maxX;
      }

    },
    ArrowLeft: () => {
      const minX = MARGIN;

      player.x -= PLAYER_STEP;

      if (player.x < + minX) {
        player.x = minX;
      }
    }
  }
}

for (let i = 0; i < N_ROWS; i++) {
  let color = COLORS[i % 3];
  for (let j = 0; j < N_COLUMNS; j++) {
    const block = {
      id: `block-${i}-${j}`,
      x: x0 + j * deltaX,
      y: y0 + i * deltaY,
      color,
      height: 20,
      width: 100,
    }
    blocks.push(block)
  }
}

const elementsHTML = [];
for (const { id, x, y, color } of blocks) {
  const blockHTML = `<div id="${id}" class="${color} block" style="top: ${y}px; left: ${x}px"></div>`;
  elementsHTML.push(blockHTML);
}
const playerHTML = `<div class="player" style="top: ${player.y}px; left: ${player.x}px"></div>`;
elementsHTML.push(playerHTML);
const projectileHTML = `<div class="projectile" style="top: ${projectile.y}px; left: ${projectile.x}px"></div>`;
elementsHTML.push(projectileHTML);
document.querySelector('div.game-board').insertAdjacentHTML('afterBegin', elementsHTML.join(''));

document.onkeydown = function (event) {
  const { key } = event;

  player.action[key]();

  document.querySelector('div.player').style.top = `${player.y}px`;
  document.querySelector('div.player').style.left = `${player.x}px`;
}

function collision(body1, body2) {
  return body1.x <= body2.x && body2.x <= body1.x + body1.width && body1.y <= body2.y && body2.y <= body1.y + body1.height
    || body1.x <= body2.x + body2.width && body2.x + body2.width <= body1.x + body1.width && body1.y <= body2.y && body2.y <= body1.y + body1.height
    || body1.x <= body2.x + body2.width && body2.x + body2.width <= body1.x + body1.width && body1.y <= body2.y + body2.height && body2.y + body2.height <= body1.y + body1.height
    || body1.x <= body2.x && body2.x <= body1.x + body1.width && body1.y <= body2.y + body2.height && body2.y + body2.height <= body1.y + body1.height
    || body2.x <= body1.x && body1.x <= body2.x + body2.width && body2.y <= body1.y && body1.y <= body2.y + body2.height
    || body2.x <= body1.x + body1.width && body1.x + body1.width <= body2.x + body2.width && body2.y <= body1.y && body1.y <= body2.y + body2.height
    || body2.x <= body1.x + body1.width && body1.x + body1.width <= body2.x + body2.width && body2.y <= body1.y + body1.height && body1.y + body1.height <= body2.y + body2.height
    || body2.x <= body1.x && body1.x <= body2.x + body2.width && body2.y <= body1.y + body1.height && body1.y + body1.height <= body2.y + body2.height
}

function collisionDirection(projectile, obstacle) {
  const projectilePoint1 = {
    x: projectile.x,
    y: projectile.y,
  };

  const projectilePoint2 = {
    x: projectile.x + projectile.width,
    y: projectile.y + projectile.height,
  };

  const obstacleBottomEdgeFacePoints = [
    {
      x: obstacle.x,
      y: obstacle.y + obstacle.height,
    },
    {
      x: obstacle.x + obstacle.width,
      y: obstacle.y + obstacle.height,
    },
  ];

  const obstacleRightEdgeFacePoints = [
    {
      x: obstacle.x + obstacle.width,
      y: obstacle.y,
    },
    {
      x: obstacle.x + obstacle.width,
      y: obstacle.y + obstacle.height
    },
  ];

  const obstacleTopEdgeFacePoints = [
    {
      x: obstacle.x,
      y: obstacle.y,
    },
    {
      x: obstacle.x + obstacle.width,
      y: obstacle.y,
    },
  ];

  const obstacleLeftEdgeFacePoints = [
    {
      x: obstacle.x,
      y: obstacle.y,
    },
    {
      x: obstacle.x,
      y: obstacle.y + obstacle.height
    },
  ];

  const bottomCollisionMatrix = [
    [projectilePoint1.x, projectilePoint1.y, 1],
    [obstacleBottomEdgeFacePoints[0].x, obstacleBottomEdgeFacePoints[0].y, 1],
    [obstacleBottomEdgeFacePoints[1].x, obstacleBottomEdgeFacePoints[1].y, 1],
  ];

  const topCollisionMatrix = [
    [projectilePoint2.x, projectilePoint2.y, 1],
    [obstacleTopEdgeFacePoints[0].x, obstacleTopEdgeFacePoints[0].y, 1],
    [obstacleTopEdgeFacePoints[1].x, obstacleTopEdgeFacePoints[1].y, 1],
  ];

  const leftCollisionMatrix = [
    [projectilePoint2.x, projectilePoint2.y, 1],
    [obstacleLeftEdgeFacePoints[0].x, obstacleLeftEdgeFacePoints[0].y, 1],
    [obstacleLeftEdgeFacePoints[1].x, obstacleLeftEdgeFacePoints[1].y, 1],
  ];

  const rightCollisionMatrix = [
    [projectilePoint1.x, projectilePoint1.y, 1],
    [obstacleRightEdgeFacePoints[0].x, obstacleRightEdgeFacePoints[0].y, 1],
    [obstacleRightEdgeFacePoints[1].x, obstacleRightEdgeFacePoints[1].y, 1],
  ];

  const bottomCollision = determinant(bottomCollisionMatrix);
  const topCollision = determinant(topCollisionMatrix);
  const leftCollision = determinant(leftCollisionMatrix);
  const rightCollision = determinant(rightCollisionMatrix);

  if (
    bottomCollision <= topCollision && bottomCollision <= leftCollision && bottomCollision <= rightCollision
    ||
    topCollision <= bottomCollision && bottomCollision <= leftCollision && bottomCollision <= rightCollision
  ) {
    return 'vertical';
  }

  return 'horizontal';
}

function didUserWin() {
  return blocks.length === 0;
}

function determinant(matrix) {
  if (matrix.length !== matrix[0].length) {
    throw new Error('The matrix must be square.');
  }

  if (matrix.length === 2 && matrix[0].length === 2) {
    return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
  }

  let result = 0;

  for (let i = 0; i < matrix.length; i++) {
    const subMatrix = [];
    for (let j = 1; j < matrix.length; j++) {
      subMatrix.push(matrix[j].filter((_, index) => index !== i));
    }

    const subDeterminant = determinant(subMatrix);

    result += (i % 2 === 0 ? 1 : -1) * matrix[0][i] * subDeterminant;
  }

  return result;
}

const interval = setInterval(() => {
  projectile.x += projectile.vx;
  projectile.y += projectile.vy;
  document.querySelector('.projectile').style.top = `${projectile.y}px`;
  document.querySelector('.projectile').style.left = `${projectile.x}px`;

  if (collision(projectile, player) || projectile.y <= 10) {
    projectile.vy = -projectile.vy;
  }

  if (projectile.x + projectile.width >= 1200 || projectile.x <= 10) {
    projectile.vx = -projectile.vx
  }

  for (const block of blocks) {
    if (collision(projectile, block)) {
      blocks.splice(blocks.indexOf(block), 1);
      document.querySelector(`#${block.id}`).style.display = 'none';
      if (didUserWin()) {
        clearInterval(interval);
        document.querySelector('#you-won').style.display = 'inline';
      }
      const direction = collisionDirection(projectile, block);
      if (direction == 'horizontal') {
        projectile.vx = -projectile.vx;
      }
      if (direction == 'vertical') {
        projectile.vy = -projectile.vy;
      }
    }
  }

  if (projectile.y + projectile.height >= HEIGHT + MARGIN) {
    clearInterval(interval);
    document.querySelector('#you-lost').style.display = 'inline';
  }
}, TIME_INCREMENT);