import { formatUnits, getAddress, parseUnits } from "ethers";
import { bindAction, connectedToken, element, output } from "./wallet.js";

async function transactionInput() {
  const { account, token } = await connectedToken(true);
  const decimals = await token.decimals();
  const destination = getAddress(element("destino").value.trim());
  const amountText = element("cantidad").value.trim();
  if (!amountText) throw new Error("Ingresá una cantidad.");

  // parseUnits considera los decimales reales del token (DORT usa 0).
  const amount = parseUnits(amountText, decimals);
  if (amount <= 0n) throw new Error("La cantidad debe ser mayor a cero.");
  return { account, token, destination, amount, decimals };
}

async function submitTransaction(operation) {
  const { token, destination, amount } = await transactionInput();
  output("Esperando la confirmación del usuario en MetaMask...");

  // La wallet debe firmar porque transfer y approve modifican el estado.
  const tx =
    operation === "transfer"
      ? await token.transfer(destination, amount)
      : await token.approve(destination, amount);

  output(`Transacción enviada: ${tx.hash}\nTodavía NO está confirmada.`);
  const receipt = await tx.wait();
  if (!receipt || receipt.status !== 1) {
    throw new Error("La transacción no se confirmó correctamente.");
  }
  output(
    `Confirmada en bloque ${receipt.blockNumber}\nHash: ${receipt.hash}\nExplorador: https://sepolia.etherscan.io/tx/${receipt.hash}`,
  );
}

bindAction("transferir", () => submitTransaction("transfer"));
bindAction("aprobar", () => submitTransaction("approve"));

// allowance es una lectura: cuánto puede gastar destination en nombre de account.
bindAction("allowance", async () => {
  const { account, token } = await connectedToken();
  const spender = getAddress(element("destino").value.trim());
  const decimals = await token.decimals();
  const approved = await token.allowance(account, spender);
  output(
    `Titular: ${account}\nAutorizado: ${spender}\nAllowance: ${formatUnits(approved, decimals)} DORT\napprove no transfiere tokens.`,
  );
});
