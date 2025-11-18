# Extension Icons

This extension requires icon files in the following sizes:
- 16x16 pixels (icon16.png)
- 32x32 pixels (icon32.png)
- 48x48 pixels (icon48.png)
- 128x128 pixels (icon128.png)

## How to Create Icons

### Option 1: Using Online Tools
1. Visit https://www.favicon-generator.org/ or https://www.canva.com/
2. Create a 128x128 icon with your design
3. Download and resize to other sizes (16, 32, 48)
4. Save all files in this directory

### Option 2: Using ImageMagick (if installed)
```bash
# Create a simple colored icon (example: blue square with "FB" text)
convert -size 128x128 xc:#4267B2 \
  -gravity center \
  -pointsize 48 \
  -fill white \
  -annotate +0+0 "FB" \
  icon128.png

# Resize to other sizes
convert icon128.png -resize 48x48 icon48.png
convert icon128.png -resize 32x32 icon32.png
convert icon128.png -resize 16x16 icon16.png
```

### Option 3: Use Existing Facebook Logo
Download Facebook's official logos from their brand resources and resize them appropriately.

## Icon Design Guidelines
- Use Facebook brand colors (#4267B2 for blue, #FFFFFF for white)
- Keep the design simple and recognizable
- Ensure the icon is clear at all sizes
- Use transparent backgrounds where appropriate

## Temporary Workaround
If you don't have icons yet, you can temporarily remove the icon references from manifest.json and the extension will use default browser icons.
