// 导入所需的模块
import miniprogramCi from 'miniprogram-ci';
import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';
import fs from 'fs/promises';
import shell from 'shelljs';
import fse from 'fs-extra';
import AdmZip from 'adm-zip';
import { console } from 'inspector';

const robotMap = {
  dev: 1,
  uat: 2,
  pre: 3,
  pro: 4,
};
function removeCommentsFromJSON(jsonString) {
  // 去除单行注释
  jsonString = jsonString.replace(/\/\/.*$/gm, '');
  // 去除多行注释
  jsonString = jsonString.replace(/\/\*[\s\S]*?\*\//g, '');
  // 去除多余的空白字符，如换行符、多余的空格等
  jsonString = jsonString.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
  return jsonString;
}

// 读取 manifest.json 文件
const manifest = JSON.parse(
  removeCommentsFromJSON(
    await fs.readFile(new URL('./src/manifest.json', import.meta.url), 'utf8')
  )
);
console.log(manifest);
const { appid, setting } = manifest['mp-weixin'];

// 定义常量
const MINBORDER = 0;
const MAXBORDER = 10;

// 定义问题列表
const promptList = [
  {
    type: 'list',
    name: 'uploadEnv',
    message: '请选择要发布的环境？',
    choices: [
      {
        name: 'dev',
        value: 'dev',
        checked: true, // 默认选中
      },
      'uat',
      'pre',
      'pro',
    ],
    when: (data) => data.uploadEnv !== '',
  },
  {
    type: 'list',
    name: 'versionAdd',
    message: '是否需要升级版本号？',
    choices: [
      {
        name: 'No',
        value: 0,
        checked: true, // 默认选中
      },
      {
        name: 'Yes',
        value: 1,
      },
    ],
    when: (data) => data.versionAdd !== '',
  },
];

/**
 * 写入更新版本号
 * @param {string} n_v 新的版本号
 */
const changeFsWithJson = async (n_v) => {
  manifest.versionName = n_v;
  manifest.versionCode = n_v.replaceAll('.', '');
  const result = JSON.stringify(manifest, null, 2);
  await fs.writeFile(
    new URL('./src/manifest.json', import.meta.url),
    result,
    'utf8'
  );
};

/**
 * 计算版本号
 * @param {string} str 当前版本号
 * @returns {Promise<string>} 新的版本号
 */
const updataVersion = (str) => {
  return new Promise((resolve, reject) => {
    const vls = str.split('.');
    try {
      if (vls.length === 3) {
        let tempV1 = Number(vls[0]);
        let tempV2 = Number(vls[1]);
        let tempV3 = Number(vls[2]) + 1;
        if (tempV3 >= MAXBORDER) {
          tempV3 = MINBORDER;
          tempV2 = tempV2 + 1;
          if (tempV2 >= MAXBORDER) {
            tempV2 = MINBORDER;
            tempV1 = tempV1 + 1;
          }
        }
        // 更新本地
        resolve(`${tempV1}.${tempV2}.${tempV3}`);
      }
    } catch (error) {
      console.log(`updataVersion: ${chalk.red(error.message)}`);
      reject(`updataVersion: ${error.message}`);
    }
  });
};

/**
 * 设置选择环境选项
 */
const setSelectEnvOptions = async () => {
  try {
    const result = await inquirer.prompt(promptList);

    if (result.versionAdd) {
      console.log(chalk.green.bold('更新版本号ing...'));
      const versionStr = await updataVersion(manifest.versionName);
      await changeFsWithJson(versionStr);
      console.log(
        chalk.white.bold('版本号：'),
        chalk.blue.bold(`${versionStr}`)
      );
    }
    await buildWxCode(result);
    await uploadFile({ ...result, robot: robotMap[result.uploadEnv] });
  } catch (error) {
    console.log(`setSelectEnvOptions: ${chalk.red(error.message)}`);
  }
};

/**
 * 上传文件
 * @param {Object} options 选项对象，包含 uploadEnv
 */
const uploadFile = async ({ uploadEnv = '', robot = 1 }) => {
  const project = new miniprogramCi.Project({
    appid, // appid
    type: 'miniProgram', // 可以不填
    projectPath: process.cwd() + '/dist/build/mp-weixin/',
    privateKeyPath: process.cwd() + `/private.${appid}.key`,
    ignores: ['node_modules/**/*'],
  });
  const spinner = ora('正在上传小程序代码...').start();
  try {
    await miniprogramCi.upload({
      project,
      robot, // 机器人
      version: manifest.versionName,
      desc: `${uploadEnv}----${manifest.description}`,
      setting,
      onProgressUpdate: (progress) => {
        console.log(chalk.bgYellow.white.bold(progress));
      },
    });
    console.log(
      chalk.white.bold('环境：'),
      chalk.blue.bold(`${uploadEnv.toLocaleUpperCase()}`)
    );
    console.log(
      chalk.white.bold('版本：'),
      chalk.blue.bold(`${manifest.versionName}`)
    );
    spinner.succeed(chalk.bgGreen.white.bold(`小程序代码上传完成!`));
    shell.exit(0);
    // await pullSourceMap(project);
  } catch (error) {
    spinner.fail('上传失败: ' + error.message);
    console.log(chalk.bold.red(error.message));
    shell.exit(1);
  }
};

/**
 * 构建微信代码
 * @param {Object} options 选项对象，包含 uploadEnv
 * @returns {Promise<boolean>} 构建是否成功
 */
const buildWxCode = async ({ uploadEnv = 'dev' }) => {
  // 检查控制台是否以运行`npm `开头的命令
  if (!shell.which('npm')) {
    // 在控制台输出内容
    shell.echo('Sorry, you need install nodeJS');
    shell.exit(1);
  }
  console.log(chalk.bgGreen.whiteBright.bold(''));
  console.log(
    chalk.white.bold('当前node 版本：'),
    chalk.blue.bold(`${shell.exec('node -v')}`)
  );
  const spinner = ora('build start...').start();
  return new Promise((resolve, reject) => {
    if (shell.exec(`npm run build:wx:${uploadEnv}`).code !== 0) {
      console.log(chalk.bgRed.white.bold(`Error: build failed: ${uploadEnv}`));
      spinner.stop();
      reject(new Error(`Error: build failed: ${uploadEnv}`));
      shell.exit(1);
    }
    spinner.stop();
    console.log(chalk.bgGreen.white.bold(`build ${uploadEnv} success !`));
    resolve(true);
  });
};

/**
 * 拉取源代码映射
 * @param {miniprogramCi.Project} project 小程序项目对象
 */
const pullSourceMap = async (project) => {
  try {
    await miniprogramCi.getDevSourceMap({
      project,
      robot: 2,
      sourceMapSavePath: process.cwd() + `/dist/build/sourceMap.zip`,
    });
    const zipPath = process.cwd() + `/dist/build/sourceMap.zip`;
    const uzipPath = process.cwd() + `/dist/build/`;
    const zip = new AdmZip(zipPath);
    await new Promise((resolve, reject) => {
      zip.extractAllToAsync(uzipPath, true, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
    fse.moveSync(uzipPath + '__FULL__/', uzipPath + 'full', {
      overwrite: true,
    });
    console.log(chalk.bgGreen.whiteBright.bold('下载成功'));
  } catch (error) {
    console.error(JSON.stringify(error));
  }
};

// 执行设置选择环境选项
//

console.log(process.argv[2], 'env');

const env = process.argv[2];
if (env) {
  await buildWxCode({ uploadEnv: env });
  await uploadFile({ uploadEnv: env, robot: robotMap[env] });
} else {
  setSelectEnvOptions();
}
