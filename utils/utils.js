const generateRandomGraph = (numberOfNodes) => {
    nodes = [];
    for (let i = 0; i < numberOfNodes; i++) {
        nodes.push(generateRandomNode(i));
    }
    return { nodes };
}

const generateRandomNode = (index) => {
    return { data: { id: `${index}` }, position: generateRandomPosition() };
}

const generateRandomPosition = () => {
    x = Math.random() * 900 + 100
    y = Math.random() * 400 + 100
    return {x, y};
}

module.exports = {generateRandomGraph, generateRandomNode};
