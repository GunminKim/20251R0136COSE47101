import fs from 'fs';
import {
  isLanguage,
  LanguageCount,
  languages,
  TestCSVInterface,
  UsersDataWithRepos,
} from './types';

async function main() {
  console.log('🚀 테스트용 데이터를 생성해요!');

  const userList: UsersDataWithRepos[] = [];
  fs.readdirSync('results')
    .filter(
      file => file.startsWith('userDataWithRepos_v2') && file.endsWith('.json')
    )
    .map(file =>
      userList.push(...JSON.parse(fs.readFileSync(`results/${file}`, 'utf8')))
    );

  const result: TestCSVInterface[] = [];

  for (const user of userList) {
    let userText = '';
    const languageCount: LanguageCount = {
      Assembly: 0,
      C: 0,
      'C++': 0,
      'C#': 0,
      Dart: 0,
      Go: 0,
      Java: 0,
      JavaScript: 0,
      Kotlin: 0,
      MATLAB: 0,
      PHP: 0,
      Python: 0,
      Ruby: 0,
      Rust: 0,
      Scala: 0,
      Swift: 0,
      TypeScript: 0,
    };

    for (const repo of user.repos) {
      if (repo.language && isLanguage(repo.language)) {
        userText += repo.name.replace(/,/g, '&') + ' :: ';
        userText += repo.description
          ? repo.description.replace(/,/g, '&').replace(/\n/g, ' ') + ' / '
          : ' / ';
        languageCount[repo.language] += 1;
      }
    }
    const totalCount = Object.values(languageCount).reduce(
      (acc, curr) => acc + curr,
      0
    );
    if (totalCount === 7) {
      for (const lang of languages) {
        languageCount[lang] = Number(
          (languageCount[lang] / totalCount).toFixed(3)
        );
      }
    } else {
      continue;
    }

    result.push({
      ...languageCount,
      username: user.login,
      userID: user.id,
      repoCount: user.repos.length,
      text: userText,
    });
  }

  let csvContent = `user_ID, username, repo_count, ${languages.join(
    ', '
  )}, text\n`;
  for (const line of result) {
    const row = [
      line.userID,
      line.username,
      line.repoCount,
      ...languages.map(lang => line[lang]),
      line.text,
    ].join(',');
    csvContent += `${row}\n`;
  }
  fs.writeFileSync('results/github_profiles_for_test.csv', csvContent);
}

main();
