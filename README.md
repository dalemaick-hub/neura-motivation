# 🧠 NeuraMotivación

> App móvil de motivación asistida por IA — frases diarias, notificaciones inteligentes y recordatorios basados en neurociencia del comportamiento.

<p align="center">
  <img src="assets/images/icon.png" alt="NeuraMotivación logo" width="120" />
</p>

<p align="center">
  <a href="https://expo.dev"><img src="https://img.shields.io/badge/Expo-54.x-000020?logo=expo&logoColor=white" alt="Expo" /></a>
  <a href="https://reactnative.dev"><img src="https://img.shields.io/badge/React%20Native-0.81-61DAFB?logo=react&logoColor=white" alt="React Native" /></a>
  <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white" alt="TypeScript" /></a>
  <img src="https://img.shields.io/badge/Estado-MVP%20activo-8B5CF6" alt="Estado" />
  <img src="https://img.shields.io/badge/Licencia-MIT-green" alt="Licencia" />
</p>

---

## ✨ ¿Qué es NeuraMotivación?

NeuraMotivación es una app móvil que combina **IA generativa** con principios de **neurociencia del comportamiento** para ayudarte a:

- Recibir una frase motivacional personalizada cada día según tu estado de ánimo
- Elegir tu categoría de enfoque: Calma, Ansiedad, Amor propio, Energía o Éxito
- Guardar tus frases favoritas para consultarlas cuando las necesites
- Recibir notificaciones inteligentes que cambian de tono según el contexto

