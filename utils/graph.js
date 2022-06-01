const calculateEdgeAngle = (sourcePos, targetPos) => {
  let angle = Math.atan2(sourcePos.y - targetPos.y, sourcePos.x - targetPos.x);
  angle = angle * 180 / Math.PI;
  return angle < 0 ? 360 + angle : angle;
};

const calculateAngle = (posX, posY, posZ) => {
  return calculateEdgeAngle(posX, posZ) - calculateEdgeAngle(posX, posY);
};


module.exports = class Graph {
    constructor(nodes, angle) {
      this.angle = angle;
      this.positions =nodes.reduce((map, node) => {
        map[node.id] = node.position;
        return map;
    }, {});
      this.adjacencyList = nodes.reduce((map, node) => {
        map[node.id] = [];
        return map;
    }, {});
    }
    getEdges(source) {
      return this.adjacencyList[source];
    }
    sortedIndex(source, target) {
      const edges = this.getEdges(source);
      const angle = calculateEdgeAngle(this.positions[source], this.positions[target]);
      let low = 0,high = edges.length;
    
      while (low < high) {
        let mid = low + high >>> 1;
        let midAngle = calculateEdgeAngle(this.positions[source], 
                                          this.positions[edges[mid]]);
        if (midAngle < angle) low = mid + 1;
        else high = mid;
      }
      return low;
    }
    calculateSourceAngle(source, edges) {
      let minAngle = calculateAngle(this.positions[source], 
                                    this.positions[edges[0]], 
                                    this.positions[edges.at(-1)]);
      for (let i = 0; i < edges.length - 1; i++) {
        const angle = calculateAngle(this.positions[source], 
                                     this.positions[edges[i]], 
                                     this.positions[edges[i+1]]);
        if (angle < minAngle) {
          minAngle = angle;
        }
      }
      return minAngle;
    }
    canAddDirectedEdge(source, target) {
      if (this.angle <= 0) {
        return false;
      }
      if (this.angle >= 360) {
        return true;
      } 
      
      const index = this.sortedIndex(source, target);
      const edges = [...this.getEdges(source)];
      edges.splice(index, 0, target);
      return this.calculateSourceAngle(source, edges) <= this.angle;
    }

    canAddEdge(u, v) {
      return this.canAddDirectedEdge(u,v) && this.canAddDirectedEdge(v,u);
    }

    addEdge(u, v) {
      const indexU = this.sortedIndex(v, u);
      const indexV = this.sortedIndex(u, v);
      this.getEdges(u).splice(indexV, 0, v);
      this.getEdges(v).splice(indexU, 0, u);
    }
  }