# Demo 4 — Eventos de MetaMask

Actualizar la pantalla al cambiar de cuenta o red sin crear listeners duplicados.

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

1. Conectar MetaMask con la demo 1 para autorizar la cuenta.
2. Ingresar la dirección del token y activar los listeners.
3. Cambiar a otra cuenta autorizada y observar accountsChanged.
4. Cambiar temporalmente de red y observar chainChanged.
5. Volver a Sepolia y verificar que se actualiza el saldo.
6. Eliminar listeners y comprobar que dejan de llegar las actualizaciones.

## Qué revisar

- `src/main.js`: pasos específicos de la demo, con comentarios breves.
- `src/wallet.js`: funciones compartidas de conexión y comprobaciones de red.
- `src/styles.css`: presentación visual, separada del código JavaScript.
- `contracts/DemoORTToken.sol`: token de prueba usado en las demos 2 a 4.

## Seguridad y alcance

Solo se usa la red de pruebas **Sepolia**. Las firmas y transacciones deben hacerse con cuentas de prueba. El ejemplo está pensado para enseñanza y no para producción.
