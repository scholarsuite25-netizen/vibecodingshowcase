async function checkSite(url) {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const html = await res.text();
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1] : 'No title';
    console.log(`[Status ${res.status}] ${url} -> Title: "${title}"`);
  } catch (e) {
    console.log(`[ERROR] ${url}: ${e.message}`);
  }
}

async function run() {
  await checkSite('https://mind-sync-v1-wine.vercel.app/');
  await checkSite('https://stresscheck-phi.vercel.app/');
  await checkSite('https://hope-harbour-two.vercel.app/');
}
run();
