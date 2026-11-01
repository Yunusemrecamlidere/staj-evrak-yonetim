# API Sözleşmesi (frontend'in beklediği)

Base URL: /api | Auth: `Authorization: Bearer <token>`
Roller: `ROLE_STUDENT`, `ROLE_ADMIN`
Statüler: `YUKLENDI`, `INCELENIYOR`, `HATALI`, `ONAYLANDI`, `TAMAMLANDI`
Hata formatı (hepsi): `{ "message": "..." }`
401 giriş yok, 403 yetkisiz.

## Auth

POST /api/auth/register
  { fullName, studentNo, email, password } -> 200
  Rol her zaman ROLE_STUDENT. studentNo, veri setiyle eşleştirme anahtarıdır.

POST /api/auth/login
  { username, password }   // username = e-posta veya öğrenci no
  -> { token, role, fullName, email }
  401 { message }  hatalı giriş
  423 { message }  5 hatalı deneme, hesap kilitli

POST /api/auth/logout -> 200 (token geçersiz kılınır)

## Öğrenci

POST /api/documents/upload
  multipart: file + info (JSON string) -> { id, status }

GET /api/documents/my
  -> [{ id, fileName, uploadedAt, status }]

GET /api/documents/{id}/report   (öğrenci kendi belgesini, admin hepsini görür)
  -> {
       "id": 2, "fileName": "ek16.pdf", "status": "HATALI", "ready": false,
       "rows": [
         { "field": "Öğrenci No", "form": "210201001", "document": "210201009",
           "dataset": "210201001", "ok": false, "message": "Belgedeki değer uyuşmuyor" }
       ]
     }
  form = öğrencinin formda girdiği, document = belgeden okunan,
  dataset = admin'in yüklediği veri seti kaydı

## Admin

POST /api/admin/dataset/import
  [ { adSoyad, tcNo, uyruk, ogrenciNo, dogumTarihi, adres, bolum,
      teslimYili, oncekiStajGunu, email, telefon, saglikYardimi } ]
  Hesap AÇMAZ, karşılaştırma için referans veridir.

GET    /api/admin/documents                   -> [{ id, studentName, fileName, uploadedAt, status }]
GET    /api/admin/documents?status=TAMAMLANDI
PUT    /api/admin/documents/{id}              { status }
DELETE /api/admin/documents/{id}