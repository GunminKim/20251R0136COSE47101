import fs from 'fs';
import 'dotenv/config';

import { getGitHubUserList } from './utils/getGitHubUserList';

const ID_PRESET = parseInt(process.env.ID_PRESET || '58812280');

async function main() {
  console.log('🚀 유저 리스트를 가져와요!');

  const dataSize = parseInt(process.env.DATA_SIZE || '100');

  const profileData = await getGitHubUserList(ID_PRESET, dataSize);

  console.log(`${profileData.length}개의 유저 데이터를 가져왔어요!`);

  // results/users.json 파일로 저장
  fs.writeFileSync('results/users.json', JSON.stringify(profileData, null, 2));
}

main().catch(console.error);
