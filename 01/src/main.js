import { formatEther } from "ethers";
import {
  bindAction,
  connectedWallet,
  output,
  SEPOLIA_CHAIN_ID,
} from "./wallet.js";

// 1. MetaMask autoriza el acceso a la cuenta
bindAction("conectar", async () => {
  const { account, network } = await connectedWallet();
  output(
    `Cuenta: ${account}\nRed (chainId): ${network.chainId}\nSepolia: ${network.chainId === SEPOLIA_CHAIN_ID}`,
  );
});

// 2. getBalance es una lectura RPC: no requiere gas ni firma de transacción.
bindAction("saldo", async () => {
  const { account, provider } = await connectedWallet();
  const wei = await provider.getBalance(account);
  output(
    `Cuenta: ${account}\nSaldo: ${formatEther(wei)} ETH\nLectura completada; no se envió una transacción.`,
  );
});

// 3. signMessage firma datos off-chain; MetaMask mostrará una autorización.
bindAction("firmar", async () => {
  const { account, signer } = await connectedWallet();
  const message = "Clase 15 - Firma de prueba";
  const signature = await signer.signMessage(message);
  output(
    `Firmante: ${account}\nMensaje: ${message}\nFirma: ${signature}\nNo se publicó una transacción en Sepolia.`,
  );
});
