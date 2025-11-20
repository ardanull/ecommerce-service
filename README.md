# E-commerce Service (ecommerce-service)

## Özellikler

- Node.js + TypeScript + Express
- PostgreSQL + TypeORM
- Ürün & kategori yönetimi
- Sipariş oluşturma ve kullanıcıya özel sipariş listeleme
- Basit filtreleme & sayfalama
- JWT tabanlı auth entegrasyonu (başka bir auth-service ile kullanılabilir)
- Katmanlı mimari (routes / service / entity)
- Request validation (class-validator)
- Docker & docker-compose ile kolay kurulum

## Mimari

- **Products**
  - Ürün CRUD
  - Filtreleme: kategori, min/max fiyat, arama (name/description)
- **Categories**
  - Kategori CRUD
- **Orders**
  - Auth gerektiren sipariş oluşturma
  - Kullanıcının kendi siparişlerini listeleme
  - Admin için tüm siparişleri listeleme

## Ortam Değişkenleri

`.env.example` dosyasını `.env` olarak kopyalayın ve gerekirse düzenleyin:

```bash
cp .env.example .env
```

## Docker ile Çalıştırma

```bash
docker-compose up --build
```

- API: `http://localhost:4001`
- PostgreSQL: host `localhost`, port `5434` (container içi 5432)

## Lokal Çalıştırma (PostgreSQL yüklüyse)

```bash
npm install
npm run dev
```

## Örnek İstekler

### 1. Ürün oluşturma (ADMIN)

```bash
curl -X POST http://localhost:4001/api/products \

  -H "Content-Type: application/json" \

  -H "Authorization: Bearer <ADMIN_ACCESS_TOKEN>" \

  -d '{
    "name": "MacBook Pro 16",
    "description": "Güçlü bir laptop",
    "price": 59999.90,
    "stock": 10,
    "categoryId": "<CATEGORY_ID>"
  }'
```

### 2. Ürün listeleme (herkese açık)

```bash
curl "http://localhost:4001/api/products?page=1&limit=10&minPrice=100&maxPrice=1000&search=mouse"
```

### 3. Sipariş oluşturma (USER)

```bash
curl -X POST http://localhost:4001/api/orders \

  -H "Content-Type: application/json" \

  -H "Authorization: Bearer <USER_ACCESS_TOKEN>" \

  -d '{
    "items": [
      { "productId": "<PRODUCT_ID_1>", "quantity": 1 },
      { "productId": "<PRODUCT_ID_2>", "quantity": 2 }
    ]
  }'
```

### 4. Kullanıcının kendi siparişleri

```bash
curl http://localhost:4001/api/orders/me \

  -H "Authorization: Bearer <USER_ACCESS_TOKEN>"
```

