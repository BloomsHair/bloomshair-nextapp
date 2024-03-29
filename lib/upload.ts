import { NEXT_URL } from "../config";

export async function uploadImage(
  base64EncodedImage: string | ArrayBuffer | null
) {
  try {
    const response = await fetch(`${NEXT_URL}/api/upload`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: base64EncodedImage }),
    });
    const data = await response.json();
    const imageUrl = data.secure_url;
    return imageUrl;
  } catch (error) {
    console.error(error);
    return error;
  }
}
