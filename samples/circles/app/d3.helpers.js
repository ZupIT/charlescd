function chargeLayout(isDefault, data) {
  const r = isDefault && data.type === 'circle' ? 65 : 1;
  return r * -10;
}

function newD3Layout({ id, distance, data, isDefault }) {
  const chart = d3.select(id);

  const force = d3.layout.force()
    .nodes(data)
    .linkDistance(distance)
    .charge(function(d) {
      return chargeLayout(isDefault, d);
    });
  
  if (isDefault) {
    force.size([w, h]);
  }

  force.on("tick", function (e) {
    chart.selectAll("g")
      .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; });
  });

  return {
    chart,
    force
  }
}