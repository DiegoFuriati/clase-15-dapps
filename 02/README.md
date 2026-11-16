# ABI y lecturas

Consultar un ERC-20 y observar qué pasa si usamos una función que el contrato no implementa.

## Requisitos

- Node.js LTS y npm.
- Chrome o navegador compatible con MetaMask.
- Cuenta de prueba en Ethereum Sepolia.
- Contrato `DemoORTToken.sol` desplegado en Sepolia.

## Iniciar

```bash
npm install
npm run dev
```

Abrir la dirección local indicada por Vite (normalmente `http://127.0.0.1:5173`).

## Configuración del token

Desplegar `contracts/DemoORTToken.sol` desde Remix con MetaMask conectado a Sepolia. El desplegador recibe 1000 DORT (0 decimales). Ingresar la dirección en la interfaz o copiar `.env.example` a `.env` y configurar `VITE_TOKEN_ADDRESS`. **No pegar claves privadas en `.env` ni en GitHub.**

## Guía para la demostración

1. Desplegar DemoORTToken en Sepolia e ingresar su dirección.
2. Consultar name, symbol, decimals y balanceOf.
3. Ejecutar ABI incorrecto y observar el error.
4. Explicar que el ABI describe la interfaz, pero no agrega funciones al contrato.

## Qué revisar

- `src/main.js`: pasos específicos de la demo, con comentarios breves.
- `src/wallet.js`: funciones compartidas de conexión y comprobaciones de red.
- `src/styles.css`: presentación visual, separada del código JavaScript.
- `contracts/DemoORTToken.sol`: token de prueba usado en las demos 2 a 4.
