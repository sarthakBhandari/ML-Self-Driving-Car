const utils = {
  linearInterp(left, right, percentageMoved) {
    return left + (right - left) * percentageMoved;
  },

  getIntersection(p, q, r, s) {
    //used linear algebra to figure out if two segments intersect
    //r1 = p + lambda*g1, r2 = r + mu*g2
    const [p1x, p1y, p2x, p2y] = [p.x, p.y, r.x, r.y];
    const [g1x, g1y, g2x, g2y] = [q.x - p.x, q.y - p.y, s.x - r.x, s.y - r.y];

    const mu =
      ((p2y - p1y) * g1x + (p1x - p2x) * g1y) / (g2x * g1y - g2y * g1x);
    const lambda =
      ((p1x - p2x) * g2y - (p1y - p2y) * g2x) / (g2x * g1y - g1x * g2y);

    if (mu >= 0 && mu <= 1 && lambda >= 0 && lambda <= 1) {
      return {
        x: p1x + lambda * g1x,
        y: p1y + lambda * g1y,
        offset: lambda,
      };
    }

    return null;
  },

  polysIntersect(polygon1, polygon2) {
    for (let i = 0; i < polygon1.length; i++) {
      const p1 = polygon1[i];
      const p2 = polygon1[(i + 1) % polygon1.length];
      for (let j = 0; j < polygon2.length; j++) {
        const q1 = polygon2[j];
        const q2 = polygon2[(j + 1) % polygon2.length];
        if (this.getIntersection(p1, p2, q1, q2)) return true;
      }
    }
  },

  keyMap(index) {
    if (index == 0) return "up";
    if (index == 1) return "left";
    if (index == 2) return "right";
    if (index == 3) return "down";
  },

  getRGBA(value) {
    const alpha = Math.abs(value);
    const R = value < 0 ? 0 : 255;
    const G = R;
    const B = value > 0 ? 0 : 255;
    return "rgba(" + R + "," + G + "," + B + "," + alpha + ")";
  },

  getRandomColor() {
    const hue = 290 + Math.random() * 260;
    return "hsl(" + hue + ", 100%, 60%)";
  },

  defaultBrain: `{"levels":[{"inputs":[0.5807742273574596,0.2202669499650023,0.0940660233192665,0,0],"outputs":[1,0,0,0,1,1],"biases":[0.009189593859342378,0.4328498820443524,0.5819438550867424,0.4033721463865969,-0.25226576134313905,-0.5244787717643649],"weights":[[0.6548059844195895,-0.46788528418018566,0.04510484596518243,0.05314620299160058,-0.3731769301943013,-0.7080197316135902],[0.6446595217700463,0.3266122694594745,0.5054438586114043,0.025230457854784435,-0.020018979884981122,-0.4510558475947226],[0.06417381584542099,-0.3902702368138689,-0.17389109035344613,0.35025607803494435,0.04622302441701877,0.37368066738391953],[-0.4319204564173984,0.12457544212994127,-0.1422260780082534,-0.19058692686645448,-0.35209122583927244,0.5832543162384298],[-0.8368741382201322,0.24707251848786468,-0.5399983437287577,0.13764491208678045,0.12881684636378526,0.22813095256223537]]},{"inputs":[1,0,0,0,1,1],"outputs":[1,1,1,0],"biases":[-0.4058303716987405,0.21485708891792674,-0.24505627781795397,0.31643200942363053],"weights":[[0.5399042871999169,-0.5394444330770805,0.6770635702972497,-0.5481771840182023],[0.17393853086708744,-0.31016630115652377,0.689413861693071,0.2892489851008777],[-0.44180277115204547,-0.05190910187863172,0.07002917547482854,0.6080315802018708],[-0.0049544237548197825,-0.42380708220456265,0.2042711215848801,-0.021022113434744805],[-0.17879799754349868,0.6057593272962009,0.049884475725295196,0.06842971526865141],[0.16844868581430184,0.3770097148922291,-0.5027013423544288,0.20694290211321203]]}]}`,
};
