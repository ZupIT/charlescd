const { defaultCircle, w, h } = getDefaultCircle();

const graph = {
  defaultCircle: {
    chart: null,
    force: null
  },
  circles: []
};


function formatCircles(circles) {
  const colors = Colors();
  if (circles) {
    return circles.map(circle => ({
      id: circle.id,
      type: 'circle',
      color: colors.generate()
    }))
  }

  return []
}

function createD3CircleRef(circles) {
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

function initDefaultCircle(circles) {
  const data = Object.assign([], formatCircles(circles));
  graph.defaultCircle = newD3Layout({
    isDefault: true,
    id: "#circle-default",
    distance: 10,
    data 
  });
 
  graph.defaultCircle.force.start();

  graph.defaultCircle
    .chart.selectAll("g")
      .data(data)
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
  
  createD3CircleRef(data);
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