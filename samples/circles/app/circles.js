const defaultCircle = document.querySelector('#circle-default');
const w = defaultCircle.getAttribute('width');
const h = defaultCircle.getAttribute('height');

let circles = [
  {
    id: 'circle-1',
    type: 'circle',
    color: '#ffae00'
  },
  {
    id: 'circle-2',
    type: 'circle',
    color: '#01e89a'
  },
  {
    id: 'circle-3',
    type: 'circle',
    color: '#ff7b10'
  }
];

const graph = {
  defaultCircle: {
    chart: null,
    force: null
  },
  circles: []
};

function createD3CircleRef() {
  circles.forEach(circle => {
    const users = [];
    const { chart, force } = newD3Layout({
      id: `[data-id="${circle.id}"]`,
      isDefault: false,
      distance: 5,
      data: users
    });

    graph.circles.push({
      circleId: circle.id,
      color: circle.color,
      chart: chart,
      force: force,
      users
    });
  });
}

function initDefaultCircle() {
  graph.defaultCircle = newD3Layout({
    isDefault: true,
    id: "#circle-default",
    distance: 10,
    data: circles
  });
 
  graph.defaultCircle
    .force.start();

  graph.defaultCircle
    .chart.selectAll("g")
      .data(circles)
      .enter()
      .append("g")
      .attr("data-id", d => d.id)
      .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; })
      .append("circle")
      .attr("r", d => d.type === "user" ? 3 : 50)
      .style("fill", d => d.type === "user" ? d.color : "transparent")
      .style("stroke-width", "1.5px")
      .style("stroke", d => d.color);
    
  graph.defaultCircle.color = '#9796b4';
  
  createD3CircleRef();
}

function addUser(id) {
  const circle = graph.circles.find(c => c.circleId === id);
  const isDefault = circle === undefined;
  const { chart, force, users, color } = isDefault ? graph.defaultCircle : circle;
  const select = isDefault ? " svg > g" : "g";
  const node = isDefault ? circles : users;

  node.push({ id: "user-id", type: "user", color });

  force.start();

  chart.selectAll(select)
    .data(node)
    .enter()
    .append("g")
    .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; })
    .append("circle")
      .attr("r", 3)
      .style("fill", d => d.color)
    .style("stroke-width", "1.5px")
    .style("stroke", d => d.color);
}

initDefaultCircle();