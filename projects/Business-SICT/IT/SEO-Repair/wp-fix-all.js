const https = require('https');

const AUTH = Buffer.from('sic:2fm2 VyLK 6SQU Y4XQ Cm5Q 5lGB').toString('base64');
const BASE = 'https://www.sic.co.th/wp-json';

function api(method, path, data) {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE + path);
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Authorization': 'Basic ' + AUTH,
        'Content-Type': 'application/json',
      }
    };
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => {
        try { resolve(JSON.parse(body)); }
        catch(e) { resolve(body); }
      });
    });
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function main() {
  console.log('=== TASK 1: Fix brochure PDF redirect ===');
  try {
    const redirect = await api('POST', '/redirection/v1/redirect', {
      url: '/wp-content/uploads/2024/12/SICAllBrochure.pdf',
      action_data: { url: 'https://webapp.sic.co.th' },
      action_type: 'url',
      action_code: 301,
      group_id: 1,
      match_type: 'url'
    });
    console.log('Brochure redirect:', redirect.id ? 'Created (ID: ' + redirect.id + ')' : JSON.stringify(redirect).substring(0, 200));
  } catch(e) { console.log('Error:', e.message); }

  console.log('\n=== TASK 2: Get menu structure ===');
  try {
    // Get menu items for desktop menu (ID 16)
    const menuItems = await api('GET', '/wp/v2/menu-items?menus=16&per_page=100');
    if (Array.isArray(menuItems)) {
      console.log('Desktop menu items: ' + menuItems.length);
      // Find if Solutions already exists
      const solutions = menuItems.find(i => i.title && i.title.rendered && i.title.rendered.includes('Solution'));
      if (solutions) {
        console.log('Solutions already in menu: ID ' + solutions.id);
      } else {
        console.log('Solutions NOT in menu - need to add');
      }
      // Show top-level items
      const topLevel = menuItems.filter(i => i.parent === 0);
      topLevel.forEach(i => console.log('  Menu item: ' + (i.title?.rendered || i.title) + ' (ID: ' + i.id + ', parent: ' + i.parent + ')'));
    } else {
      console.log('Menu response:', JSON.stringify(menuItems).substring(0, 300));
    }
  } catch(e) { console.log('Error:', e.message); }

  console.log('\n=== TASK 3: Add Solutions to desktop menu ===');
  try {
    // Get the Solutions page ID
    const pages = await api('GET', '/wp/v2/pages?slug=solutions&per_page=1');
    const solutionsPageId = pages[0]?.id;
    console.log('Solutions page ID: ' + solutionsPageId);

    if (solutionsPageId) {
      // Add Solutions as a menu item
      const newItem = await api('POST', '/wp/v2/menu-items', {
        title: 'Solutions',
        url: 'https://www.sic.co.th/solutions/',
        status: 'publish',
        menus: 16,
        parent: 0,
        type: 'custom',
        position: 3 // After Products
      });
      console.log('Added Solutions to desktop menu:', newItem.id ? 'ID ' + newItem.id : JSON.stringify(newItem).substring(0, 200));

      // Add sub-items
      if (newItem.id) {
        const subPages = [
          { title: 'Automotive Security', url: 'https://www.sic.co.th/solutions/automotive-security/' },
          { title: 'Healthcare & Biosensor', url: 'https://www.sic.co.th/solutions/healthcare-biosensor/' },
          { title: 'Smart Manufacturing', url: 'https://www.sic.co.th/solutions/smart-manufacturing/' },
          { title: 'Brand Protection', url: 'https://www.sic.co.th/solutions/brand-protection/' },
        ];
        for (const sub of subPages) {
          const subItem = await api('POST', '/wp/v2/menu-items', {
            title: sub.title,
            url: sub.url,
            status: 'publish',
            menus: 16,
            parent: newItem.id,
            type: 'custom'
          });
          console.log('  Sub-item ' + sub.title + ':', subItem.id ? 'ID ' + subItem.id : JSON.stringify(subItem).substring(0, 150));
        }
      }
    }
  } catch(e) { console.log('Error:', e.message); }

  console.log('\n=== TASK 4: Add Solutions to mobile menu (ID 79) ===');
  try {
    const mobileItem = await api('POST', '/wp/v2/menu-items', {
      title: 'Solutions',
      url: 'https://www.sic.co.th/solutions/',
      status: 'publish',
      menus: 79,
      parent: 0,
      type: 'custom',
      position: 3
    });
    console.log('Added Solutions to mobile menu:', mobileItem.id ? 'ID ' + mobileItem.id : JSON.stringify(mobileItem).substring(0, 200));

    if (mobileItem.id) {
      const subPages = [
        { title: 'Automotive Security', url: 'https://www.sic.co.th/solutions/automotive-security/' },
        { title: 'Healthcare & Biosensor', url: 'https://www.sic.co.th/solutions/healthcare-biosensor/' },
        { title: 'Smart Manufacturing', url: 'https://www.sic.co.th/solutions/smart-manufacturing/' },
        { title: 'Brand Protection', url: 'https://www.sic.co.th/solutions/brand-protection/' },
      ];
      for (const sub of subPages) {
        const subItem = await api('POST', '/wp/v2/menu-items', {
          title: sub.title,
          url: sub.url,
          status: 'publish',
          menus: 79,
          parent: mobileItem.id,
          type: 'custom'
        });
        console.log('  Sub-item ' + sub.title + ':', subItem.id ? 'ID ' + subItem.id : JSON.stringify(subItem).substring(0, 150));
      }
    }
  } catch(e) { console.log('Error:', e.message); }

  console.log('\n=== TASK 5: Update hub pages with CTA content ===');
  try {
    // Get hub page IDs
    const hubSlugs = ['automotive-security', 'healthcare-biosensor', 'smart-manufacturing', 'brand-protection'];
    for (const slug of hubSlugs) {
      const pages = await api('GET', '/wp/v2/pages?slug=' + slug + '&per_page=1');
      if (pages[0]) {
        const page = pages[0];
        const currentContent = page.content.rendered || '';

        // Add CTA section if not already present
        if (!currentContent.includes('Request a Sample') && !currentContent.includes('request-sample')) {
          const ctaBlock = `
<div style="background:#f0f4f8;padding:30px;margin:30px 0;border-radius:8px;text-align:center;">
<h3 style="margin-top:0;">Ready to Get Started?</h3>
<p>Contact our engineering team for samples, datasheets, or technical consultation.</p>
<a href="/request-sample/?product=${slug}" style="display:inline-block;background:#0066cc;color:#fff;padding:12px 30px;text-decoration:none;border-radius:5px;margin:5px;font-weight:bold;">Request a Sample</a>
<a href="/talk-to-engineer/?topic=${slug}" style="display:inline-block;background:#28a745;color:#fff;padding:12px 30px;text-decoration:none;border-radius:5px;margin:5px;font-weight:bold;">Talk to an Engineer</a>
</div>`;

          const updated = await api('POST', '/wp/v2/pages/' + page.id, {
            content: currentContent + ctaBlock
          });
          console.log('Added CTAs to ' + slug + ': ' + (updated.id ? 'OK' : 'Failed'));
        } else {
          console.log(slug + ': CTAs already present');
        }
      }
    }
  } catch(e) { console.log('Error:', e.message); }

  console.log('\n=== TASK 6: Update key images alt text ===');
  try {
    // Get media items without alt text
    const media = await api('GET', '/wp/v2/media?per_page=50');
    if (Array.isArray(media)) {
      let updated = 0;
      for (const item of media) {
        if (!item.alt_text || item.alt_text.trim() === '') {
          const filename = item.source_url?.split('/').pop()?.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ') || '';
          // Generate descriptive alt text from filename
          let altText = '';
          if (filename.includes('SIC') || filename.includes('sic')) {
            altText = 'Silicon Craft ' + filename.replace(/sic/gi, '').trim() + ' RFID IC product';
          } else if (filename.includes('logo')) {
            altText = 'Silicon Craft Technology PLC logo';
          } else if (filename.includes('banner') || filename.includes('hero')) {
            altText = 'Silicon Craft Technology semiconductor solutions';
          } else {
            altText = 'Silicon Craft ' + filename;
          }

          if (altText && updated < 20) { // Limit to 20 per run
            const result = await api('POST', '/wp/v2/media/' + item.id, { alt_text: altText });
            if (result.id) {
              console.log('  Alt text set for ' + item.source_url?.split('/').pop() + ': "' + altText + '"');
              updated++;
            }
          }
        }
      }
      console.log('Updated ' + updated + ' images with alt text');
    }
  } catch(e) { console.log('Error:', e.message); }

  console.log('\n=== DONE ===');
}

main().catch(e => console.error('Fatal:', e.message));
