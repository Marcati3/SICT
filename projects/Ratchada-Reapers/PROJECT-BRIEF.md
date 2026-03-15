# Ratchada Reapers -- Project Brief

## 1. Project Overview

The Ratchada Reapers are a Thailand-based ice hockey team. The project encompasses full branding, graphic design, merchandise production, and team culture assets (fight song, logo, apparel). The team plays in a league alongside rival teams: the Beavers, Devils, and Wolves. The team is based in Bangkok, with ties to the Ratchada (Ratchadaphisek) area and nearby Huai Khwang neighborhood.

### Key People

- **Captain Messier** -- team captain
- **Assistant Captain August** -- assistant captain

### Team Sponsor

- **Buddy's Bar & Grill** -- primary team sponsor, referenced in branding and fight song

---

## 2. Branding

### Team Name Origin

The name "Ratchada Reapers" was chosen from a shortlist of Thailand-based ice hockey team name concepts generated in October 2025. The naming convention draws from Bangkok streets, provinces, and districts (e.g., Sukhumvit Spitfires, Dusit Defenders, Ekamai Icehawks). "Ratchada" refers to Ratchadaphisek Road in Bangkok. The "Reapers" identity was selected for its edgy, intimidating, aggressive character.

### Logo Concept

The logo features a grim reaper figure in a hooded robe wielding a hockey stick as a scythe. The design direction is modern, aggressive, and sports-forward -- suitable for professional hockey jerseys, banners, and merchandise.

- **Original generation prompt description:** "A skeletal figure in a Thai-style hood wielding a hockey stick as a scythe, framed in crimson and black."
- **Refined prompt description:** "Grim reaper with hood holding a hockey stick like a scythe. Bold aggressive typography reading 'Ratchada Reapers'."
- **Design style:** Clean vector-style edges, sharp lines, symmetrical emblem, centered composition, no gradients, flat background, print-ready.

### Color Scheme

| Color         | Usage                        |
|---------------|------------------------------|
| Black         | Primary background / body    |
| Deep crimson red | Primary accent / hood / accents |
| White / off-white | Text, highlights           |
| Ice blue      | Secondary accent             |

### Typography

Team name "Ratchada Reapers" rendered in a sharp, stylized, strong athletic font. Bold and aggressive.

---

## 3. Graphics Work

### Logo Files Created

High-resolution raster versions of the logo were generated and upscaled from an original 1024x1024 source image:

| File                  | Dimensions       | Format | Notes                              |
|-----------------------|------------------|--------|------------------------------------|
| reapers_4000.png      | 4000 x 4000 px   | PNG    | Transparent background             |
| reapers_6000.png      | 6000 x 6000 px   | PNG    | Transparent background             |
| reapers_8000.png      | 8000 x 8000 px   | PNG    | Transparent background             |
| reapers_print.pdf     | 6000 x 6000 px   | PDF    | 300 DPI, print-shop friendly       |
| reapers_vector.svg    | 8000 x 8000 viewBox | SVG | AI-compatible wrapper (embedded raster, not true vector paths) |

All PNG files preserve transparency. Upscaling was done via Python PIL/Pillow using LANCZOS resampling from the base image.

### Print Specifications Discussed

- **Stickers:** Final print size 3.5 cm (1.38 inches). The 4000px PNG yields approximately 2900 DPI at this size -- more than sufficient. Recommended file: reapers_4000.png.
- **T-shirts / hoodies (DTG / DTF):** Recommended file: reapers_6000.png.
- **Large banners:** Recommended file: reapers_8000.png. Banner printers typically operate at 150-240 DPI.
- **Embroidery:** Raster DPI is irrelevant. Requires vector or stitch files. A clean vector (SVG/AI) with sharp edges and minimal thread changes produces best results.

### DPI Reference Table (at various print sizes)

| File           | Print Width | Resulting DPI |
|----------------|-------------|---------------|
| 8000px         | 26.7 in     | 300 DPI       |
| 8000px         | 13.3 in     | 600 DPI       |
| 6000px         | 20 in       | 300 DPI       |
| 6000px         | 10 in       | 600 DPI       |
| 4000px         | 13.3 in     | 300 DPI       |
| 4000px (sticker 3.5cm) | 1.38 in | ~2900 DPI |

### SVG / AI File Status

