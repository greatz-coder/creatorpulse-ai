import { promises as fs } from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'social-links.json');

type SocialLink = {
  provider: string;
  token: string;
  connectedAt: string;
};

export async function getSocialLinks() {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [] as SocialLink[];
  }
}

export async function saveSocialLink(provider: string, token: string) {
  const links = await getSocialLinks();
  const updated = [
    ...links.filter((item) => item.provider.toLowerCase() !== provider.toLowerCase()),
    {
      provider,
      token,
      connectedAt: new Date().toISOString(),
    },
  ];

  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(updated, null, 2));
  return updated;
}
