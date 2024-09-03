import { NextApiRequest, NextApiResponse } from 'next';
import { fetchAudienceProfiles } from 'components/apiKey/xano';
import { AudienceProfile } from 'components/apiKey/types'; // Adjust the import path as necessary

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const profiles: AudienceProfile[] = await fetchAudienceProfiles();
      res.status(200).json(profiles);
    } catch (error) {
      console.error('Error in API route:', error);
      res.status(500).json({ message: 'Error fetching audience profiles', error: (error as Error).message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}