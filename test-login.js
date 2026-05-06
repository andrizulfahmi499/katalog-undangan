fetch('https://katalog-id.vercel.app/api/auth/admin/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'admin@undanganku.com', password: 'admin' }) // Using a generic password just to trigger the DB error
}).then(async res => {
  console.log('Status:', res.status);
  console.log('Text:', await res.text());
}).catch(console.error);
