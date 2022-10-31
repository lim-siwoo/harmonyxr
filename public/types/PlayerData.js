class PlayerData {
  constructor(camera, controller1, controller2) {
    this.position = {
      x: camera.position.x,
      y: camera.position.y,
      z: camera.position.z
    }
    this.rotation = {
      x: camera.rotation.x,
      y: camera.rotation.y,
      z: camera.rotation.z
    }
    this.controller1 = {
      position: {
        x: controller1.position.x,
        y: controller1.position.y,
        z: controller1.position.z,
      },
      rotation: {
        x: controller1.rotation.x,
        y: controller1.rotation.y,
        z: controller1.rotation.z,
      }
    }
    this.controller2 = {
      position: {
        x: controller2.position.x,
        y: controller2.position.y,
        z: controller2.position.z,
      },
      rotation: {
        x: controller2.rotation.x,
        y: controller2.rotation.y,
        z: controller2.rotation.z,
      }
    }
  }

};

export {PlayerData};