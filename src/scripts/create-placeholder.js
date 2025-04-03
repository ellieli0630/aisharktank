// This is a simple script to create placeholder images for the judges
// We'll use this to generate colored rectangles with text as placeholders

const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// Create the judges directory if it doesn't exist
const judgesDir = path.join(__dirname, '../../public/images/judges');
if (!fs.existsSync(judgesDir)) {
  fs.mkdirSync(judgesDir, { recursive: true });
}

// Create a placeholder image
function createPlaceholder(filename, color = '#2a5999', text = 'JUDGE') {
  const width = 300;
  const height = 300;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Fill background
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);

  // Add text
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 40px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, width / 2, height / 2);

  // Save to file
  const buffer = canvas.toBuffer('image/jpeg');
  fs.writeFileSync(path.join(judgesDir, filename), buffer);
  console.log(`Created ${filename}`);
}

// Create placeholder.jpg (generic placeholder)
createPlaceholder('placeholder.jpg', '#333333', 'JUDGE');

// Create placeholders for all judges
const judges = [
  { filename: 'sarah-chen.jpg', color: '#2a5999', text: 'TECH' },
  { filename: 'marcus-johnson.jpg', color: '#993344', text: 'FINANCE' },
  { filename: 'elena-rodriguez.jpg', color: '#336644', text: 'LEAD' },
  { filename: 'james-wilson.jpg', color: '#996633', text: 'MARKETING' },
  { filename: 'amara-patel.jpg', color: '#663366', text: 'GROWTH' },
  { filename: 'michael-chang.jpg', color: '#2a5999', text: 'TECH' },
  { filename: 'olivia-greenfield.jpg', color: '#993344', text: 'FINANCE' },
  { filename: 'thomas-wright.jpg', color: '#996633', text: 'MARKETING' },
  { filename: 'zara-mahmood.jpg', color: '#663366', text: 'GROWTH' },
  { filename: 'david-kim.jpg', color: '#2a5999', text: 'TECH' },
  { filename: 'rebecca-santos.jpg', color: '#993344', text: 'FINANCE' },
  { filename: 'alexander-chen.jpg', color: '#336644', text: 'LEAD' },
  { filename: 'sophia-martinez.jpg', color: '#663366', text: 'GROWTH' }
];

// Create all judge placeholders
judges.forEach(judge => {
  createPlaceholder(judge.filename, judge.color, judge.text);
});

console.log('All placeholder images created successfully!');
