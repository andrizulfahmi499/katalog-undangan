const fs = require('fs');
const html = fs.readFileSync('public/templates/landing page/dreamylove/www.dearmylove.org/index.html', 'utf8');

const svgMatches = html.match(/<svg[^>]*>.*?<\/svg>/g) || [];
let out = `Total SVGs: ${svgMatches.length}\n\n`;

svgMatches.forEach((svg, index) => {
  out += `\n--- SVG ${index} ---\n`;
  out += svg.substring(0, 500) + (svg.length > 500 ? '...' + svg.substring(svg.length - 100) : '');
});

fs.writeFileSync('scratch-svgs.txt', out);
console.log('SVGs extracted to scratch-svgs.txt');
