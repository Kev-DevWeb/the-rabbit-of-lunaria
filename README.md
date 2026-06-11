# The Rabbit of Lunaria 🐇🌙
> Blog y sistema de citas para lecturas de tarot, con experiencia de navegación fluida y pagos integrados

[![Next.js](https://img.shields.io/badge/Next.js-black?logo=next.js)](https://nextjs.org/)
[![Sanity](https://img.shields.io/badge/CMS-Sanity-red?logo=sanity)](https://www.sanity.io/)
[![PayPal](https://img.shields.io/badge/Pagos-PayPal-blue?logo=paypal)](https://developer.paypal.com/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com)

## ✨ Características

- 🔮 **Reserva de lecturas**: Agenda tu sesión de tarot directamente desde la web
- 💳 **Pagos integrados**: Proceso de pago seguro mediante PayPal
- 📝 **Blog**: Contenido editorial gestionado con Sanity CMS
- 🌊 **Navegación fluida**: Scroll animado con Lenis para una experiencia envolvente
- 📱 **Diseño responsivo**: Optimizado para móvil y escritorio

## 🛠️ Stack

- **Frontend**: Next.js (App Router) + React + Tailwind CSS
- **CMS**: Sanity (contenido del blog y gestión de citas)
- **Pagos**: PayPal SDK
- **Scroll**: Lenis (smooth scrolling)
- **Hosting**: Vercel

## 🚀 Instalación

```bash
git clone https://github.com/TU_USUARIO/the-rabbit-of-lunaria.git
cd the-rabbit-of-lunaria
npm install
```

Crea un archivo `.env.local` en la raíz:

```env
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=
SANITY_API_TOKEN=

# PayPal
NEXT_PUBLIC_PAYPAL_CLIENT_ID=
```

> - Credenciales de Sanity en [sanity.io/manage](https://www.sanity.io/manage)
> - Credenciales de PayPal en [developer.paypal.com](https://developer.paypal.com/)

```bash
npm run dev  # http://localhost:3000
```

## 🌐 Demo

🔗 [the-rabbit-of-lunaria.vercel.app](https://the-rabbit-of-lunaria.vercel.app/)

## 📄 Licencia

Proyecto privado — Todos los derechos reservados
