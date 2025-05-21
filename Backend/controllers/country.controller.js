const axios = require('axios');

const getCountries = async (req, res) => {
  try {
    const response = await axios.get('https://restcountries.com/v3.1/all');
    const countries = response.data.map(country => ({
      name: country.name.common,
      code: country.cca2,
      capital: country.capital ? country.capital[0] : 'N/A',
      currency: country.currencies ? {
        code: Object.keys(country.currencies)[0],
        name: Object.values(country.currencies)[0].name,
        symbol: Object.values(country.currencies)[0].symbol || 'N/A'
      } : { code: 'N/A', name: 'N/A', symbol: 'N/A' },
      languages: country.languages ? Object.values(country.languages) : [],
      flag: country.flags.png
    }));
    res.json(countries);
  } catch (error) {
    console.error('Error fetching countries:', error.message);
    res.status(500).json({ error: 'Failed to fetch countries' });
  }
};

const getCountryDetails = async (req, res) => {
  const { name } = req.params;
  try {
    const response = await axios.get(`https://restcountries.com/v3.1/name/${name}`);
    const country = response.data[0];
    if (!country) {
      return res.status(404).json({ error: 'Country not found' });
    }
    res.json({
      name: country.name.common,
      code: country.cca2,
      capital: country.capital ? country.capital[0] : 'N/A',
      currency: country.currencies ? {
        code: Object.keys(country.currencies)[0],
        name: Object.values(country.currencies)[0].name,
        symbol: Object.values(country.currencies)[0].symbol || 'N/A'
      } : { code: 'N/A', name: 'N/A', symbol: 'N/A' },
      languages: country.languages ? Object.values(country.languages) : [],
      flag: country.flags.png
    });
  } catch (error) {
    console.error('Error fetching country details:', error.message);
    res.status(500).json({ error: 'Failed to fetch country details' });
  }
};

module.exports = { getCountries, getCountryDetails };