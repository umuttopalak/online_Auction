# Çalıştırmak İçin;

Backend;

 > cd backend<br>
 > pip install -r requirements.txt

 Backend klasörü içinde .env dosyası oluşturulmalıdır ve bu dosyanın içine DATABASE_URL ve REDİS_HOST bilgileri girilmelidir
 > uvicorn main:app --reload

Frontend;
 >cd frontend<br>

 Frontend klasörü içinde .env dosyası oluşturulmalıdır ve bu dosyanın içine REACT_APP_BACK_END_HOST ve REACT_APP_BACK_END_PORT bilgileri girilmelidir
 >npm install<br>
 >npm run build<br>
 >npm start<br>

Database;<br>
 -postgresql

---

# Docker-compose ile Çalıştırmak İçin
>docker-compose --build -d

---
# Kısaca Proje Hakkında Bilgi;
Projemde frontend olarak react kullanılıyor ve sadece pythonda oluşturulmuş fast api ile iletişime geçiyor. <br>
Api ise hem postgresql database hem de redis ile iletişime geçiyor.

Kullanıcı sisteme üye oluyor ve bu bilgi api ile database'e kayıt ediliyor. Giriş yaptığında api response olarak token döndürüyor ve redise kullanıcının kullanıcı adı ve token'iyle kayıt ediyor. Bu sırada reacttada token ve kullanıcı adı localde depolanıyor.<br>

Giriş yaptıktan sonra ana sayfaya yönlendiriliyor bu sayfada fast api da oluşturduğum websocket dinlenmeye alıyor ve ürünlerin bilgilerini databaseden çekip react'a gönderiyor.<br>

Teklif verildiği zaman websocket üzerinden mesaj gönderiliyor. Bu mesaj sonucunda ürün databasede güncellenip tekrardan websocketle iletiliyor.Bunun sayesinde kullanıcı sayfayı yenilemeden güncel fiyatı ve fiyatı veren kişiyi görebiliyor.<br>

Kullanıcı çıkış yaptığında ise api'a istek gidiyor bu istekte kullanıcının rediste depolanan bilgileri siliniyor.
