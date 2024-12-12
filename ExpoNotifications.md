# Expo Push Notifications - Next.js Entegrasyonu

## 1. Dosya Yapısı

```
your-nextjs-app/
├── data/
│   └── tokens.json
├── pages/
│   ├── api/
│   │   └── notifications/
│   │       ├── register.ts
│   │       └── send.ts
│   ├── _app.tsx
│   ├── login.tsx
│   └── index.tsx
└── utils/
    └── notifications.ts
```

## 2. Token Saklama (data/tokens.json)

```json
{
  "user123": {
    "pushToken": "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]",
    "updatedAt": "2024-01-20T12:34:56.789Z"
  }
}
```

## 3. API Endpoint'leri

### Token Kayıt Endpoint'i (pages/api/notifications/register.ts)

```typescript
import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const TOKENS_FILE = path.join(process.cwd(), 'data', 'tokens.json');

// Tokens dosyasını oluştur (eğer yoksa)
if (!fs.existsSync(path.join(process.cwd(), 'data'))) {
  fs.mkdirSync(path.join(process.cwd(), 'data'));
}
if (!fs.existsSync(TOKENS_FILE)) {
  fs.writeFileSync(TOKENS_FILE, JSON.stringify({}));
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { token, userId } = req.body;

    if (!token || !userId) {
      return res.status(400).json({ 
        success: false,
        message: 'Token and userId are required' 
      });
    }

    // Mevcut token'ları oku
    const tokens = JSON.parse(fs.readFileSync(TOKENS_FILE, 'utf8'));

    // Yeni token'ı kaydet
    tokens[userId] = {
      pushToken: token,
      updatedAt: new Date().toISOString()
    };

    // Dosyaya kaydet
    fs.writeFileSync(TOKENS_FILE, JSON.stringify(tokens, null, 2));

    return res.status(200).json({ 
      success: true,
      data: { userId, pushToken: token }
    });
  } catch (error) {
    console.error('Error registering token:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
}
```

### Bildirim Gönderme Endpoint'i (pages/api/notifications/send.ts)

```typescript
import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const TOKENS_FILE = path.join(process.cwd(), 'data', 'tokens.json');

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { userId, title, message } = req.body;

    // Token'ı dosyadan oku
    const tokens = JSON.parse(fs.readFileSync(TOKENS_FILE, 'utf8'));
    const userToken = tokens[userId];

    if (!userToken?.pushToken) {
      return res.status(404).json({ 
        success: false,
        message: 'User push token not found' 
      });
    }

    // Expo push notification servisi ile bildirim gönder
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: userToken.pushToken,
        title,
        body: message,
        sound: 'default',
        priority: 'high',
      }),
    });

    const result = await response.json();
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error('Error sending notification:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Error sending notification' 
    });
  }
}
```

## 4. Login Sayfası (pages/login.tsx)

```typescript
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Login işlemleri burada yapılır
      const userData = { id: 'user123', email }; // Örnek kullanıcı verisi

      // Mobil uygulamaya userId'yi gönder
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'loginSuccess',
          userId: userData.id
        }));
      }

      // Yönlendirme
      router.push('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="appearance-none rounded-md relative block w-full px-3 py-2 border"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="appearance-none rounded-md relative block w-full px-3 py-2 border"
          />
          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Giriş Yap
          </button>
        </form>
      </div>
    </div>
  );
}
```

## 5. Bildirim Gönderme Utility (utils/notifications.ts)

```typescript
export async function sendNotification({
  userId,
  title,
  message
}: {
  userId: string;
  title: string;
  message: string;
}) {
  try {
    const response = await fetch('/api/notifications/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        title,
        message
      }),
    });

    return await response.json();
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
}
```

## 6. Örnek Kullanım

```typescript
// Herhangi bir sayfada bildirim gönderme
import { sendNotification } from '../utils/notifications';

// Bildirim gönderme fonksiyonu
const handleSendNotification = async () => {
  try {
    await sendNotification({
      userId: 'user123',
      title: 'Yeni Bildirim',
      message: 'Bu bir test bildirimidir'
    });
    alert('Bildirim başarıyla gönderildi!');
  } catch (error) {
    alert('Bildirim gönderilirken bir hata oluştu!');
  }
};
```

## 7. API Test Etme

```bash
# Token kaydetme
curl -X POST http://localhost:3000/api/notifications/register \
  -H "Content-Type: application/json" \
  -d '{"token":"ExpoToken","userId":"user123"}'

# Bildirim gönderme
curl -X POST http://localhost:3000/api/notifications/send \
  -H "Content-Type: application/json" \
  -d '{"userId":"user123","title":"Test","message":"Test message"}'
```

## 8. Güvenlik Önerileri

1. API Rate Limiting ekleyin
2. Token doğrulama sistemi kurun
3. CORS ayarlarını yapılandırın
4. Input validasyonu yapın
5. Error handling mekanizması kurun

## 9. Önemli Notlar

- tokens.json dosyasının yazma izinlerinin doğru ayarlandığından emin olun
- Büyük ölçekli uygulamalar için veritabanı kullanımı önerilir
- Expo push notification servisinin limitlerini kontrol edin
- Hata durumlarını loglamayı unutmayın
- Kullanıcı bilgilerini güvenli şekilde saklayın