El motor de IA usa [OpenAI](https://openai.com) para generar frases frescas, con fallback local sin necesidad de conexión.

---

## 📱 Capturas de pantalla

> _Añade aquí tus screenshots cuando tengas builds disponibles_

| Inicio | Categorías | Favoritos |
|--------|-----------|-----------|
| _screenshot_ | _screenshot_ | _screenshot_ |

---

## 🏗️ Arquitectura del proyecto

```
neura-motivation/
├── app/                        # Rutas (Expo Router)
│   ├── (tabs)/
│   │   ├── index.tsx           # Pantalla principal
│   │   └── explore.tsx         # Categorías
│   ├── _layout.tsx             # Layout raíz + auth guard
│   ├── login.tsx               # Pantalla de login
│   ├── favorites.tsx           # Favoritos
│   └── settings.tsx            # Ajustes
│
├── src/
│   ├── components/             # Componentes reutilizables
│   │   ├── GradientBackground.js
│   │   └── QuoteCard.js
│   ├── data/
│   │   └── categories.js       # Categorías de motivación
│   ├── lib/
│   │   └── supabase.js         # Cliente Supabase (auth)
│   ├── screens/                # Vistas principales
│   │   ├── HomeScreen.js
│   │   ├── LoginScreen.js
│   │   ├── CategoriesScreen.js
│   │   ├── FavoritesScreen.js
│   │   └── SettingsScreen.js
│   ├── services/               # Lógica de negocio
│   │   ├── ai.js               # Motor IA (OpenAI + fallback)
│   │   ├── dailyQuote.js       # Frase del día (AsyncStorage)
│   │   ├── favorites.js        # Gestión de favoritos
│   │   ├── notifications.js    # Notificaciones programadas
│   │   └── preferences.js      # Preferencias del usuario
│   └── types/
│       └── index.ts            # Tipos TypeScript compartidos
│
├── constants/
│   └── theme.ts                # Colores, fuentes, tema
├── hooks/                      # Custom hooks
├── assets/                     # Imágenes, íconos, splash
├── .env.example                # Variables de entorno de ejemplo
├── app.config.js               # Configuración Expo (lee .env)
└── tsconfig.json
```

---

## 🚀 Instalación y puesta en marcha

### Requisitos previos

- [Node.js](https://nodejs.org) v18 o superior
- [Expo CLI](https://expo.dev/tools): `npm install -g expo-cli`
- Cuenta en [Expo](https://expo.dev) (para builds)
- Cuenta en [Supabase](https://supabase.com) (para autenticación)
- API Key de [OpenAI](https://platform.openai.com) (para IA, opcional — hay fallback local)

### 1. Clonar el repositorio

```bash
git clone https://github.com/dalemaick-hub/neura-motivation.git
cd neura-motivation
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

```bash
# Copia el archivo de ejemplo
cp .env.example .env

# Edita .env con tus claves reales
nano .env
```

Rellena las siguientes variables en `.env`:

```env
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
EXPO_PUBLIC_OPENAI_API_KEY=gsk_...  # o EXPO_PUBLIC_GROQ_API_KEY para compatibilidad temporal
```

> ⚠️ **Nunca subas tu archivo `.env` a Git.** Ya está en `.gitignore`.

### 4. Iniciar la app

```bash
# En Expo Go (iOS / Android)
npx expo start

# Solo Android
npx expo start --android

# Solo iOS
npx expo start --ios

# En el navegador (web)
npx expo start --web
```

Escanea el QR con la app **Expo Go** en tu móvil o usa un emulador.

---

## 🔑 Variables de entorno

| Variable | Descripción | Obligatoria |
|----------|-------------|-------------|
| `SUPABASE_URL` | URL de tu proyecto Supabase | Sí (para auth) |
| `SUPABASE_ANON_KEY` | Clave pública anon de Supabase | Sí (para auth) |
| `EXPO_PUBLIC_OPENAI_API_KEY` | API key de OpenAI para IA generativa | No (hay fallback) |

> La app funciona **sin OpenAI** usando frases locales de fallback. Supabase es necesario para el login.

---

## 🧠 Cómo funciona el motor de IA

El servicio `src/services/ai.js` implementa:

1. **Generación con OpenAI**: llama al endpoint de chat completions con un prompt especializado en frases motivacionales en español
2. **Sistema de exclusiones**: evita repetir frases ya vistas en el historial (últimas 15)
3. **Sanitización**: limpia la respuesta de comillas, espacios y caracteres innecesarios
4. **Fallback local**: si no hay API key o falla la red, usa un banco de frases por categoría

```
Usuario elige categoría
       ↓
¿Hay API key de OpenAI?
   ↓ Sí                ↓ No
Llama a OpenAI API   Usa frases locales
       ↓
Sanitiza respuesta
       ↓
Excluye ya vistas
       ↓
Devuelve frase final
```

---

## 📲 Notificaciones

Las notificaciones se programan localmente con `expo-notifications`:

- Se generan **7 frases únicas** al inicializar (una por día)
- Cada frase es diferente al historial almacenado
- Se envían a las **9:00 AM** cada día
- Se cancelan y regeneran cuando cambias de categoría

---

## 🗂️ Categorías disponibles

| ID | Nombre | Descripción |
|----|--------|-------------|
| `calma` | Calma | Frases de serenidad y mindfulness |
| `ansiedad` | Ansiedad | Para cuando la mente no para |
| `amor` | Amor propio | Autoestima y autovaloración |
| `energia` | Energía | Motivación para la acción |
| `exito` | Éxito | Disciplina, logros y perseverancia |

---

## 🔐 Seguridad

- Las claves de API **nunca se hardcodean** en el código fuente
- Se leen desde variables de entorno vía `app.config.js`
- El archivo `.env` está excluido de Git en `.gitignore`
- Para builds de producción usa [EAS Secrets](https://docs.expo.dev/build-reference/variables/) en lugar de `.env`
- La API key de OpenAI solo viaja en el header `Authorization` de peticiones HTTPS
- Supabase gestiona el token de sesión con `autoRefreshToken` activado

### Para producción (EAS Build)

```bash
# Instala EAS CLI
npm install -g eas-cli

# Configura tus secrets en Expo (no se guardan en el repo)
eas secret:create --scope project --name SUPABASE_URL --value "https://xxxx.supabase.co"
eas secret:create --scope project --name SUPABASE_ANON_KEY --value "eyJ..."
eas secret:create --scope project --name EXPO_PUBLIC_OPENAI_API_KEY --value "gsk_..."

# Lanza el build
eas build --platform android
```

---

## 🛣️ Roadmap

- [x] MVP: frases diarias con IA
- [x] Sistema de favoritos local
- [x] Notificaciones programadas
- [x] Login con Supabase (email/password)
- [x] Modo offline con frases de fallback
- [ ] Widget para pantalla de inicio (Expo Widgets)
- [ ] Motor de hábitos con regla de los 2 minutos
- [ ] Check-in de estado de ánimo diario
- [ ] Premium con RevenueCat (categorías extra)
- [ ] Modo oscuro mejorado
- [ ] Autenticación con Google / Apple

---

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Si eres estudiante o estás aprendiendo, es un proyecto ideal para practicar.

```bash
# Haz un fork y clona tu fork
git clone https://github.com/TU_USUARIO/neura-motivation.git

# Crea una rama para tu feature
git checkout -b feature/mi-nueva-funcionalidad

# Haz tus cambios, luego:
git add .
git commit -m "feat: descripción de tu cambio"
git push origin feature/mi-nueva-funcionalidad

# Abre un Pull Request en GitHub
```

---

## 📄 Licencia

MIT © 2025 dalemaick-hub

---

<p align="center">
  Hecho con ❤️ y React Native · <a href="https://expo.dev">Expo</a> · <a href="https://openai.com">OpenAI</a> · <a href="https://supabase.com">Supabase</a>
</p>
