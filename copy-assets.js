const fs = require('fs');
const path = require('path');

const targetDir = 'A:/Projects/Velo/src/assets';

fs.mkdirSync(targetDir, { recursive: true });

try {
  fs.copyFileSync(
    'C:/Users/abhij/.gemini/antigravity/brain/d8a1cbd0-94a4-4043-a23a-d29cb86896bf/hero_background_1774379909702.png',
    path.join(targetDir, 'hero_bg.png')
  );
  fs.copyFileSync(
    'C:/Users/abhij/.gemini/antigravity/brain/d8a1cbd0-94a4-4043-a23a-d29cb86896bf/restaurant_bowl_1774380501140.png',
    path.join(targetDir, 'bowl.png')
  );
  fs.copyFileSync(
    'C:/Users/abhij/.gemini/antigravity/brain/d8a1cbd0-94a4-4043-a23a-d29cb86896bf/restaurant_sushi_1774380570122.png',
    path.join(targetDir, 'sushi.png')
  );
  fs.copyFileSync(
    'C:/Users/abhij/.gemini/antigravity/brain/d8a1cbd0-94a4-4043-a23a-d29cb86896bf/restaurant_steak_1774380585634.png',
    path.join(targetDir, 'steak.png')
  );
  console.log('Successfully copied all pictures!');
} catch (e) {
  console.error("FAIL", e);
}
