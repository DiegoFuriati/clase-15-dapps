# Conexión y firma

Diferenciar provider y signer; consultar la cuenta y firmar un mensaje sin transacción.

## Requisitos

- Node.js LTS y npm.
- Chrome o navegador compatible con MetaMask.
- Cuenta de prueba en Ethereum Sepolia.

## Iniciar

```bash
npm install
npm run dev
```

Abrir la dirección local indicada por Vite (normalmente `http://127.0.0.1:5173`).

## Guía para la demostración

1. Conectar MetaMask y comprobar la cuenta seleccionada.
2. Consultar el saldo: no se solicita una firma de transacción.
3. Firmar el mensaje: MetaMask solicita una firma, pero no se paga gas.
4. Comparar provider (lectura) con signer (firma).

## Qué revisar

- `src/main.js`: pasos específicos de la demo, con comentarios breves.
- `src/wallet.js`: funciones compartidas de conexión y comprobaciones de red.
- `src/styles.css`: presentación visual, separada del código JavaScript.
- `contracts/DemoORTToken.sol`: token de prueba usado en las demos 2 a 4.


