import { callOpenRouter } from '../services/openRouterService.js';

export const generateComponent = async (req, res) => {
  const { prompt } = req.body;

  try {
    const result = await callOpenRouter(prompt); // { jsx, css }
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
