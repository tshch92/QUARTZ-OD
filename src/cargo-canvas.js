'use strict';

const data = {
    container: {height: 0, width: 0},
    boxes: [],
};

/* const data = {
    container: {
        width: 250,
        height: 300,
    },
    boxes: [
        {width: 200, height: 150},
        {width: 70, height: 50},
        {width: 150, height: 100},
        {width: 150, height: 150},
        {width: 150, height: 150},
    ],
} */

let newData = [];
const insertMethods = [
    "RectBestShortSideFit",
    "RectBestLongSideFit",
    "RectBestAreaFit",
    "RectBottomLeftRule",
    "RectContactPointRule"
];

function createContainer(insertMethods) {
    const canvasContainer = document.createElement('div');
    canvasContainer.classList.add('canvas-container');
    document.body.append(canvasContainer);

    const div = document.createElement('div');
    div.classList.add(`wrapper`);
    div.setAttribute('data-method', insertMethods);
    canvasContainer.insertAdjacentElement('beforeend', div);
    div.insertAdjacentHTML('beforeend', `<h3>${insertMethods}</h3>`);

    return div;
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function showCargo(data) {
    const wrapper = createContainer(data.insertMethod);

    for (const crg of data.cargo) {
        const canvas = document.createElement('canvas');
        canvas.setAttribute('id', 'show_filled_container');
        wrapper.insertAdjacentElement('beforeend', canvas);

        canvas.width = crg.containers.width*0.1;
        canvas.height = crg.containers.height*0.1;
        canvas.style.backgroundColor = '#E8EDF2';

        crg.usedBoxes[0].forEach(box => {
            const context = canvas.getContext("2d");
            context.fillStyle = getRandomColor();
            context.fillRect(box.x*0.1, box.y*0.1, box.width*0.1, box.height*0.1);
        });
    }
}

const start = (data) => {
    const cargo = [];
    const usedBoxes = [];
    const freeBoxes = [];
    const scoring = {
        score1: Number.MAX_SAFE_INTEGER,
        score2: Number.MAX_SAFE_INTEGER,
    }
    let spent = 0.5;
    const BinPackerPrepareModules = (function () {
        const modules = {};
        let that;

        const define = function (name, deps, impl) {
            for (let i = 0; i < deps.length; i++) {
                deps[i] = modules[deps[i]];
            }

            modules[name] = impl.apply(impl, deps);
        }

        const get = function (name) {
            return modules[name];
        }

        const tank = {
            containers: [],

            build: function (width, height, x = 0, y = 0, spent) {
                return this.containers.push({name: `Container-${this.containers.length + 1}`, width, height, x, y, spent});
            }
        }
        const boxes = {
            tmpSet: [],

            build: function (name, width, height) {
                this.tmpSet.push({name: name, width: +width, height: +height});
                return this.tmpSet;
            }
        }

        const prepare = function () {
            oversized.delOversized(boxes.tmpSet);
            sorting.saveRotated(boxes.tmpSet);
            sorting.sortDescending(boxes.tmpSet);
            return true;
        }

        const oversized = {
            oversizedList: [],

            delOversized: function (obj) {
                that = this;
                boxes.tmpSet = obj.filter(that.testAndSaveOversized);
            },

            testAndSaveOversized: function (value) {
                const container = tank.containers[tank.containers.length - 1];
                if (that.getOversized(value, container) || that.getUndersized(value, container)) {
                    that.oversizedList.push(value);
                } else {
                    return value;
                }
            },

            getOversized: function (value, tank) {
                return (value.width > tank.width && value.width > tank.height) || (value.height > tank.width && value.height > tank.height);
            },

            getUndersized: function (obj_pack) {
                return (obj_pack.width === 0 || obj_pack.height === 0);
            },
        }

        const sorting = {
            saveRotated: function (arr) {
                arr = arr.map(this.rotate);
            },

            rotate: function (value) {
                const r_width = value.width;
                const r_height = value.height;

                if (r_width > r_height) {
                    value.width = r_height;
                    value.height = r_width;
                }
            },

            sortDescending: function (arr) {
                arr.sort((a, b) => {
                    return (a.width === b.width)
                        ? b.height - a.height
                        : b.width - a.width;
                });
            },
        }

        return {
            boxes,
            tank,
            define,
            get,
            prepare,
            list_oversized: oversized.oversizedList,
        };
    })();
    const BinPackerInsertModules = (function () {
        let score1, score2;

        function insert(boxes, method) {
            while (boxes.length > 0) {
                let bestScore1 = scoring.score1;
                let bestScore2 = scoring.score2;
                let bestBoxIndex = -1;
                let bestNode;

                boxes.forEach((box, index) => {
                    const newNode = ScoreBox(box.width, box.height, method, box.name);

                    if (score1 < bestScore1 || (score1 === bestScore1 && score2 < bestScore2)) {
                        bestScore1 = score1;
                        bestScore2 = score2;
                        bestNode = newNode;
                        bestBoxIndex = index;
                    }
                });

                if (bestBoxIndex === -1) return;

                PlaceBox(bestNode);
                boxes.splice(bestBoxIndex, 1);
            }
        }

        function ScoreBox(width, height, method, name) {
            let newNode;
            score1 = scoring.score1;
            score2 = scoring.score2;

            switch (method) {
                case "RectBestShortSideFit":
                    newNode = FindPositionForNewNodeBestShortSideFit(width, height, name);
                    break;
                case "RectBottomLeftRule":
                    newNode = FindPositionForNewNodeBottomLeft(width, height, name);
                    break;
                case "RectContactPointRule":
                    newNode = FindPositionForNewNodeContactPoint(width, height, name);
                    score1 = -score1; // Reverse since we are minimizing, but for contact point score bigger is better.
                    break;
                case "RectBestLongSideFit":
                    newNode = FindPositionForNewNodeBestLongSideFit(width, height, name);
                    break;
                case "RectBestAreaFit":
                    newNode = FindPositionForNewNodeBestAreaFit(width, height, name);
                    break;
            }

            // Cannot fit the current rectangle.
            if (newNode.height === 0) {
                score1 = scoring.score1;
                score2 = scoring.score2;
            }

            return newNode;
        }

        function CommonIntervalLength(i1start, i1end, i2start, i2end) {
            if (i1end < i2start || i2end < i1start) {
                return 0;
            }
            return Math.min(i1end, i2end) - Math.max(i1start, i2start);
        }

        function ContactPointScoreNode(x, y, width, height) {
            const {containers} = BinPackerPrepareModules.tank;
            const container = containers[containers.length - 1];

            let score = 0;

            if (x === 0 || x + width === container.width) {
                score += height;
            }

            if (y === 0 || y + height === container.height) {
                score += width;
            }

            for (let i = 0; i < usedBoxes.length; i++) {
                if (usedBoxes[i].x === x + width || usedBoxes[i].x + usedBoxes[i].width === x)
                    score += CommonIntervalLength(usedBoxes[i].y, usedBoxes[i].y + usedBoxes[i].height, y, y + height);
                if (usedBoxes[i].y === y + height || usedBoxes[i].y + usedBoxes[i].height === y)
                    score += CommonIntervalLength(usedBoxes[i].x, usedBoxes[i].x + usedBoxes[i].width, x, x + width);
            }
            return score;
        }

        function FindPositionForNewNodeContactPoint(width, height, name) {
            const bestNode = {};
            let bestContactScore = -1;
            let score;

            freeBoxes.forEach(box => {
                let finalWidth, finalHeight;

                if (box.width >= width && box.height >= height) {
                    finalWidth = width;
                    finalHeight = height;
                }

                if (box.width >= height && box.height >= width) {
                    finalWidth = height;
                    finalHeight = width;
                }

                score = ContactPointScoreNode(box.x, box.y, finalWidth, finalHeight);

                bestNode.x = box.x;
                bestNode.y = box.y;
                bestNode.name = name;

                if (score > bestContactScore) {
                    bestNode.width = finalWidth;
                    bestNode.height = finalHeight;
                    bestContactScore = score;
                }
            });

            score = bestContactScore;
            return bestNode;
        }

        function FindPositionForNewNodeBottomLeft(width, height, name) {
            const bestNode = {};
            let bestY = scoring.score1;
            let bestX = scoring.score2;

            freeBoxes.forEach(box => {
                let topSideY, finalWidth, finalHeight;

                if (box.width >= width && box.height >= height) {
                    topSideY = box.y + height;
                    finalWidth = width;
                    finalHeight = height;
                }

                if (box.width >= height && box.height >= width) {
                    topSideY = box.y + width;
                    finalWidth = height;
                    finalHeight = width;
                }

                bestNode.x = box.x;
                bestNode.y = box.y;
                bestNode.name = name;

                if (topSideY < bestY || topSideY === bestY && box.x < bestX) {
                    bestNode.width = finalWidth;
                    bestNode.height = finalHeight;
                    bestY = topSideY;
                    bestX = box.x;
                }
            });

            score1 = bestX;
            score2 = bestY;
            return bestNode;
        }

        function FindPositionForNewNodeBestAreaFit(width, height, name) {
            const bestNode = {};

            let bestAreaFit = scoring.score1;
            let bestShortSideFit = scoring.score2;

            freeBoxes.forEach(box => {
                const areaFit = box.width * box.height - width * height;
                let finalWidth, finalHeight;

                if (box.width >= width && box.height >= height) {
                    finalWidth = width;
                    finalHeight = height;
                }

                if (box.width >= height && box.height >= width) {
                    finalWidth = height;
                    finalHeight = width;
                }

                const leftoverHoriz = Math.abs(box.width - finalWidth);
                const leftoverVert = Math.abs(box.height - finalHeight);
                const shortSideFit = Math.min(leftoverHoriz, leftoverVert);

                bestNode.x = box.x;
                bestNode.y = box.y;
                bestNode.name = name;

                if (areaFit < bestAreaFit || (areaFit === bestAreaFit && shortSideFit < bestShortSideFit)) {
                    bestNode.width = finalWidth;
                    bestNode.height = finalHeight;
                    bestShortSideFit = shortSideFit;
                    bestAreaFit = areaFit;
                }
            });

            score1 = bestShortSideFit;
            score2 = bestAreaFit;
            return bestNode;
        }

        function FindPositionForNewNodeBestLongSideFit(width, height, name) {
            const bestNode = {};

            let bestShortSideFit = scoring.score1;
            let bestLongSideFit = scoring.score2;

            freeBoxes.forEach(box => {
                let finalWidth, finalHeight;

                if (box.width >= width && box.height >= height) {
                    finalWidth = width;
                    finalHeight = height;
                }

                if (box.width >= height && box.height >= width) {
                    finalWidth = height;
                    finalHeight = width;
                }

                const leftoverHoriz = Math.abs(box.width - finalWidth);
                const leftoverVert = Math.abs(box.height - finalHeight);
                const shortSideFit = Math.min(leftoverHoriz, leftoverVert);
                const longSideFit = Math.max(leftoverHoriz, leftoverVert);

                bestNode.x = box.x;
                bestNode.y = box.y;
                bestNode.name = name;

                if (longSideFit < bestLongSideFit || (longSideFit === bestLongSideFit && shortSideFit < bestShortSideFit)) {
                    bestNode.width = finalWidth;
                    bestNode.height = finalHeight;
                    bestShortSideFit = shortSideFit;
                    bestLongSideFit = longSideFit;
                }
            });

            score1 = bestShortSideFit;
            score2 = bestLongSideFit;
            return bestNode;
        }

        function FindPositionForNewNodeBestShortSideFit(width, height, name) {
            const bestNode = {};

            let bestShortSideFit = scoring.score1;
            let bestLongSideFit = scoring.score2;

            freeBoxes.forEach(box => {
                let finalWidth, finalHeight;

                if (box.width >= width && box.height >= height) {
                    finalWidth = width;
                    finalHeight = height;
                }

                if (box.width >= height && box.height >= width) {
                    finalWidth = height;
                    finalHeight = width;
                }

                const leftoverHoriz = Math.abs(box.width - finalWidth);
                const leftoverVert = Math.abs(box.height - finalHeight);
                const shortSideFit = Math.min(leftoverHoriz, leftoverVert);
                const longSideFit = Math.max(leftoverHoriz, leftoverVert);

                bestNode.x = box.x;
                bestNode.y = box.y;
                bestNode.name = name;

                if (shortSideFit < bestShortSideFit || (shortSideFit === bestShortSideFit && longSideFit < bestLongSideFit)) {
                    bestNode.width = finalWidth;
                    bestNode.height = finalHeight;
                    bestShortSideFit = shortSideFit;
                    bestLongSideFit = longSideFit;
                }
            });

            score1 = bestShortSideFit;
            score2 = bestLongSideFit;

            return bestNode;
        }

        function PlaceBox(box) {
            let tot = freeBoxes.length;

            for (let i = 0; i < tot; i++) {
                if (SplitFreeNode(freeBoxes[i], box)) {
                    freeBoxes.splice(i, 1);
                    i--;
                    tot--;
                }
            }

            PruneFreeList();

            usedBoxes.push(box);
        }

        function PruneFreeList() {
            /// Go through each pair and remove any rectangle that is redundant.
            for (let i = 0; i < freeBoxes.length; i++) {
                for (let j = i + 1; j < freeBoxes.length; j++) {
                    if (IsContainedIn(freeBoxes[i], freeBoxes[j])) {
                        freeBoxes.splice(i, 1);
                        i--;
                        break;
                    }
                    if (IsContainedIn(freeBoxes[j], freeBoxes[i])) {
                        freeBoxes.splice(j, 1);
                        j--;
                    }
                }
            }
        }

        function IsContainedIn(a, b) {
            return a.x >= b.x && a.y >= b.y
                && a.x + a.width <= b.x + b.width
                && a.y + a.height <= b.y + b.height;
        }

        function SplitFreeNode(freeNode, usedNode) {
            const finalUsedNode = {
                width: usedNode.x + usedNode.width,
                height: usedNode.y + usedNode.height
            }
            const finalFreeNode = {
                width: freeNode.x + freeNode.width,
                height: freeNode.y + freeNode.height
            }

            // Test with SAT if the rectangles even intersect.
            if (usedNode.x >= finalUsedNode.width || finalUsedNode.width <= freeNode.x ||
                usedNode.y >= finalFreeNode.height || finalUsedNode.height <= freeNode.y) {
                return false;
            }

            if (usedNode.x < freeNode.width && finalUsedNode.width > freeNode.x) {
                // New node at the top side of the used node.
                if (usedNode.y > freeNode.y && usedNode.y < finalFreeNode.height) {
                    const newNode = Object.assign({}, freeNode);
                    newNode.height = usedNode.y - newNode.y;

                    freeBoxes.push(newNode);
                }

                // New node at the bottom side of the used node.
                if (finalUsedNode.height < finalFreeNode.height) {
                    const newNode = Object.assign({}, freeNode);
                    newNode.y = finalUsedNode.height;
                    newNode.height = finalFreeNode.height - (finalUsedNode.height);
                    freeBoxes.push(newNode);
                }
            }

            if (usedNode.y < finalFreeNode.height && finalUsedNode.height > freeNode.y) {
                // New node at the left side of the used node.
                if (usedNode.x > freeNode.x && usedNode.x < finalFreeNode.width) {
                    const newNode = Object.assign({}, freeNode);
                    newNode.width = usedNode.x - newNode.x;
                    freeBoxes.push(newNode);
                }

                // New node at the right side of the used node.
                if (finalUsedNode.width < finalFreeNode.width) {
                    const newNode = Object.assign({}, freeNode);
                    newNode.x = usedNode.x + usedNode.width;
                    newNode.width = finalFreeNode.width - (finalUsedNode.width);
                    freeBoxes.push(newNode);
                }
            }

            return true;
        }

        return {insert};
    })();

    function write_tank_dimensions(container) {
        BinPackerPrepareModules.tank.build(container.width, container.height, 0, 0, 1);
        BinPackerPrepareModules.tank.build(container.width, container.height/2, 0, 0, 0.5);
    }
    function write_boxes_dimensions(boxes) {
        boxes.forEach((box, index) => {
            box.name = (!box.name) ? `Box-${index}` : box.name;

            BinPackerPrepareModules.boxes.build(box.name, box.width, box.height);
        });
    }
    function prepare_boxes() {
        if (BinPackerPrepareModules.prepare()) {
            if (BinPackerPrepareModules.list_oversized.length > 0) {
                console.log('OVERSIZED: ', BinPackerPrepareModules.list_oversized);
            }
        }
    }
    function Boxes(boxes) {
        this.Boxes = boxes.slice(0);
    }

    function insert_boxes(method) {
        const usedBoxesArray = [];

        if (usedBoxes.length > 0) usedBoxes.length = 0;
        if (freeBoxes.length > 0) freeBoxes.length = 0;

        const container = BinPackerPrepareModules.tank.containers.find(cntr => cntr.spent === spent);

        freeBoxes.push(container);

        const tmpBoxes = new Boxes(BinPackerPrepareModules.boxes.tmpSet);
        const boxes = new Boxes(BinPackerPrepareModules.boxes.tmpSet);

        BinPackerInsertModules.insert(tmpBoxes.Boxes, method);

        usedBoxesArray.push(usedBoxes.slice(0));

        const notUsedBoxes = boxes.Boxes.filter(box => {
            const isUsed = usedBoxesArray.flat().find(item => item.name === box.name);

            return !isUsed && box;
        });

        if (notUsedBoxes.length && container.spent < 1) {
            spent = 1;
            usedBoxes.length = 0;
            notUsedBoxes.length = 0;
            //console.log('tmpSet', BinPackerPrepareModules.boxes.tmpSet);
            insert_boxes(method);
            spent = 0.5;
            return;
        }

        cargo.push({
            insertMethod: method,
            notUsedBoxes,
            usedBoxes: usedBoxesArray,
            freeBoxes: freeBoxes.slice(0),
            containers: container
        });
    }

    write_tank_dimensions(data.container);
    write_boxes_dimensions(data.boxes);
    prepare_boxes();

    if (data.insertMethod) {
        insert_boxes(data.insertMethod);
    } else {
        insertMethods.forEach(method => insert_boxes(method));
    }

    cargo.forEach(crg => {
        crg.usedBoxes = [crg.usedBoxes[0].filter(box => Object.keys(box).length > 0 && box.constructor === Object)];

        const crgItem = newData.find(item => crg.insertMethod === item.insertMethod);
        const crgObj = {
            containers: crg.containers,
            freeBoxes: crg.freeBoxes,
            usedBoxes: crg.usedBoxes
        }

        if (crgItem) {
            crgItem.cargo.push(crgObj);
        } else {
            newData.push({
                insertMethod: crg.insertMethod,
                cargo: [crgObj]
            });
        }

        if (crg.notUsedBoxes.length > 0) {
            start({
                insertMethod: crg.insertMethod,
                boxes: crg.notUsedBoxes,
                container: data.container
            });
        }
    });
}

let checkTheBestMethod = (data) => {
    //console.log('data', data);
    for (let crg of data) {
        let totalSpent = 0;
        crg.cargo.forEach(({containers}) => totalSpent += containers.spent);
        crg.totalspent = totalSpent;
        showCargo(crg);
    }
}

/* start(data);
checkTheBestMethod(newData); */