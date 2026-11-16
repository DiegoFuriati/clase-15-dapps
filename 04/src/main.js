import { Contract, formatUnits } from "ethers";
import {
  bindAction,
  configuredTokenAddress,
  createProvider,
  element,
  ethereumProvider,
  explainError,
  output,
  SEPOLIA_CHAIN_ID,
  TOKEN_ABI,
} from "./wallet.js";

let listening = false;
let refreshId = 0;
let onAccountsChanged;
let onChainChanged;

// eth_accounts consulta las cuentas ya autorizadas; no abre MetaMask.
// Esto permite manejar también una desconexión sin solicitar permisos otra vez.
async function refresh(reason = "Consulta manual", eventState = {}) {
  const requestId = ++refreshId;
  output(`${reason}\nActualizando datos...`);
  try {
    const ethereum = ethereumProvider();
    const accounts = eventState.accounts ?? (await ethereum.request({ method: "eth_accounts" }));

    if (requestId !== refreshId) return; // descarta respuestas de consultas anteriores
    if (accounts.length === 0) {
      output(`${reason}\nNo hay ninguna cuenta autorizada.`);
      return;
    }

    // Consultar eth_chainId directamente evita la caché de red de BrowserProvider.
    const chainId = BigInt(
      eventState.chainId ?? (await ethereum.request({ method: "eth_chainId" })),
    );
    if (requestId !== refreshId) return;
    const account = accounts[0];

    if (chainId !== SEPOLIA_CHAIN_ID) {
      output(
        `${reason}\nCuenta: ${account}\nRed: ${chainId}\nSeleccioná Sepolia. Se invalidó el saldo anterior.`,
      );
      return;
    }

    if (!element("token").value.trim()) {
      output(
        `${reason}\nCuenta: ${account}\nSepolia conectada. Falta la dirección del token.`,
      );
      return;
    }

    const provider = createProvider();
    const address = configuredTokenAddress();
    if ((await provider.getCode(address)) === "0x") {
      throw new Error("La dirección no contiene un contrato en Sepolia.");
    }
    if (requestId !== refreshId) return;
    const token = new Contract(address, TOKEN_ABI, provider);
    const [decimals, balance] = await Promise.all([
      token.decimals(),
      token.balanceOf(account),
    ]);
    if (requestId !== refreshId) return;
    output(
      `${reason}\nCuenta: ${account}\nRed: Sepolia\nSaldo: ${formatUnits(balance, decimals)} DORT`,
    );
  } catch (error) {
    if (requestId === refreshId) {
      output(`Error al actualizar: ${explainError(error)}`);
    }
  }
}

function refreshAfterEvent(eventName, eventState) {
  // No se muestran datos anteriores mientras se solicita el nuevo estado.
  void refresh(eventName, eventState);
}

bindAction("activar", async () => {
  const ethereum = ethereumProvider();
  if (listening) {
    output("Los listeners ya estaban registrados.");
    return;
  }
  onAccountsChanged = (accounts) =>
    refreshAfterEvent("accountsChanged", { accounts });
  onChainChanged = (chainId) =>
    refreshAfterEvent("chainChanged", { chainId });
  ethereum.on("accountsChanged", onAccountsChanged);
  ethereum.on("chainChanged", onChainChanged);
  listening = true;
  refreshAfterEvent("Listeners activos");
});

bindAction("desactivar", async () => {
  if (listening) {
    const ethereum = ethereumProvider();
    ethereum.removeListener("accountsChanged", onAccountsChanged);
    ethereum.removeListener("chainChanged", onChainChanged);
  }
  listening = false;
  onAccountsChanged = undefined;
  onChainChanged = undefined;
  ++refreshId; // invalida una consulta aún pendiente
  output("Listeners eliminados.");
});

bindAction("refrescar", () => refresh());

// Elimina los listeners si se abandona la página.
window.addEventListener("pagehide", () => {
  if (!listening) return;
  const ethereum = ethereumProvider();
  ethereum.removeListener("accountsChanged", onAccountsChanged);
  ethereum.removeListener("chainChanged", onChainChanged);
  listening = false;
});
