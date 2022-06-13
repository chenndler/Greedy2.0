const generateRandomGraph = (numberOfNodes, first) => {
    nodes = [];
    for (let i = 0; i < numberOfNodes; i++) {
        nodes.push(generateRandomNode(i, first));
    }
    return { nodes };
}

const generateRandomNode = (index, first) => {
    const node = { group: "nodes", data: { id: `n${index + first}`}, position: generateRandomPosition() };
    return node;
}

const generateRandomPosition = () => {
    x = Math.random() * 900 + 100
    y = Math.random() * 400 + 100
    return {x, y};
}

module.exports = {generateRandomGraph, generateRandomNode};
