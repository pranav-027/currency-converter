const getCurrencyConversionRate = async (fromCurrency, toCurrency) => {
  let currencyAPIURl =
    "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/" +
    fromCurrency +
    ".json";
  try {
    let response = await fetch(currencyAPIURl);
    if (!response.ok) throw new Error("Network response was not ok");
    let data = await response.json();
    return data[fromCurrency][toCurrency].toFixed(4);
  } catch (error) {
    console.error("Error fetching currency rates:", error);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  convertCurrency();
});

const getFlagURL = (currencyCode) => {
  countryCode = countryList[currencyCode.toUpperCase()];
  return "https://flagsapi.com/" + countryCode + "/flat/64.png";
};

const getCurrencySymbol = (currencyCode) => {
  const currency = currencySymbols.find(
    (item) => item.abbreviation === currencyCode.toUpperCase(),
  );
  return currency && currency.symbol
    ? currency.symbol
    : currencyCode.toUpperCase();
};

const updateFlag = (element) => {
  let img = element.parentElement.querySelector("img");
  img.src = getFlagURL(element.value);
};

const exchangeRateElement = document.getElementById("exchange-rate");

const updateExchangeRate = async () => {
  const fromCurrency = document.querySelector(".from select").value;
  const toCurrency = document.querySelector(".to select").value;
  const conversionRate = await getCurrencyConversionRate(
    fromCurrency,
    toCurrency,
  );
  exchangeRateElement.textContent = `Exchange Rate: 1 ${fromCurrency.toUpperCase()} = ${conversionRate} ${toCurrency.toUpperCase()}`;
  return { conversionRate, toCurrency };
};

const convertCurrency = async () => {
  const amount = document.getElementById("input-amount").value;
  console.log(amount);
  const { conversionRate, toCurrency } = await updateExchangeRate();
  const finalAmount = (amount * conversionRate).toFixed(2);
  const currencySymbol = getCurrencySymbol(toCurrency);
  document.getElementById("converted-amount").innerHTML =
    `${currencySymbol} ${finalAmount}`;
};

const dropdowns = document.querySelectorAll("select");
for (let select of dropdowns) {
  for (let code in countryList) {
    let option = document.createElement("option");
    option.value = code.toLowerCase();
    option.textContent = code;
    if (select.name === "from-currency" && code === "USD") {
      option.selected = "selected";
    } else if (select.name === "to-currency" && code === "INR") {
      option.selected = "selected";
    }
    select.append(option);
  }

  select.addEventListener("change", async (event) => {
    updateFlag(event.target);
    await updateExchangeRate();
    document.getElementById("converted-amount").value = "";
  });
}

const button = document.getElementById("convert");
button.addEventListener("click", async (event) => {
  event.preventDefault();
  convertCurrency();
});
