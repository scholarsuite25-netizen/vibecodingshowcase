const Papa = require('papaparse');

async function run() {
  const res = await fetch('https://docs.google.com/spreadsheets/d/1YFFiiywd1aLrUd2CV_u_MwCSdN1w94H_VnP1bXAs2xQ/export?format=csv');
  const text = await res.text();
  const parsed = Papa.parse(text, { header: true });
  const rows = parsed.data.filter(r => r['Surname & Other Names'] && r['Surname & Other Names'].trim() !== '');

  console.log('--- ALL GROUP SUBMISSIONS ---');
  const groupCounts = {};
  rows.forEach((r, i) => {
    const groupName = r['Group Name eg Stress alias Serenity'];
    const groupUrl = r['Group Work URLMembers of the Group Share same URL'] || r['Group Work URL\nMembers of the Group Share same URL'];
    console.log(`[${i+1}] ${r['Surname & Other Names']} -> GroupName: "${groupName}" | GroupUrl: "${groupUrl}"`);
    if (!groupCounts[groupName]) groupCounts[groupName] = [];
    groupCounts[groupName].push(groupUrl);
  });
  console.log('\nGroup summary:', groupCounts);
}
run();
