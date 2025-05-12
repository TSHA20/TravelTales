const axios = require('axios');

exports.getCountries = async (req, res) => {
  try {
    const response = await axios.get('https://restcountries.com/v3.1/all');
    const countries = response.data.map(country => ({
      name: country.name.common,
      code: country.cca2
    }));
    res.json(countries);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch countries' });
  }
};

exports.getCountryDetails = async (req, res) => {
  const { name } = req.params;
  try {
    const response = await axios.get(`https://restcountries.com/v3.1/name/${name}`);
    const country = response.data[0];
    res.json({
      name: country.name.common,
      capital: country.capital ? country.capital[0] : 'N/A',
      currency: country.currencies ? Object.values(country.currencies)[0].name : 'N/A',
      flag: country.flags.png
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch country details' });
  }
};