An SVG wrapper was created embedding the 8000px PNG. This is AI-compatible (can be opened in Adobe Illustrator) but is NOT a true clean vector with path-by-path construction. To get a true vector:

1. Open the SVG in Adobe Illustrator
2. Use Image Trace (High Fidelity Photo or Black & White Logo mode)
3. Expand the trace
4. Save As Adobe Illustrator (.ai)

For embroidery, vinyl cutting, and sponsor overlays, a manual vector redraw (clean paths, flat fills, stitch-safe overlaps) would produce the best results.

---

## 4. Merchandise

### T-Shirt Design (Wine Theme -- Separate from Reapers branding)

A separate t-shirt design project was explored for a fun/humorous wine-themed screen-printed shirt. This is not Ratchada Reapers branded but was discussed in the same project workspace.

- **Required bottom text:** "LIFE IS TOO SHORT TO DRINK BAD WINE" (all caps, bold)
- **Style direction:** Bold, colorful, meme-style, easy to read, funny, instantly shareable. Not vintage or dull. Bright, clean, graphic, and fun.
- **Production method:** Screen printing onto t-shirts

#### Sayings Proposed (for top line, above the bottom text)

Ten original sayings were proposed, each paired with a cartoon graphic concept:

1. "MY DAILY SERVING OF FRUIT... FERMENTED." -- Grapes jumping into a wine glass like a swimming pool
2. "I ONLY LIFT THINGS THAT POUR." -- Wine bottle doing a bicep curl with a cork dumbbell
3. "THIS IS MY KIND OF HYDRATION." -- Water bottle annoyed while wine glass flexes
4. "MY HOBBIES INCLUDE SIPPING AND JUDGING." -- Sassy wine glass with judge's gavel
5. "I CAME. I SAW. I DECANTED." -- Roman-style wine bottle in a cape pouring into a glass
6. "WINE: BECAUSE ADULTING IS EXHAUSTING." -- Tired human collapsed on couch, wine bottle fanning them
7. "I ONLY DRINK WITH PEOPLE I LIKE... SO HERE I AM." -- Wine glass alone at table with confetti
8. "TODAY'S FORECAST: 99% CHANCE OF WINE." -- Wine glasses raining from a cartoon cloud
9. "MY SPIRIT ANIMAL IS A FULL-BODIED RED." -- Lion with a wine-glass-shaped mane
10. "LET'S KEEP THE POUR DECISIONS GOING." -- Wine bottle and glass high-fiving, spilling wine

**Status:** User was presented with the 10 options but no final selection was made. No final graphic was generated.

### Ratchada Reapers Merchandise (Discussed but not yet designed)

The following merchandise formats were discussed as potential deliverables:

