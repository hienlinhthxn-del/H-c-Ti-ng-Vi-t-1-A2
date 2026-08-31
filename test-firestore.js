const fetch = require('node:fetch');

async function test() {
  const projectId = 'gen-lang-client-0911670550';
  const url = 'https://firestore.googleapis.com/v1/projects/' + projectId + '/databases/(default)/documents/test_collection';
  try {
    const res = await fetch(url);
    const data = await res.json();
    console.log('Response:', data);
  } catch (e) {
    console.error('Error:', e);
  }
}
test();