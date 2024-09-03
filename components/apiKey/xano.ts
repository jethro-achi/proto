import { AudienceProfile } from 'components/apiKey/types'; // Adjust the import path as necessary

const XANO_BASE_URL = process.env.NEXT_PUBLIC_XANO_BASE_URL;

export const fetchAudienceProfiles = async (): Promise<AudienceProfile[]> => {
  try {
    const response = await fetch(`${XANO_BASE_URL}`);
    if (!response.ok) {
      const text = await response.text();
      console.error('Error response from Xano API:', text);
      throw new Error(`Failed to fetch audience profiles: ${response.status} ${response.statusText}`);
    }
    const data: AudienceProfile[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching audience profiles:', error);
    throw error;
  }
};
