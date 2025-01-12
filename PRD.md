# TravelRoute - Tourist Transportation Guide 🗺️ 🚌

TravelRoute, turistlerin seyahat planlamasını kolaylaştıran ve toplu taşıma rotalarını optimize eden bir mobil uygulamadır. Kullanıcılar, ziyaret etmek istedikleri yerleri seçebilir ve bu lokasyonlar arasında en uygun toplu taşıma rotalarını görüntüleyebilirler.

## 🎯 Proje Amacı

Turistlerin yeni bir şehirde:
- Ziyaret etmek istedikleri yerleri kolayca planlamalarını sağlamak
- Toplu taşıma rotalarını optimize etmek
- Şehir içi ulaşımı daha verimli hale getirmek
- Seyahat deneyimini iyileştirmek

## 🛠️ Teknoloji Stack

### Frontend
- **React Native** - Cross-platform mobil uygulama geliştirme
- **Redux/Context API** - State management
- **React Navigation** - Navigasyon yönetimi
- **Google Maps React Native** - Harita entegrasyonu

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL veritabanı
- **JWT** - Authentication

### API Entegrasyonları
- Google Maps API
- Google Transit API
- Geocoding API

## 📱 Temel Özellikler (MVP)

### 👤 Kullanıcı Yönetimi
- Kayıt olma
- Giriş yapma
- Profil yönetimi

### 🗺️ Rota Planlama
- Haritadan lokasyon seçme
- Ziyaret noktalarını listeleme
- Rota sıralaması
- Rota kaydetme

### 🚌 Navigasyon
- Toplu taşıma rotaları
- Süre ve maliyet bilgisi
- Alternatif rotalar
- Canlı konum takibi

## 📱 Uygulama Akışı

### 1. Giriş ve Onboarding
```
Splash Screen → Onboarding → Giriş/Kayıt
```

### 2. Ana Uygulama Akışı
```
Ana Ekran
├── Harita Tab
│   ├── Lokasyon Arama
│   ├── Rota Oluşturma
│   └── Aktif Navigasyon
├── Rotalarım Tab
│   ├── Kayıtlı Rotalar
│   └── Rota Detayları
└── Profil Tab
    ├── Kullanıcı Bilgileri
    └── Ayarlar
```

## 🚀 Kurulum

### Gereksinimler
- Node.js (v14 veya üzeri)
- npm veya yarn
- React Native CLI
- MongoDB
- Xcode (iOS için)
- Android Studio (Android için)

### Frontend Kurulum
```bash
# Projeyi klonlayın
git clone [repo-url]

# Proje dizinine gidin
cd travelroute

# Bağımlılıkları yükleyin
npm install

# iOS için pod kurulumu
cd ios && pod install && cd ..

# Uygulamayı başlatın
# iOS
npm run ios

# Android
npm run android
```

### Backend Kurulum
```bash
# Backend dizinine gidin
cd backend

# Bağımlılıkları yükleyin
npm install

# .env dosyasını oluşturun
cp .env.example .env

# Sunucuyu başlatın
npm run dev
```

## 🔑 Ortam Değişkenleri

Backend için `.env` dosyasında aşağıdaki değişkenleri tanımlayın:

```env
PORT=3000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

## 📦 Veritabanı Şeması

### User Collection
```javascript
{
  _id: ObjectId,
  email: String,
  password: String,
  name: String,
  createdAt: Date
}
```

### Route Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  name: String,
  locations: [{
    name: String,
    latitude: Number,
    longitude: Number,
    order: Number
  }],
  createdAt: Date
}
```

## 🔜 Gelecek Özellikler

- Sosyal özellikler (rota paylaşımı)
- Popüler rotaları keşfetme
- Rota değerlendirme ve yorumlama
- Offline harita desteği
- Çoklu dil desteği
- Push notification sistemi
- Toplu taşıma bilet entegrasyonu

## 📊 Başarı Metrikleri

- Kullanıcı kayıt sayısı
- Günlük aktif kullanıcı sayısı
- Oluşturulan rota sayısı
- Tamamlanan navigasyon sayısı
- Uygulama kullanım süresi
- Kullanıcı memnuniyet oranı

## 🤝 Katkıda Bulunma

1. Projeyi fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'feat: Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📝 Lisans

Bu proje [MIT](LICENSE) lisansı altında lisanslanmıştır.

## 📞 İletişim

Proje Sahibi - [@your_twitter](https://twitter.com/your_twitter)

Proje Linki: [https://github.com/yourusername/travelroute](https://github.com/yourusername/travelroute) 