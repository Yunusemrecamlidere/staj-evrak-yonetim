export const MOCK_REPORT = {
  fileName: 'ek16_ali.pdf',
  status: 'HATALI',
  ready: false,
  rows: [
    { field: 'Ad Soyad',    form: 'Ali Veli',    document: 'Ali Veli',    dataset: 'Ali Veli',    ok: true },
    { field: 'Kimlik No',   form: '12345678901', document: '12345678901', dataset: '12345678901', ok: true },
    { field: 'Öğrenci No',  form: '210201001',   document: '210201009',   dataset: '210201001',   ok: false, message: 'Belgedeki değer uyuşmuyor' },
    { field: 'Bölüm',       form: 'Yazılım Mühendisliği', document: 'Yazılım Mühendisliği', dataset: 'Yazılım Mühendisliği', ok: true },
    { field: 'E-posta',     form: 'ali@mail.com', document: '',           dataset: 'ali@mail.com', ok: false, message: 'Belgede boş' },
  ],
};