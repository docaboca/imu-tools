let bunny
let quat
let zero

function setup() {
    createCanvas(800, 800, WEBGL)
    bunny = loadModel('assets/bunny.obj', true)
}

function draw() {
    background(200, 200, 212)
    noStroke()
    lights()

    if (quat) {
        const [x, y, z, w] = quat
        const mat = quatToMatrix(w, y, x, z)
        if (!zero) {
            const inv = math.inv([mat.slice(0, 3), mat.slice(4, 7), mat.slice(8, 11)])
            zero = [...inv.slice(0, 3), 0, ...inv.slice(3, 6), 0, ...inv.slice(6, 9), 0, ...[0, 0, 0, 1]]
        }
        applyMatrix.apply(null, zero)
        applyMatrix.apply(null, mat)
    }
    model(bunny);
}

function quatToMatrix(w, x, y, z) {
    const x2 = x ** 2, y2 = y ** 2, z2 = z ** 2,
        wx = w * x, wy = w * y, wz = w * z,
        xy = x * y, xz = x * z, yz = y * z
    return [
        1 - 2 * (y2 + z2), 2 * (xy - wz), 2 * (xz + wy), 0,
        2 * (xy + wz), 1 - 2 * (x2 + z2), 2 * (yz - wx), 0,
        2 * (xz - wy), 2 * (yz + wx), 1 - 2 * (x2 + y2), 0,
        0, 0, 0, 1
    ]
}

onSensorData(throttled(function (data) {
    quat = data.quaternion
}))
