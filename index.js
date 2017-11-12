const d3 = require('d3');
require('d3-selection-multi');

window.onload = () => {
  const url = 'https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json';
  const [width, height] = [1280, 720];
  const svg = d3.select('.chart').attr('viewBox', `0 0 ${width} ${height}`);

  d3.json(url, (error, countrys) => {
    const simulation = d3.forceSimulation();
    const link = svg.selectAll('line')
      .data(countrys.links)
      .enter()
      .append('line');
    const node = svg.append('g')
      .selectAll('circle')
      .data(countrys.nodes)
      .enter()
      .append('g')
      .attr('transform', 'translate(-8, -6)')
      .append('image')
      .attrs(({ code }) => ({ width: 16, height: 12, 'xlink:href': `flags/4x3/${code}.svg` }))
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

    node.append('title').text(({ country }) => country);
    simulation
      .nodes(countrys.nodes)
      .force('link', d3.forceLink(countrys.links))
      .force('charge', d3.forceManyBody().distanceMax(225))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collide', d3.forceCollide().radius(9))
      .force('alignY', d3.forceY(height / 2).strength(0.01))
      .on('tick', () => {
        link.attrs(({ source: { x: x1, y: y1 }, target: { x: x2, y: y2 } }) => ({ x1, x2, y1, y2 }));
        node.attrs(({ x, y }) => ({ x, y }));
      });
  });
};