- **Front chest logo** (smaller placement)
- **Sleeve mark** (compact version)
- **Banner horizontal** (wide-format layout)
- **Sponsor-ready lockups** (with Buddy's Bar & Grill placement)
- **One-color / two-color embroidery variants**
- **Stitch-safe simplified mark** (for embroidery)

---

## 5. Current Status

### Completed

- Team name selected: Ratchada Reapers
- Logo concept defined and initial image generated (1024x1024 base)
- High-res raster upscales delivered (4000, 6000, 8000 px PNGs + PDF)
- SVG wrapper created (AI-compatible, but not true vector)
- Sticker printing specs confirmed (3.5 cm, 4000px PNG is sufficient)
- Fight song lyrics written ("Reapers of Ratchada") in Metallica/Godsmack style
- AI music generation prompts prepared for Suno, SOUNDRAW, AIVA, and Mubert
- Wine t-shirt concept explored with 10 saying options proposed

### Not Yet Completed

- True clean vector logo (SVG/AI with hand-built paths)
- Embroidery-optimized logo variant
- One-color and two-color logo variants
- Merch layout pack (front chest, sleeve mark, banner horizontal)
- Sponsor lockup with Buddy's Bar & Grill
- Pantone color references for printers
- Bleed and stroke tuning for professional print
- Wine t-shirt: final saying selection and graphic generation
- Fight song: actual music generation (no audio file produced)
- CMYK color version of the logo

---

## 6. Important Details

### Design Descriptions

**Logo (primary):**
- Grim reaper figure in a hooded robe (red/crimson hood mentioned)
- Holding a hockey stick wielded like a scythe
- Bold, aggressive, modern sports team aesthetic
- Colors: black, deep crimson red, white/off-white, ice blue accents
- Team name "Ratchada Reapers" in sharp athletic typography
- Transparent background on all PNG deliverables
- Centered, symmetrical emblem composition

**Wine T-Shirt:**
- Bright, colorful cartoon/meme aesthetic
- Bold readable text
- Humorous wine-related illustration paired with two-line text layout
- Bottom line always: "LIFE IS TOO SHORT TO DRINK BAD WINE"
- Screen printing production method

### File Format Requirements

| Use Case           | Recommended Format           |
|---------------------|------------------------------|
| Screen printing     | PNG 6000+ px, transparent bg |
| DTG / DTF printing  | PNG 6000 px                  |
| Large banners       | PNG 8000 px or vector        |
| Embroidery          | Vector (SVG/AI/EPS) or stitch file |
| Vinyl cutting       | Vector (SVG/AI)              |
| Stickers (3.5 cm)   | PNG 4000 px                  |
| Print shop handoff  | PDF 300 DPI or TIFF          |

### Upscaling Tools Referenced

If further upscaling is needed:
- **Upscayl** -- free, desktop, good for logos
- **Topaz Gigapixel AI** -- paid, industry standard
- **Adobe Photoshop Super Resolution**
- **Let's Enhance / ClipDrop Upscale**

Recommended settings: 4x upscale, PNG output, low-medium sharpening, low noise reduction (logos need crisp edges).

### Rival Teams

- Beavers
- Devils
- Wolves

### Fight Song Details

- **Title:** "Reapers of Ratchada"
- **Style:** Hard rock / metal (Metallica "Fuel" meets Godsmack "1000hp")
- **Tempo:** Driving, fast (suggested 160-175 BPM for instrumental versions)
- **References:** Ratchada, Buddy's Bar, Captain Messier, Assistant Captain August, rival teams (Wolves, Beavers, Devils), Bangkok, Soi 4, Huai Khwang, Thailand
- **Structure:** Two verses, repeating chorus, spoken bridge, final chorus
- **Versions prepared:** Suno prompt (with lyrics), SOUNDRAW instrumental prompt, AIVA hybrid rock/orchestral prompt, Mubert loop/background prompt

---

## 7. Open Items / Next Steps

### High Priority

1. **True vector logo** -- Commission or create a clean, path-by-path vector version (SVG/AI/EPS) of the Ratchada Reapers logo. This is the single most important outstanding item; it unlocks embroidery, vinyl cutting, unlimited scaling, and professional print.
2. **Embroidery variant** -- Simplified shapes, stitch-friendly overlaps, reduced detail for clean thread work.
3. **One-color and two-color logo variants** -- Needed for single-color screen printing and embroidery.

### Medium Priority

4. **Sponsor lockup** -- Logo layout incorporating Buddy's Bar & Grill branding alongside the Reapers mark.
5. **Merch layout pack** -- Sized and positioned variants for:
   - Front chest placement (small)
   - Sleeve mark (compact)
   - Full back print (large)
   - Banner horizontal (wide format)
6. **Pantone color references** -- Define exact Pantone values for crimson, black, ice blue for consistent print reproduction.
7. **CMYK color version** -- Convert the logo to CMYK color space for offset and professional printing.
8. **Bleed and stroke tuning** -- Prepare print-ready files with proper bleed margins.

### Lower Priority

9. **Wine t-shirt design** -- Select final saying from the 10 proposed options, generate the full-color graphic, prepare screen-print-ready file.
10. **Fight song audio** -- Use the prepared prompts with an AI music generation tool (SOUNDRAW, AIVA, Mubert, or Suno if budget allows) to produce the actual audio track.
11. **Arena chant version** -- Shorter, stadium-style version of the fight song for crowd use and goal celebrations.

### Questions to Resolve

- What is the exact Buddy's Bar & Grill logo / wordmark for sponsor placement?
- Are there specific jersey colors or uniform designs that need to be factored into the logo variants?
- What embroidery digitizer or print shop will be used? (They may have specific file format and color requirements.)
- Has a final wine t-shirt saying been selected from the 10 options?
- Is there a budget for professional vectorization of the logo, or should AI-assisted tracing be used?
