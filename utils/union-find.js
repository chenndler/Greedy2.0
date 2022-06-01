module.exports = class UnionFind {
	constructor(nodes) {
		// this.root = new Array(n).fill(null).map((x, idx) => idx);
		this.roots = nodes.reduce((map, node) => {
			map[node] = node;
			return map;
		}, {});

		// this.rank = new Array(n).fill(1);
		this.rank = nodes.reduce((map, node) => {
			map[node] = 1;
			return map;
		}, {});
		// this.vertexCount = n;
		this.vertexCount = nodes.length;
	}
	find(v) {
		if (v === this.roots[v]) {
			return v;
		}
		this.roots[v] = this.find(this.roots[v]);
		return this.roots[v];
	}
	union(v1, v2) {
		const r1 = this.find(v1),
			r2 = this.find(v2);

		if (r1 === r2) {
			return;
		}
		if (this.rank[r1] > this.rank[r2]) {
			this.roots[r2] = r1;
		} else if (this.rank[r1] < this.rank[r2]) {
			this.roots[r1] = r2;
		} else {
			this.roots[r2] = r1;
			this.rank[r1] += 1;
		}
	}
}