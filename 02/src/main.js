import { Contract, formatUnits } from "ethers";
import { bindAction, connectedToken, output } from "./wallet.js";

// 1. Ethers usa el ABI para codificar cada llamada al contrato.
bindAction("leer", async () => {
  const { account, token } = await connectedToken();
  const [name, symbol, decimals, balance] = await Promise.all([
    token.name(),
    token.symbol(),
    token.decimals(),
    token.balanceOf(account),
  ]);

  output(
    `Nombre: ${name}\nSímbolo: ${symbol}\nDecimales: ${decimals}\nSaldo: ${formatUnits(balance, decimals)} ${symbol}\nTodas fueron lecturas, sin transacciones.`,
  );
});

// 2. Declaramos un ABI válido sintácticamente, pero con un método inexistente.
bindAction("abi-incorrecto", async () => {
  const { account, provider, token } = await connectedToken();
  const incorrectAbi = ["function balance(address) view returns (uint256)"];
  const incorrectToken = new Contract(
    await token.getAddress(),
    incorrectAbi,
    provider,
  );

  try {
    await incorrectToken.balance(account);
    output(
      "La llamada respondió; revisá si este contrato implementa balance(address).",
    );
  } catch (error) {
    // ERC-20 define balanceOf(address), no balance(address).
    output(
      `Error esperado. El ABI no coincide con el contrato.\nDetalle: ${error.shortMessage ?? error.message}`,
    );
  }
});
