import { BrowserProvider, Contract, getAddress } from "ethers";

// Ethereum Sepolia: evita ejecutar las operaciones sobre otra red.
export const SEPOLIA_CHAIN_ID = 11155111n;

// ABI mínimo: solo las funciones que utiliza esta clase.
export const TOKEN_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function balanceOf(address) view returns (uint256)",
  "function allowance(address,address) view returns (uint256)",
  "function transfer(address,uint256) returns (bool)",
  "function approve(address,uint256) returns (bool)",
];

export function element(id) {
  const node = document.getElementById(id);
  if (!node) throw new Error(`Falta el elemento #${id} en index.html`);
  return node;
}

export function output(message) {
  element("resultado").textContent = String(message);
}

export function explainError(error) {
  if (error?.code === "ACTION_REJECTED" || error?.code === 4001) {
    return "Operación rechazada por el usuario en MetaMask.";
  }
  return (
    error?.shortMessage ?? error?.reason ?? error?.message ?? String(error)
  );
}

// Cada botón informa el resultado y se desactiva mientras trabaja.
export function bindAction(id, handler) {
  const button = element(id);
  button.addEventListener("click", async () => {
    button.disabled = true;
    try {
      await handler();
    } catch (error) {
      console.error(error);
      output(`Error: ${explainError(error)}`);
    } finally {
      button.disabled = false;
    }
  });
}

export function ethereumProvider() {
  if (!window.ethereum) {
    throw new Error("MetaMask no está disponible en este navegador.");
  }
  return window.ethereum;
}

export function createProvider() {
  // BrowserProvider adapta el proveedor EIP-1193 de MetaMask a Ethers v6.
  return new BrowserProvider(ethereumProvider());
}

export async function connectedWallet() {
  const provider = createProvider();
  await provider.send("eth_requestAccounts", []);
  const network = await provider.getNetwork();
  const signer = await provider.getSigner();
  const account = await signer.getAddress();
  return { provider, network, signer, account };
}

export function requireSepolia(network) {
  if (network.chainId !== SEPOLIA_CHAIN_ID) {
    throw new Error(
      `Red incorrecta (${network.chainId}). Seleccioná Ethereum Sepolia.`,
    );
  }
}

export function configuredTokenAddress() {
  const address = element("token").value.trim();
  if (!address)
    throw new Error("Ingresá la dirección del token desplegado en Sepolia.");
  return getAddress(address);
}

export async function connectedToken(writable = false) {
  const context = await connectedWallet();
  requireSepolia(context.network);
  const address = configuredTokenAddress();
  if ((await context.provider.getCode(address)) === "0x") {
    throw new Error("No existe un contrato en esa dirección de Sepolia.");
  }
  // Provider: lecturas. Signer: transacciones que debe firmar MetaMask.
  const runner = writable ? context.signer : context.provider;
  return { ...context, token: new Contract(address, TOKEN_ABI, runner) };
}
