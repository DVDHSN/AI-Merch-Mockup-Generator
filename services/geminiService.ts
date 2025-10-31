import { GoogleGenAI, Modality } from "@google/genai";
import type { AspectRatio } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

/**
 * Edits an image using a text prompt with Gemini.
 * @param base64Image The base64 encoded string of the original image.
 * @param mimeType The MIME type of the original image.
 * @param prompt The text prompt describing the edit.
 * @returns The base64 encoded string of the generated image, or null if no image was generated.
 */
export const editImage = async (base64Image: string, mimeType: string, prompt: string): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
          responseModalities: [Modality.IMAGE],
      },
    });

    // Extract the image data from the response
    for (const part of response.candidates?.[0]?.content?.parts ?? []) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }
    
    return null;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate image with Gemini API.");
  }
};


/**
 * Generates image(s) from a text prompt using Imagen.
 * @param prompt The text prompt describing the image.
 * @param aspectRatio The desired aspect ratio of the image.
 * @param numberOfImages The number of images to generate.
 * @returns An array of base64 encoded strings of the generated images.
 */
export const generateImage = async (prompt: string, aspectRatio: AspectRatio, numberOfImages: number = 1): Promise<string[]> => {
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: numberOfImages,
        outputMimeType: 'image/png',
        aspectRatio: aspectRatio,
      },
    });

    return response.generatedImages
      .map(img => img.image.imageBytes)
      .filter((bytes): bytes is string => !!bytes);

  } catch (error) {
    console.error("Error calling Imagen API:", error);
    throw new Error("Failed to generate image with Imagen API.");
  }
};

/**
 * Generates logo variations from a text prompt using Imagen.
 * @param prompt The text prompt describing the logo.
 * @returns An array of base64 encoded strings of the generated logos.
 */
export const generateLogo = async (prompt: string): Promise<string[]> => {
    const fullPrompt = `A modern, minimalist vector logo of ${prompt}. Centered, on a transparent background, high resolution, suitable for merchandise.`;
    return generateImage(fullPrompt, '1:1', 4);
};