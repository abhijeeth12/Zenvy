import fs from 'fs';
import path from 'path';

const brainDir = 'C:/Users/abhij/.gemini/antigravity/brain/e2d78d33-f97e-4eec-b473-37444e3ab8e1';
const targetDir = 'A:/Projects/Zenvy/src/assets';

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const filesInBrain = fs.readdirSync(brainDir);
console.log('Files in brain:', filesInBrain);

const mapping = {
  'hero_moody.png': /zenvy_hero_moody_gourmet.*\.png/,
  'omakase.png': /zenvy_restaurant_omakase.*\.png/,
  'steakhouse.png': /zenvy_restaurant_steakhouse.*\.png/,
  'artisan_salad.png': /zenvy_food_artisan_salad.*\.png/,
  'lifestyle_dining.png': /zenvy_lifestyle_collaborative_dining.*\.png/,
  'minimalist_pasta.png': /zenvy_food_minimalist_pasta.*\.png/
};

Object.entries(mapping).forEach(([targetName, pattern]) => {
  const match = filesInBrain.find(f => pattern.test(f));
  if (match) {
    const src = path.join(brainDir, match);
    const dest = path.join(targetDir, targetName);
    fs.copyFileSync(src, dest);
    console.log(`Copied ${match} to ${targetName}`);
  } else {
    console.warn(`No match for pattern ${pattern}`);
  }
});

console.log('Assets update complete.');