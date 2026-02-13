# UBE Chatbot

Chatbot web para la **Universidad de Educación (UBE)**. Permite a estudiantes y usuarios consultar información académica y administrativa mediante conversación con un asistente basado en IA.

---

## ¿Qué hace la aplicación?

- **Inicio de sesión**
  - **Credenciales UBE:** usuario y contraseña del SGA (Sistema de Gestión Académica).
  - **Google:** inicio de sesión con cuenta de Google (OAuth vía Supabase).

- **Chat con IA**
  - Envío de mensajes de texto al asistente.
  - Respuestas en tiempo real desde un backend de chat (configurable por URL).
  - Historial de conversaciones por usuario.

- **Accesos rápidos**
  - Para usuarios UBE: temas como pagos, horarios, plataforma virtual, certificados, vida universitaria, graduación.
  - Para otros usuarios: información general y preguntas frecuentes.

- **Entrada por voz**
  - Reconocimiento de voz en español para escribir mensajes con el micrófono (navegadores compatibles).

- **Interfaz**
  - Modo claro / oscuro (selector en el menú del avatar).
  - Barra lateral con nuevo chat, accesos rápidos e historial.
  - Páginas de Términos y condiciones y Política de privacidad.

- **Seguridad**
  - Sesión con token (localStorage). Redirección a login si no hay sesión.
  - El frontend actúa como proxy hacia el backend de chat (envío de mensajes y historial).

---

## Tecnologías

- **Next.js 15** (App Router, Turbopack)
- **React 19**
- **TypeScript**
- **Tailwind CSS 4**
- **Supabase** (auth con Google)
- **React Markdown** (respuestas del bot)
- **Lucide React** (iconos)

El backend del chat es externo: la app solo consume su API (ver variables de entorno).

---

## Requisitos

- **Node.js** 18+
- **npm** (o yarn / pnpm)

---

## Cómo levantar el proyecto en local

### 1. Clonar e instalar

```bash
git clone <url-del-repositorio>
cd ube-chatbot
npm install
```

### 2. Variables de entorno

Crea un archivo `.env.local` en la raíz con:

| Variable | Descripción |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto en Supabase (Dashboard → Settings → API). |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave anónima (anon key) de Supabase. |
| `NEXT_PUBLIC_API_URL` | URL base del backend del chat (ej. `https://tu-backend.up.railway.app`). Sin barra final. |

Ejemplo:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_API_URL=https://ube-assistant-backend-production.up.railway.app
```

### 3. Ejecutar

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000). La raíz redirige a `/auth` si no hay sesión o a `/chat` si ya estás autenticado.

### 4. Build para producción

```bash
npm run build
npm start
```

---

## Estructura principal

```
app/
  page.tsx          # Redirección / → /auth o /chat
  auth/             # Login (UBE, Google) y callback OAuth
  chat/             # Página del chat
  privacy/          # Política de privacidad
  terms/            # Términos y condiciones
  api/chat/         # Proxy al backend de chat e historial
components/         # ChatArea, ChatInput, Sidebar, AuthForm, etc.
hooks/              # useChatTheme, useSessionExpiration
public/constants/   # Accesos rápidos (UBE y general)
```

---

## Despliegue (Vercel u otro)

- Configura las mismas variables de entorno en el panel del proveedor.
- En **Supabase → Authentication → URL Configuration**, añade en **Redirect URLs** la URL de tu app, por ejemplo:  
  `https://tu-dominio.vercel.app/auth/callback`.
- El backend del chat debe aceptar peticiones desde el origen de tu frontend (CORS si aplica).

---

## Licencia

Uso en el marco del proyecto UBE. Consulta con la institución para términos concretos.
