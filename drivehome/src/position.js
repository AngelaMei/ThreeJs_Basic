import { SHAPE } from './track.js'

const directionToAngle = (direction) => {
  if (direction.x == 1 && direction.z == 0) return 0;
  else if (direction.x == 0 && direction.z == 1) return -Math.PI / 2;
  else if (direction.x == -1 && direction.z == 0) return Math.PI;
  else if (direction.x == 0 && direction.z == -1) return Math.PI / 2;
}

export const getPosition = (trackManager, elapsedTime) => {
  const speed = 20;
  const tracks = trackManager.getTracks()
  let total_time = 0;

  // Calculate the runtime
  for (let i = 0; i < tracks.length; i++) {
    const track = tracks[i];
    if (track.shape == SHAPE.STRAIGHT) {
      total_time += track.size / speed;
    } else if (track.shape == SHAPE.RIGHT_CURVE || track.shape == SHAPE.LEFT_CURVE) {
      total_time += Math.PI * track.size / (speed * 2);
    }
  }

  elapsedTime = elapsedTime - Math.floor(elapsedTime / total_time) * total_time;

  // console.log(elapsedTime, total_time);

  let position = {
    x: 0,
    z: 0,
    y: 0,
  };

  let direction = {
    x: 1, // -1, 0, 0
    z: 0, // 0, -1, 1
  };

  // Update car position
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

    position = { ...track.position };
    direction = { ...track.direction };
    position.y = directionToAngle(direction);

    // Check if the car is on this track
    if (timePassed + timeNeeded > elapsedTime) {
      const timeLeft = elapsedTime - timePassed;

      if (track.shape == SHAPE.STRAIGHT) {
        position.x += direction.x * speed * timeLeft;
        position.z += direction.z * speed * timeLeft;

      } else if (track.shape == SHAPE.RIGHT_CURVE) {
        const portion = timeLeft / timeNeeded * (Math.PI / 2);

        position.x += direction.x * Math.sin(portion) * track.size;
        position.z += direction.z * Math.sin(portion) * track.size;
        position.y -= portion;

        direction = {
          x: -direction.z,
          z: direction.x,
        };

        position.x += direction.x * (1 - Math.cos(portion)) * track.size;
        position.z += direction.z * (1 - Math.cos(portion)) * track.size;

      } else if (track.shape == SHAPE.LEFT_CURVE) {
        const portion = timeLeft / timeNeeded * (Math.PI / 2);

        position.x += direction.x * Math.sin(portion) * track.size;
        position.z += direction.z * Math.sin(portion) * track.size;
        position.y += portion;

        direction = {
          x: direction.z,
          z: -direction.x,
        };

        position.x += direction.x * (1 - Math.cos(portion)) * track.size;
        position.z += direction.z * (1 - Math.cos(portion)) * track.size;
      }

      return position;
    }

    // Update time after this track
    timePassed += timeNeeded;
  }
  return { x: 0, z: 0, y: 0};
}
