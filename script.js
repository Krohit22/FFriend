let highestZ = 1;

class Paper {
  holdingPaper = false;
  mouseTouchX = 0;
  mouseTouchY = 0;
  mouseX = 0;
  mouseY = 0;
  prevMouseX = 0;
  prevMouseY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  // Common handler to normalize mouse and touch events
  getEventData(e) {
    if (e.type.includes('touch')) {
      return {
        clientX: e.touches[0].clientX,
        clientY: e.touches[0].clientY,
      };
    } else {
      return {
        clientX: e.clientX,
        clientY: e.clientY,
      };
    }
  }

  init(paper) {
    const onMove = (e) => {
      const { clientX, clientY } = this.getEventData(e);
      if (!this.rotating) {
        this.mouseX = clientX;
        this.mouseY = clientY;

        this.velX = this.mouseX - this.prevMouseX;
        this.velY = this.mouseY - this.prevMouseY;
      }

      const dirX = clientX - this.mouseTouchX;
      const dirY = clientY - this.mouseTouchY;
      const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
      const dirNormalizedX = dirX / dirLength;
      const dirNormalizedY = dirY / dirLength;

      const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
      let degrees = (180 * angle) / Math.PI;
      degrees = (360 + Math.round(degrees)) % 360;
      if (this.rotating) {
        this.rotation = degrees;
      }

      if (this.holdingPaper) {
        if (!this.rotating) {
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;
        }
        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;

        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      }
    };

    const onStart = (e) => {
      if (this.holdingPaper) return;
      const { clientX, clientY } = this.getEventData(e);
      this.holdingPaper = true;

      paper.style.zIndex = highestZ;
      highestZ += 1;

      this.mouseTouchX = clientX;
      this.mouseTouchY = clientY;
      this.prevMouseX = clientX;
      this.prevMouseY = clientY;

      if (e.type === 'mousedown' && e.button === 2) {
        this.rotating = true;
      }
    };

    const onEnd = () => {
      this.holdingPaper = false;
      this.rotating = false;
    };

    // Add both mouse and touch listeners
    paper.addEventListener('mousedown', onStart);
    paper.addEventListener('touchstart', onStart);
    document.addEventListener('mousemove', onMove);
    document.addEventListener('touchmove', onMove);
    window.addEventListener('mouseup', onEnd);
    window.addEventListener('touchend', onEnd);
  }
}

const papers = Array.from(document.querySelectorAll('.paper'));

papers.forEach((paper) => {
  const p = new Paper();
  p.init(paper);
});

// Button click to navigate to another page
document.getElementById('btn').addEventListener('click', function () {
  this.classList.add('fixed'); // Stops transformations and fixes the position

  console.log('Button clicked, navigating to another page.'); // Debugging

  setTimeout(() => {
    window.location.href = './moon1.html'; // Navigate to the next page
  }, 300); // Delay before navigation
});
