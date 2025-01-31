import { ArrowRightLeft } from "lucide-react";
import { useEffect, useState } from "react";

const CURRENCIES = {
  USD: "Dólar Americano",
  EUR: "Euro",
  BRL: "Real Brasileiro",
  GBP: "Libra Esterlina",
  JPY: "Iene Japonês",
  AUD: "Dólar Australiano",
  CAD: "Dólar Canadense",
  CHF: "Franco Suíço",
  CNY: "Yuan Chinês",
  ARS: "Peso Argentino",
};

function App() {
  const [amount, setAmount] = useState<string>("1");
  const [fromCurrency, setFromCurrency] = useState<string>("BRL");
  const [toCurrency, setToCurrency] = useState<string>("USD");
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleConversion = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(
        `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`
      );
      const data = await response.json();
      const rate = data.rates[toCurrency];
      const result = parseFloat(amount) * rate;
      setConvertedAmount(result);
    } catch (err) {
      setError("Erro ao converter moeda. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  useEffect(() => {
    if (amount && fromCurrency && toCurrency) {
      handleConversion();
    }
  }, [amount, fromCurrency, toCurrency]);

  const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: currency,
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Conversor de Moedas
        </h1>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Valor
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Digite o valor"
            />
          </div>

          <div className="grid grid-cols-[1fr,auto,1fr] gap-4 items-center">
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {Object.entries(CURRENCIES).map(([code, name]) => (
                <option key={code} value={code}>
                  {code} - {name}
                </option>
              ))}
            </select>

            <button
              onClick={handleSwapCurrencies}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              title="Inverter moedas"
            >
              <ArrowRightLeft className="text-gray-500 hover:text-blue-500 transition-colors duration-200" />
            </button>

            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {Object.entries(CURRENCIES).map(([code, name]) => (
                <option key={code} value={code}>
                  {code} - {name}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div className="text-red-500 text-center text-sm">{error}</div>
          )}

          {loading ? (
            <div className="text-center text-gray-600">Convertendo...</div>
          ) : (
            convertedAmount && (
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-sm text-gray-600 mb-1">
                  {formatCurrency(parseFloat(amount), fromCurrency)} =
                </div>
                <div className="text-2xl font-bold text-gray-800">
                  {formatCurrency(convertedAmount, toCurrency)}
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
