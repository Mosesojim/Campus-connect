const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const categories = [
  {
    name: 'Hair & Beauty',
    url: 'https://images.unsplash.com/photo-1522337360788-8b13fee7f348?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Gadget Repair',
    url: 'https://images.unsplash.com/photo-1581092921461-7031e4bf0e11?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Tutoring',
    url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Fashion',
    url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Errands',
    url: 'https://images.unsplash.com/photo-1586880244406-556ebe35f282?auto=format&fit=crop&w=800&q=80'
  }
];

categories.forEach(cat => {
  const comment = `<!-- ${cat.name} -->`;
  const split1 = html.split(comment);
  if (split1.length === 2) {
    const split2 = split1[1].split('>');
    // The div tag is the first > after the comment, but wait, the comment is followed by a <div ...>
    // Let's replace the empty line after class="..." with the style.
    
    // Instead of raw splits, let's use regex based on the comment and class
    const regex = new RegExp(`(<!-- ${cat.name} -->\\s*<div\\s*class="[^"]+")\\s*>`);
    html = html.replace(regex, `$1 style="background-image: url('${cat.url}');">`);
  }
});

fs.writeFileSync('index.html', html);
console.log("Patched index.html images");
