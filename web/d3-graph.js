// D3
//
// Adapted from http://bl.ocks.org/simenbrekken/6634070

const limit = 60 * 1;
const duration = 750;
let now = new Date(Date.now() - duration)

const width = 800;
const height = 300

const groups = {}

const x = d3.time.scale()
    .domain([now - (limit - 2), now - duration])
    .range([0, width])

const y = d3.scale.linear()
    .domain([0, 100])
    .range([height, 0])

const line = d3.svg.line()
    .interpolate('basis')
    .x(function (d, i) {
        return x(now - (limit - 1 - i) * duration)
    })
    .y(function (d) {
        return y(d)
    })

const svg = d3.select('.graph').append('svg')
    .attr('class', 'chart')
    .attr('width', width)
    .attr('height', height + 50)

const axis = svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(x.axis = d3.svg.axis().scale(x).orient('bottom'))

const paths = svg.append('g')

function findGroup(name) {
    let group = groups[name]
    if (!group) {
        const colors = ['orange', 'green', 'gray']
        group = {
            value: 0,
            color: colors[Object.keys(groups).length % colors.length],
            data: d3.range(limit).map(function () { return 0 })
        }
        groups[name] = group
        group.path = paths.append('path')
            .data([group.data])
            .attr('class', name + ' group')
            .style('stroke', group.color)
    }
    return group
}

function addSample(sample) {
    const device_id = sample.device_id
    delete sample.device_id
    now = new Date()

    for (var name in sample) {
        if (!sample.hasOwnProperty(name)) { continue }
        const group = findGroup(device_id + ':' + name)
        group.data.push(sample[name] / 10)
        group.path.attr('d', line)
    }

    x.domain([now - (limit - 2) * duration, now - duration])

    axis.transition()
        .duration(duration)
        .ease('linear')
        .call(x.axis)

    paths.attr('transform', null)
        .transition()
        .duration(duration)
        .ease('linear')
        .attr('transform', 'translate(' + x(now - (limit - 1) * duration) + ')')

    for (let name in sample) {
        const group = findGroup(device_id + ':' + name)
        group.data.shift()
    }
}

onSensorData(throttled(function (data) {
    const device_id = data
    const [e0, e1, e2] = data.euler
    addSample({ device_id, e0, e1, e2 })
}))
