const d3 = require('d3');
require('d3-selection-multi');

window.onload = () => {
  const url = 'https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json';
  const [width, height] = [1000, 400];
  const svg = d3.select('.chart').attr('viewBox', `0 0 ${width} ${height}`);

  d3.json(url, (error, countrys) => {
    const simulation = d3.forceSimulation();
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
      .append('image')
      .attrs(({ code }) => ({ width: 12, height: 9, 'xlink:href': `flags/4x3/${code}.svg` }))
      .call(d3.drag()
        .on('start', (dragNode) => {
          if (!d3.event.active) simulation.alphaTarget(0.3).restart();
          dragNode.fx = dragNode.x;
          dragNode.fy = dragNode.y;
        })
        .on('drag', (dragNode) => {
          dragNode.fx = d3.event.x;
          dragNode.fy = d3.event.y;
        })
        .on('end', (dragNode) => {
          if (!d3.event.active) simulation.alphaTarget(0);
          dragNode.fx = null;
          dragNode.fy = null;
        }));

    simulation
      .nodes(countrys.nodes)
      .force('link', d3.forceLink(countrys.links))
      .force('charge', d3.forceManyBody().strength(-2).distanceMax(300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .on('tick', () => {
        link.attrs(({ source: { x: x1, y: y1 }, target: { x: x2, y: y2 } }) => ({ x1, x2, y1, y2 }));
        node.attrs(({ x, y }) => ({ x, y }));
      });
  });
};
