async function query() {
  const projectId = "gen-lang-client-0359909238";
  const databaseId = "ai-studio-ailiteracyshowca-eb2258dd-ec30-4860-96a3-4bce4c48bca7";
  const apiKey = "AIzaSyCPtd7pnHZJQ4GDVsymUsVBrkYjPyZpeJY";

  // Let's check Firestore REST API
  // https://firestore.googleapis.com/v1/projects/{projectId}/databases/{databaseId}/documents/{collection}
  const collections = ['showcase', 'projects', 'submissions', 'videos', 'websites', 'students', 'showcases', 'studentSubmissions', 'gst206', 'works'];

  for (const col of collections) {
    try {
      const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${databaseId}/documents/${col}?key=${apiKey}`;
      const res = await fetch(url);
      const json = await res.json();
      if (json.documents) {
        console.log(`FOUND collection "${col}" with ${json.documents.length} documents!`);
        console.log(JSON.stringify(json.documents.slice(0, 2), null, 2));
      } else {
        console.log(`Collection "${col}":`, json.error ? json.error.message : 'empty/no documents');
      }
    } catch (e) {
      console.error(e);
    }
  }
}
query();
