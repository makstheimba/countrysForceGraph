const d3 = require('d3');
require('d3-selection-multi');

function dragstarted(d, simulation) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d, simulation) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}

const startApp = () => {
  const url = 'https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json';
  const svg = d3.select('.chart').attr('viewBox', '0 0 1300 600');
  const simulation = d3.forceSimulation()
    .force('link', d3.forceLink())
    .force('charge', d3.forceManyBody())
    .force('center', d3.forceCenter(400, 400)); // change to width / 2 and height / 2

  d3.json(url, (error, countrys) => {
    const link = svg.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(countrys.links)
      .enter()
      .append('line');

    const node = svg.append('g')
      .attr('class', 'nodes')
      .selectAll('circle')
      .data(countrys.nodes)
      .enter()
      .append('circle')
      .attr('r', 5)
      .call(d3.drag()
        .on('start', d => dragstarted(d, simulation))
        .on('drag', dragged))
      .on('end', d => dragended(d, simulation));

    simulation
      .nodes(countrys.nodes)
      .on('tick', () => {
        link
          .attr('x1', d => d.source.x)
          .attr('y1', d => d.source.y)
          .attr('x2', d => d.target.x)
          .attr('y2', d => d.target.y);

        node
          .attr('cx', d => d.x)
          .attr('cy', d => d.y);
      });

    simulation.force('link')
      .links(countrys.links);
  });
};

window.onload = startApp;
