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

const updateFlag = (element) => {
  let img = element.parentElement.querySelector("img");
  img.src = getFlagURL(element.value);
};

const convertCurrency = async () => {
  const amount = document.getElementById("input-amount").value;
  console.log(amount);
  const fromCurrency = document.querySelector(".from select").value;
  console.log(fromCurrency);
  const toCurrency = document.querySelector(".to select").value;
  console.log(toCurrency);
  const conversionRate = await getCurrencyConversionRate(
    fromCurrency,
    toCurrency,
  );
  exchangeRateElement.textContent = `Exchange Rate: 1 ${fromCurrency.toUpperCase()} = ${conversionRate} ${toCurrency.toUpperCase()}`;
  const finalAmount = (amount * conversionRate).toFixed(2);
  document.getElementById("converted-amount").textContent = finalAmount;
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

  select.addEventListener("change", (event) => {
    updateFlag(event.target);
    document.getElementById("converted-amount").value = "";
  });
}

const button = document.getElementById("convert");

const exchangeRateElement = document.getElementById("exchange-rate");

button.addEventListener("click", async (event) => {
  event.preventDefault();
  convertCurrency();
});
