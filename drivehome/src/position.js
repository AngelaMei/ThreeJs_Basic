const SHAPE = {
  STRAIGHT: 0,
  RIGHT_CURVE: 1,
  LEFT_CURVE: 2,
};

const tracks = [
  { shape: SHAPE.STRAIGHT, size: 20 },
  { shape: SHAPE.RIGHT_CURVE, size: 10 },
  { shape: SHAPE.STRAIGHT, size: 30 },
  { shape: SHAPE.RIGHT_CURVE, size: 10 },
  { shape: SHAPE.STRAIGHT, size: 10 },
  { shape: SHAPE.RIGHT_CURVE, size: 10 },
  { shape: SHAPE.STRAIGHT, size: 10 },
  { shape: SHAPE.LEFT_CURVE, size: 10 },
  { shape: SHAPE.RIGHT_CURVE, size: 10 },
  { shape: SHAPE.RIGHT_CURVE, size: 10 },
];

export const getPosition = (elapsedTime) => {
  const speed = 20;
  let total_time = 0;
  for (let i = 0; i < tracks.length; i++) {
    const track = tracks[i];
    if (track.shape == SHAPE.STRAIGHT) {
      total_time += track.size / speed;
    } else if (track.shape == SHAPE.RIGHT_CURVE || track.shape == SHAPE.LEFT_CURVE) {
      total_time += Math.PI * track.size / (speed * 2);
    }
  }

  elapsedTime = elapsedTime - Math.floor(elapsedTime / total_time) * total_time;
  console.log(elapsedTime, total_time);

  let position = {
    x: 0,
    y: 0,
  };
  let direction = {
    x: 1, // -1, 0, 0
    y: 0, // 0, -1, 1
  };

  let timePassed = 0;
  for (let i = 0; i < tracks.length; i++) {
    const track = tracks[i];
    // Compute time needed to pass this track
    let timeNeeded;
    if (track.shape == SHAPE.STRAIGHT) {
      timeNeeded = track.size / speed;
    } else if (track.shape == SHAPE.RIGHT_CURVE || track.shape == SHAPE.LEFT_CURVE) {
      timeNeeded = Math.PI * track.size / (speed * 2);
    }

    // Check if the train is on this track
    if (timePassed + timeNeeded > elapsedTime) {
      const timeLeft = elapsedTime - timePassed;

      if (track.shape == SHAPE.STRAIGHT) {
        position.x += direction.x * speed * timeLeft;
        position.y += direction.y * speed * timeLeft;
      } else if (track.shape == SHAPE.RIGHT_CURVE) {
        const portion = timeLeft / timeNeeded * (Math.PI / 2);

        position.x += direction.x * Math.sin(portion) * track.size;
        position.y += direction.y * Math.sin(portion) * track.size;

        direction = {
          x: direction.y,
          y: -direction.x,
        };

        position.x += direction.x * (1 - Math.cos(portion)) * track.size;
        position.y += direction.y * (1 - Math.cos(portion)) * track.size;
      } else if (track.shape == SHAPE.LEFT_CURVE) {
        const portion = timeLeft / timeNeeded * (Math.PI / 2);

        position.x += direction.x * Math.sin(portion) * track.size;
        position.y += direction.y * Math.sin(portion) * track.size;

        direction = {
          x: -direction.y,
          y: direction.x,
        };

        position.x += direction.x * (1 - Math.cos(portion)) * track.size;
        position.y += direction.y * (1 - Math.cos(portion)) * track.size;
      }

      return position;
    }

    // Update time and position after this track
    timePassed += timeNeeded;
    if (track.shape == SHAPE.STRAIGHT) {
      position.x += direction.x * track.size;
      position.y += direction.y * track.size;
    } else if (track.shape == SHAPE.RIGHT_CURVE) {
      position.x += direction.x * track.size;
      position.y += direction.y * track.size;

      direction = {
        x: direction.y,
        y: -direction.x,
      };

      position.x += direction.x * track.size;
      position.y += direction.y * track.size;
    } else if (track.shape == SHAPE.LEFT_CURVE) {
      position.x += direction.x * track.size;
      position.y += direction.y * track.size;

      direction = {
        x: -direction.y,
        y: direction.x,
      };

      position.x += direction.x * track.size;
      position.y += direction.y * track.size;
    }
  }
  return { x: 0, y: 0 };
}
