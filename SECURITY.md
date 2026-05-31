# 🔐 Guía de Seguridad — NeuraMotivación

## Principios aplicados en este proyecto

### 1. Las claves nunca están en el código

Todas las claves de API y secretos se guardan en variables de entorno, **nunca** como strings en el código fuente.

```js
// ❌ MAL — nunca hagas esto
const API_KEY = 'gsk_abc123...';

// ✅ BIEN — así está implementado
const API_KEY = Constants.expoConfig?.extra?.EXPO_PUBLIC_OPENAI_API_KEY ?? Constants.expoConfig?.extra?.EXPO_PUBLIC_GROQ_API_KEY;
```

### 2. El archivo `.env` está en `.gitignore`

El archivo `.env` con tus claves reales **nunca se sube a GitHub**. Solo se sube `.env.example` con valores de ejemplo.

### 3. Flujo de variables de entorno

```
Desarrollo local:
  .env → app.config.js → Constants.expoConfig.extra → servicios

Producción (EAS Build):
  EAS Secrets → app.config.js → Constants.expoConfig.extra → servicios
```

### 4. Timeout en peticiones de red

El servicio de IA tiene un timeout de 8 segundos para evitar peticiones colgadas:

```ts
const controller = new AbortController();
const timer = setTimeout(() => controller.abort(), 8000);
```

### 5. Validación de respuestas de la API

Siempre se valida el status HTTP y la estructura de la respuesta antes de usarla.

---

## Checklist antes de subir a GitHub

- [ ] `.env` está en `.gitignore` ✓
- [ ] No hay strings de API keys en ningún archivo `.ts` / `.js` / `.tsx`
- [ ] `app.config.js` solo lee de `process.env`, no tiene valores hardcodeados
- [ ] El repositorio es **privado** si contiene lógica de negocio sensible

## Para producción con EAS

```bash
# Instala EAS CLI
npm install -g eas-cli
eas login

# Añade los secrets (se guardan en servidores de Expo, no en tu repo)
eas secret:create --scope project --name SUPABASE_URL --value "https://..."
eas secret:create --scope project --name SUPABASE_ANON_KEY --value "eyJ..."
eas secret:create --scope project --name EXPO_PUBLIC_OPENAI_API_KEY --value "gsk_..."

# Lanza el build — Expo inyecta los secrets automáticamente
eas build --platform android --profile production
```

## Reportar vulnerabilidades

Si encuentras un problema de seguridad, **no abras un Issue público**. Contáctanos directamente.