import BallJoint from './BallJoint';
import Vector3Range from './../../math/Vector3Range';

export default class AnkleJoint extends BallJoint {
  public constructor(name: string, imageX: number, imageY: number) {
    super(name, imageX, imageY);
    this.setJointType(BallJoint.BALLJOINT_ANKLE);
  }
  /**
   * @type - Radian
   */
  public getRotationalBounds(): Vector3Range {
    const range = new Vector3Range();

    range.x(this.degToRad(-45), this.degToRad(45));
    range.y(this.degToRad(-30), this.degToRad(30));
    range.z(this.degToRad(-10), this.degToRad(10));

    return range;
  }
  private degToRad(deg: number) {
    return deg * (Math.PI / 180);
  }
}
