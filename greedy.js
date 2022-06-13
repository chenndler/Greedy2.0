const Graph = require('./utils/graph');
const UnionFind= require('./utils/union-find');

const calcultateDistance = (position1, position2) => {
    const xDiff = position1.x - position2.x;
    const yDiff = position1.y - position2.y;
    return Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
}

const getSortedEdges = (nodeIds, nodePositions) => {
    const edges = nodeIds.flatMap(
        (v, i) => nodeIds.slice(i+1).map( w => [v, w] )
    );
    
    edges.sort((a, b) => {
        const [a1, a2] = a;
        const [b1, b2] = b;
        const distanceA = calcultateDistance(nodePositions[a1], nodePositions[a2]);
        const distanceB = calcultateDistance(nodePositions[b1], nodePositions[b2]);
        return distanceA - distanceB;
    });

    return edges;
};

const calculateGreedy = (nodes, angle) => {
    const graph1 = new Graph(nodes, angle);
    const graph2 = new Graph(nodes, angle);

    const nodeIds = nodes.map((node) => node.id);
    const uf1 = new UnionFind(nodeIds);
    const uf2 = new UnionFind(nodeIds);

    const nodePositions = nodes.reduce((map, node) => {
        map[node.id] = node.position;
        return map;
    }, {});

    const edges = getSortedEdges(nodeIds, nodePositions);
    let weightGreedy = 0, weightMST = 0;
    const greedy = [];
    const mst = [];

    for (const edge of edges) {
        const [u, v] = edge;
        const weight = calcultateDistance(nodePositions[u], nodePositions[v]);

        if (uf1.find(u) != uf1.find(v) && graph1.canAddEdge(u,v)) {
            graph1.addEdge(u, v);
            uf1.union(u, v);
            greedy.push({
                group: "edges", 
                data: { 
                    source: u,
                    target: v 
                },
                style: { 'line-color': '#9bd8de' }
            });

            weightGreedy += weight;
        }

        if (uf2.find(u) != uf2.find(v)) {
            graph2.addEdge(u, v);
            uf2.union(u, v);
            mst.push({
                group: "edges", 
                data: { 
                    source: u,
                    target: v 
                },
                style: { 'line-color': '#eaa2a2' }
            });

            weightMST += weight;
        }
    }

    return {
        greedy, 
        mst,
        weights: {
            greedy: weightGreedy,
            mst: weightMST
        }
    };
};

module.exports = {calculateGreedy};
