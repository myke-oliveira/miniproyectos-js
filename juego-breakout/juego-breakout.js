const WIDTH = 1200;
const HEIGHT = 800;
const MARGIN = 10;

const FPS = 60;
const TIME_INCREMENT = 1000 / FPS;

const N_ROWS = 6;
const N_COLUMNS = 10;

const PLAYER_STEP = 10;

const COLORS = ['red', 'yellow', 'green'];

const x0 = 55;
const y0 = 60;
const deltaX = 110;
const deltaY = 40;

class Game {

  constructor() {

    this.projectile = {
      x: 550,
      y: 500,
      vx: 1,
      vy: 1,
      height: 15,
      width: 15,
    }

    this.player = {
      x: 550,
      y: 750,
      height: 20,
      width: 200,
      action: {
        ArrowRight: () => {
          const maxX = WIDTH + MARGIN - this.player.width;
    
          this.player.x += PLAYER_STEP;
    
          if (this.player.x >= maxX) {
            this.player.x = maxX;
          }
    
        },
        ArrowLeft: () => {
          const minX = MARGIN;
    
          this.player.x -= PLAYER_STEP;
    
          if (this.player.x < + minX) {
            this.player.x = minX;
          }
        }
      }
    }

    this.blocks = [];

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
        this.blocks.push(block)
      }
    }
  }

  drawBoard() {
    const elementsHTML = [];
    for (const { id, x, y, color } of this.blocks) {
      const blockHTML = `<div id="${id}" class="${color} block" style="top: ${y}px; left: ${x}px"></div>`;
      elementsHTML.push(blockHTML);
    }
    const playerHTML = `<div class="player" style="top: ${this.player.y}px; left: ${this.player.x}px"></div>`;
    elementsHTML.push(playerHTML);
    const projectileHTML = `<div class="projectile" style="top: ${this.projectile.y}px; left: ${this.projectile.x}px"></div>`;
    elementsHTML.push(projectileHTML);
    document.querySelector('div.game-board').insertAdjacentHTML('afterBegin', elementsHTML.join(''));
  }

  setUserControls() {
    document.onkeydown = (event) => {
      const { key } = event;
    
      this.player.action[key]();
    
      document.querySelector('div.player').style.top = `${this.player.y}px`;
      document.querySelector('div.player').style.left = `${this.player.x}px`;
    }
  }

  run() {
    const interval = setInterval(() => {
      this.projectile.x += this.projectile.vx;
      this.projectile.y += this.projectile.vy;
      document.querySelector('.projectile').style.top = `${this.projectile.y}px`;
      document.querySelector('.projectile').style.left = `${this.projectile.x}px`;
    
      if (this.collision(this.projectile, this.player) || this.projectile.y <= 10) {
        this.projectile.vy = -this.projectile.vy;
      }
    
      if (this.projectile.x + this.projectile.width >= 1200 || this.projectile.x <= 10) {
        this.projectile.vx = -this.projectile.vx
      }
    
      for (const block of this.blocks) {
        if (this.collision(this.projectile, block)) {
          this.blocks.splice(this.blocks.indexOf(block), 1);
          document.querySelector(`#${block.id}`).style.display = 'none';
          if (this.didUserWin()) {
            clearInterval(interval);
            document.querySelector('#you-won').style.display = 'inline';
          }
          const direction = this.collisionDirection(this.projectile, block);
          if (direction == 'horizontal') {
            this.projectile.vx = -this.projectile.vx;
          }
          if (direction == 'vertical') {
            this.projectile.vy = -this.projectile.vy;
          }
        }
      }
    
      if (this.projectile.y + this.projectile.height >= HEIGHT + MARGIN) {
        clearInterval(interval);
        document.querySelector('#you-lost').style.display = 'inline';
      }
    }, TIME_INCREMENT);
  }

  didUserWin() {
    return this.blocks.length === 0;
  }

  collision(body1, body2) {
    return body1.x <= body2.x && body2.x <= body1.x + body1.width && body1.y <= body2.y && body2.y <= body1.y + body1.height
      || body1.x <= body2.x + body2.width && body2.x + body2.width <= body1.x + body1.width && body1.y <= body2.y && body2.y <= body1.y + body1.height
      || body1.x <= body2.x + body2.width && body2.x + body2.width <= body1.x + body1.width && body1.y <= body2.y + body2.height && body2.y + body2.height <= body1.y + body1.height
      || body1.x <= body2.x && body2.x <= body1.x + body1.width && body1.y <= body2.y + body2.height && body2.y + body2.height <= body1.y + body1.height
      || body2.x <= body1.x && body1.x <= body2.x + body2.width && body2.y <= body1.y && body1.y <= body2.y + body2.height
      || body2.x <= body1.x + body1.width && body1.x + body1.width <= body2.x + body2.width && body2.y <= body1.y && body1.y <= body2.y + body2.height
      || body2.x <= body1.x + body1.width && body1.x + body1.width <= body2.x + body2.width && body2.y <= body1.y + body1.height && body1.y + body1.height <= body2.y + body2.height
      || body2.x <= body1.x && body1.x <= body2.x + body2.width && body2.y <= body1.y + body1.height && body1.y + body1.height <= body2.y + body2.height
  }

  collisionDirection(projectile, obstacle) {
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
  
    const bottomCollision = this.determinant(bottomCollisionMatrix);
    const topCollision = this.determinant(topCollisionMatrix);
    const leftCollision = this.determinant(leftCollisionMatrix);
    const rightCollision = this.determinant(rightCollisionMatrix);
  
    if (
      bottomCollision <= topCollision && bottomCollision <= leftCollision && bottomCollision <= rightCollision
      ||
      topCollision <= bottomCollision && bottomCollision <= leftCollision && bottomCollision <= rightCollision
    ) {
      return 'vertical';
    }
  
    return 'horizontal';
  }

  determinant(matrix) {
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
  
      const subDeterminant = this.determinant(subMatrix);
  
      result += (i % 2 === 0 ? 1 : -1) * matrix[0][i] * subDeterminant;
    }
  
    return result;
  }

}

const game = new Game();
game.drawBoard();
game.setUserControls();
game.run();