
import { GoogleGenAI, Type } from "@google/genai";
import { ChartDataPoint, WidgetType } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const generatePrompt = (type: WidgetType): string => {
  switch (type) {
    case WidgetType.BAR_CHART:
      return "Generate JSON data for a bar chart showing monthly recurring revenue (MRR) for the last 6 months. The JSON must be an array of objects, where each object has a 'name' (string, e.g., 'Jan') and 'revenue' (number) key.";
    case WidgetType.LINE_CHART:
      return "Generate JSON data for a line chart showing user signups per day for the last 7 days. The JSON must be an array of objects, where each object has a 'name' (string, e.g., 'Day 1') and 'signups' (number) key.";
    case WidgetType.AREA_CHART:
        return "Generate JSON data for an area chart showing website traffic from two sources (Organic, Paid) over the last 6 months. The JSON must be an array of objects, each with a 'name' (string, e.g., 'Jan'), 'Organic' (number), and 'Paid' (number) key.";
    default:
      throw new Error("Unsupported chart type for data generation.");
  }
};

// FIX: Create a dynamic schema based on the chart type to ensure the Gemini API response is correctly structured.
const getChartDataSchema = (type: WidgetType) => {
  const baseProperties = {
    name: { type: Type.STRING },
  };
  let additionalProperties = {};
  let required = ['name'];

  switch (type) {
    case WidgetType.BAR_CHART:
      additionalProperties = { revenue: { type: Type.NUMBER } };
      required.push('revenue');
      break;
    case WidgetType.LINE_CHART:
      additionalProperties = { signups: { type: Type.NUMBER } };
      required.push('signups');
      break;
    case WidgetType.AREA_CHART:
      additionalProperties = {
        Organic: { type: Type.NUMBER },
        Paid: { type: Type.NUMBER },
      };
      required.push('Organic', 'Paid');
      break;
  }

  return {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        ...baseProperties,
        ...additionalProperties,
      },
      required: required,
    },
  };
};

export const generateChartData = async (type: WidgetType.BAR_CHART | WidgetType.LINE_CHART | WidgetType.AREA_CHART): Promise<ChartDataPoint[]> => {
  try {
    const prompt = generatePrompt(type);
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: getChartDataSchema(type),
      },
    });
    
    const jsonString = response.text;
    const data = JSON.parse(jsonString);
    
    if (!Array.isArray(data) || data.length === 0) {
        throw new Error("Generated data is not a valid non-empty array.");
    }

    return data as ChartDataPoint[];

  } catch (error) {
    console.error("Error generating chart data with Gemini:", error);
    // Fallback to mock data on error
    return [
      { name: 'Error', value: 100 },
      { name: 'Loading', value: 200 },
      { name: 'Data', value: 150 },
    ];
  }
};
