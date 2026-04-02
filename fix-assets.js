import fs from 'fs';
import path from 'path';

const brainDir = 'C:/Users/abhij/.gemini/antigravity/brain/b20b093c-2a54-46e2-a301-41a857fea61a';
const publicAssetsDir = 'a:/Projects/Zenvy/public/assets';
const srcAssetsDir = 'a:/Projects/Zenvy/src/assets';

fs.mkdirSync(publicAssetsDir, { recursive: true });

const filesInBrain = fs.readdirSync(brainDir);

const mapping = {
  'crinkle_cut_fries.png': /crinkle_cut_fries.*\.png/,
  'japanese_wagyu.png': /japanese_wagyu.*\.png/,
  'wolfgang_puck.png': /wolfgang_puck.*\.png/
};

Object.entries(mapping).forEach(([targetName, pattern]) => {
  const match = filesInBrain.find(f => pattern.test(f));
  if (match) {
    fs.copyFileSync(path.join(brainDir, match), path.join(publicAssetsDir, targetName));
    console.log(`Copied ${match} to ${targetName}`);
  }
});

fs.copyFileSync(path.join(srcAssetsDir, 'minimalist_pasta.png'), path.join(publicAssetsDir, 'margherita_pizza.png'));
console.log('Copied fallback for margherita_pizza.png');
