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
  const width = 1300;
  const height = 600;

  const simulation = d3.forceSimulation()
    .force('link', d3.forceLink())
    .force('charge', d3.forceManyBody())
    .force('center', d3.forceCenter(width / 2, height / 2));

  const svg = d3.select('.chart').attr('viewBox', `0 0 ${width} ${height}`);

  d3.json(url, (error, countrys) => {
    const link = svg.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(countrys.links)
      .enter()
      .append('line')
      .attr('stroke-width', d => Math.sqrt(d.value));

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

    node.append('title')
      .text(d => d.id);

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
