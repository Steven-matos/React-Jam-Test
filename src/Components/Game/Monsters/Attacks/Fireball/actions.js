import store from "../../../../../Config/store";
import {
  spriteSize,
  mapWidth,
  mapHeight,
} from "../../../../../Config/constants";

export default function actions(projectile) {
  const path = window.location.href.split("/");
  if (path[3] === "game") {
    setInterval(function () {
      const currentCD = store.getState().fireball.currentCD;
      const maxCD = store.getState().fireball.maxCD;
      const locked = store.getState().fireball.isLive;
      const magePos = store.getState().mage.position;
      const newFireballInfo = checkMove();
      hitPlayer();
      checkMove();
      if (locked) {
        store.dispatch({
          type: "move",
          payload: newFireballInfo,
        });
        if (currentCD == 0) {
          store.dispatch({
            type: "move",
            payload: {
              currentCD: 1,
              isLive: true,
            },
          });
        } else if (currentCD !== 0 && currentCD !== maxCD) {
          const newCD = currentCD + 1;
          store.dispatch({
            type: "move",
            payload: {
              currentCD: newCD,
            },
          });
        } else if (currentCD == maxCD) {
          store.dispatch({
            type: "move",
            payload: {
              currentCD: 0,
              isLive: false,
              position: [magePos[0] - spriteSize, magePos[1]],
            },
          });
        }
      }
    }, 250);
  }
  //gets new position for the mage if he is moving
  function getNewPosition(oldPos, direction) {
    switch (direction) {
      case "West":
        return [oldPos[0] - spriteSize, oldPos[1]];

      case "East":
        return [oldPos[0] + spriteSize, oldPos[1]];
    }
  }

  function checkPlayer(newPos) {
    const playerPos = store.getState().player.position;
    return playerPos < newPos || playerPos > newPos;
  }

  function hitPlayer() {
    const direction = store.getState().fireball.direction;
    const oldPos = store.getState().fireball.position;
    const newPos = getNewPosition(oldPos, direction);
    const hp = store.getState().player.hp;
    const att = store.getState().mage.att;
    if (!checkPlayer(newPos) && store.getState().fireball.isLive) {
      const newHp = hp - att;
      store.dispatch({
        type: "move_Player",
        payload: {
          hp: newHp,
        },
      });
      if (hp == 1) {
        alert("You're dead!!! Try Again!!!");
        window.location.reload();
      }
    }
  }

  function observeObstacles(oldPos, newPos) {
    const tiles = store.getState().map.tiles;
    const y = newPos[1] / spriteSize;
    const x = newPos[0] / spriteSize;
    const nextTile = tiles[y][x];
    return nextTile < 5;
  }

  //checks boundaries when the player moves
  function observeBoundaries(oldPos, newPos) {
    return newPos[0] >= 0 && newPos[0] <= mapWidth - spriteSize;
  }

  //moving function for the mage
  function checkMove() {
    const direction = store.getState().fireball.direction;
    const oldPos = store.getState().fireball.position;
    const fireballPos = store.getState().fireball.position;
    const mageDir = store.getState().mage.direction;
    const newPos = getNewPosition(oldPos, direction);
    const magePos = store.getState().mage.position;

    const isLive = store.getState().fireball.isLive;

    if (!isLive && mageDir == "West") {
      store.dispatch({
        type: "move",
        payload: {
          position: [magePos[0] - spriteSize, magePos[1]],
          direction: "West",
        },
      });
    } else if (!isLive && mageDir == "East") {
      store.dispatch({
        type: "move",
        payload: {
          position: [magePos[0] + spriteSize, magePos[1]],
          direction: "East",
        },
      });
    }

    if (direction == "East") {
      if (
        observeBoundaries(oldPos, newPos) &&
        observeObstacles(oldPos, newPos) &&
        checkPlayer(newPos)
      ) {
        return {
          position: [fireballPos[0] + spriteSize, fireballPos[1]],
        };
      } else {
        return {
          position: [magePos[0], magePos[1]],
          isLive: false,
        };
      }
    } else if (direction == "West") {
      if (
        observeBoundaries(oldPos, newPos) &&
        observeObstacles(oldPos, newPos) &&
        checkPlayer(newPos)
      ) {
        return {
          position: [fireballPos[0] - spriteSize, fireballPos[1]],
        };
      } else {
        return {
          position: [magePos[0], magePos[1]],
          isLive: false,
        };
      }
    }
  }

  return projectile;
}
