function wallsToGraph(w) {
    if (w.length < 2) return [];
    // const test = v1HigherThanv2(w[0], w[1])
    // console.log(test)
    const g = new Graph();
    for (let i = 0; i < w.length; i++) {
        for (let j = 0; j < w.length; j++) {
            if (i == j) continue
    //         // v1HigherThanv2(w[i], w[j])
            // console.log(i, j)
            if (v1HigherThanv2(w[i], w[j])) {
                // console.log("yay")
                g.addEdge(i, j);
            }
        }
    }
    return tsort(g.edges)
}

// returns true if v1 is higher than v2
function v1HigherThanv2(w1, w2) {
    // console.log(player.pos, w1.h)
    // console.log(w1.index, w2.index)
    // console.log(w1)
    // console.log(w2)

    // V2 Just the wall vector (v1header - v1pos)
    // Creating the vector is different so that we can check for intersections
    const W2ptoW2h = {  "pos": {    "x": player.pos.x + w2.p.x * w2.p.dist,
                                    "y": player.pos.y + w2.p.y * w2.p.dist },
                        "header": { "x": w2.h.x * w2.h.dist - w2.p.x * w2.p.dist,
                                    "y": w2.h.y * w2.h.dist - w2.p.y * w2.p.dist,
                                    "length": null},
                    };
    W2ptoW2h.header.length = vectorDist(W2ptoW2h.header.x, W2ptoW2h.header.y)
    // W2ptoW2h.header.length = vectorDist(
    //     W2ptoW2h.header.x, W2ptoW2h.header.y
    // )
    // console.log(w1.h)

    // V1 Just the wall vector (v1header - v1pos)
    // Creating the vector is different so that we can check for intersections
    const W1ptoW1h = {  "pos": {    "x": player.pos.x + w1.p.x * w1.p.dist,
                                    "y": player.pos.y + w1.p.y * w1.p.dist },
                        "header": { "x": w1.h.x * w1.h.dist - w1.p.x * w1.p.dist,
                                    "y": w1.h.y * w1.h.dist - w1.p.y * w1.p.dist,
                                    "length": null},
                    };
    W1ptoW1h.header.length = vectorDist(W1ptoW1h.header.x, W1ptoW1h.header.y)
    // console.log(W1ptoW1h.header.x, W1ptoW1h.header.length)

    line(player.pos.x, player.pos.y, player.pos.x + w1.h.x * w1.h.dist, player.pos.y + w1.h.y * w1.h.dist)
    line(player.pos.x, player.pos.y, player.pos.x + w1.p.x * w1.p.dist, player.pos.y + w1.p.y * w1.p.dist)

    // Vector going from v1 pos to v2 pos (v2pos - v1pos)
    const W1ptoW2p = vectorCreate(  w2.p.x * w2.p.dist - w1.p.x * w1.p.dist,
                                    w2.p.y * w2.p.dist - w1.p.y * w1.p.dist);

    // Vector going from v1 pos to v2 header (v2header - v1pos)
    const W1ptoW2h = vectorCreate(  w2.h.x * w2.h.dist - w1.p.x * w1.p.dist,
                                    w2.h.y * w2.h.dist - w1.p.y * w1.p.dist);
    
    line(   W1ptoW1h.pos.x, W1ptoW1h.pos.y,
            W1ptoW1h.pos.x + W1ptoW2p.x, W1ptoW1h.pos.y + W1ptoW2p.y)
    line(   W1ptoW1h.pos.x, W1ptoW1h.pos.y,
            W1ptoW1h.pos.x + W1ptoW2h.x, W1ptoW1h.pos.y + W1ptoW2h.y)

    // if (w1 == w2) {
    //     console.log("v1.index, v2.index")
    //     return false; // if lines are the same, ignore
    // }W1ptoW1h.header, W1ptoW2p
    // line(
    //     W1ptoW1h.header
    // )
    
    
    if ((isClockwiseOrder(w1.p, w2.p) && isClockwiseOrder(w2.p, w1.h)) ||  // first check with w2 pos
        (isClockwiseOrder(w1.p, w2.h) && isClockwiseOrder(w2.h, w1.h))) {  // second check with w2 header
            // console.log(isClockwiseOrder(W1ptoW1h.header, W1ptoW2p), isClockwiseOrder(W1ptoW1h.header, W1ptoW2h))
            // if either of v2 is on top of v1
            // console.log(isClockwiseOrder(W1ptoW1h.header, W1ptoW2p), isClockwiseOrder(W1ptoW1h.header, W1ptoW2h))
            if (isClockwiseOrder(W1ptoW1h.header, W1ptoW2p) || isClockwiseOrder(W1ptoW1h.header, W1ptoW2h)) {   // 
                    return true;
                }
    } else if (isIntersection(W1ptoW1h, W2ptoW2h)) {
        return true;
    }
    return false;
}

// function CClockwiseToB(origin, B, C) {
//     const newB = {
//         "x": origin.x - B.x,
//         "y": origin.y - B.y
//     }
//     const newC = {
//         "x": origin.x - C.x,
//         "y": origin.y - C.y
//     }
//     return isClockwiseOrder(newB, newC);
// }




// https://gist.github.com/shinout/1232505
function tsort(edges) {
    // console.log(allWalls);
    // edges = [
    //     [1, 2],
    //     [4, 7],
    //     [2, 5],
    //     [1, 3],
    //     [3, 5],
    //     [1, 4],
    //     [5, 6]
    // ]

    // edges = []
    // if (allWalls.length > 1) {
    //     for (let i=1; i < allWalls.length; i++) {
    //         edges.push([allWalls[i-1].index, allWalls[i].index])
    //         console.log([allWalls[i-1].index, allWalls[i].index])
    //     }
    // }

    var nodes   = {}, // hash: stringified id of the node => { id: id, afters: lisf of ids }
      sorted  = [], // sorted list of IDs ( returned value )
      visited = {}; // hash: id of already visited node => true

    var Node = function(id) {
        this.id = id;
        this.afters = [];
    }

    // 1. build data structures
    edges.forEach(function(v) {
        var from = v[0], to = v[1];
        if (!nodes[from]) nodes[from] = new Node(from);
        if (!nodes[to]) nodes[to]     = new Node(to);
        nodes[from].afters.push(to);
    });

    // 2. topological sort
    Object.keys(nodes).forEach(function visit(idstr, ancestors) {
        var node = nodes[idstr],
            id   = node.id;

        // if already exists, do nothing
        if (visited[idstr]) return;

        if (!Array.isArray(ancestors)) ancestors = [];

        ancestors.push(id);

        visited[idstr] = true;

        node.afters.forEach(function(afterID) {
        // if (ancestors.indexOf(afterID) >= 0)  // if already in ancestors, a closed chain exists.
        //     throw new Error('closed chain : ' +  afterID + ' is in ' + id);

        visit(afterID.toString(), ancestors.map(function(v) { return v })); // recursive call
        });

        sorted.unshift(id);
    });
    // console.log(sorted)
    return sorted;
}




