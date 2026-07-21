/**
 * generate_pdf.js
 * Screenshots each of the 15 slides from the live web app (localhost:5173)
 * and compiles them into a perfect-layout PDF matching the web UI exactly.
 */
import { chromium } from 'playwright';

const TOTAL_SLIDES = 15;
const PDF_PATH = 'C:/Users/sahil/Downloads/SafeRoute_HCD_Presentation.pdf';
const SLIDE_W = 1440;
const SLIDE_H = 810;

(async () => {
  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: SLIDE_W, height: SLIDE_H },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  // Navigate to the web app
  console.log('Opening http://localhost:5173/ ...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);

  // Ensure we're on the PPT tab (click it in case another tab was active)
  try {
    const pptTabBtn = page.locator('button:has-text("HCD Slide Deck")');
    await pptTabBtn.click({ timeout: 3000 });
    await page.waitForTimeout(500);
  } catch (_) { /* already on PPT tab */ }

  const screenshots = [];

  for (let i = 0; i < TOTAL_SLIDES; i++) {
    console.log(`Capturing slide ${i + 1} of ${TOTAL_SLIDES}...`);

    // Click the i-th progress dot to jump to slide i
    // Progress dots are small divs with cursor:pointer inside the slide controls area
    const dots = await page.locator('div[style*="border-radius: 4px"][style*="cursor: pointer"]').all();

    if (dots.length >= TOTAL_SLIDES) {
      await dots[i].click();
    } else {
      // Fallback: click Next repeatedly to navigate to slide i from current position
      if (i === 0) {
        // Click Prev many times to go to the start
        for (let k = 0; k < TOTAL_SLIDES; k++) {
          try { await page.click('button:has-text("← Prev")', { timeout: 500 }); } catch (_) {}
        }
      } else {
        try { await page.click('button:has-text("Next →")', { timeout: 1000 }); } catch (_) {}
      }
    }

    // Wait for slide transition animation
    await page.waitForTimeout(400);

    // Find and screenshot just the slide card (dark rounded rectangle)
    // The slide card has background #0B0E14 and border-radius:20px
    const slideCard = page.locator('div').filter({
      has: page.locator('div[style*="SafeRoute HCD Case Study"]')
    }).first();

    let buffer;
    try {
      // Try to screenshot just the slide card element
      const cardEl = page.locator('[style*="border-radius: 20px"][style*="min-height: 460"]').first();
      await cardEl.waitFor({ timeout: 2000 });
      buffer = await cardEl.screenshot({ type: 'png' });
    } catch (_) {
      // Fallback: full viewport screenshot
      buffer = await page.screenshot({ type: 'png' });
    }

    screenshots.push(buffer.toString('base64'));
  }

  console.log(`Captured ${screenshots.length} slides. Generating PDF...`);

  // Build an HTML page with all screenshots and print to PDF
  const slidePagesHtml = screenshots.map((b64, idx) => `
    <div class="slide-page">
      <img src="data:image/png;base64,${b64}" alt="Slide ${idx + 1}" />
    </div>
  `).join('\n');

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { background: #0B0E14; width: 100%; }
  .slide-page {
    width: ${SLIDE_W}px;
    height: ${SLIDE_H}px;
    page-break-after: always;
    overflow: hidden;
    display: flex;
    align-items: stretch;
    background: #0B0E14;
  }
  .slide-page:last-child { page-break-after: auto; }
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  @page {
    size: ${SLIDE_W}px ${SLIDE_H}px;
    margin: 0;
  }
  @media print {
    body { background: #0B0E14 !important; }
    .slide-page {
      page-break-after: always !important;
      page-break-inside: avoid !important;
    }
  }
</style>
</head>
<body>
${slidePagesHtml}
</body>
</html>`;

  const pdfPage = await context.newPage();
  await pdfPage.setContent(html, { waitUntil: 'load' });
  await pdfPage.waitForTimeout(800);

  await pdfPage.pdf({
    path: PDF_PATH,
    width: `${SLIDE_W}px`,
    height: `${SLIDE_H}px`,
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  });

  console.log(`✅ PDF saved to: ${PDF_PATH}`);
  await browser.close();
})();
