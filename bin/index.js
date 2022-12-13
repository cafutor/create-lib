#!/usr/bin/env node
const nodeFetch = require('node-fetch');
const fs = require('fs');
const chalk = require('chalk');
const decompress = require('decompress');
const path = require('path');
const childProcess = require('child_process');
const prompts = require('prompts');
const mainPath = 'create-lib-master';

const sourceUrl =
  'https://codeload.github.com/cafutor/create-lib/zip/refs/heads/master';
const uselessDepts = ['node-fetch', 'chalk', 'decompress'];
const uselessFields = ['bin', 'dependencies'];
const fileType = 'file';
const directoryType = 'directory';
const uselessFiles = [
  {
    path: 'bin',
    type: 'directory',
  },
];
const selectObj = {
  type: 'select',
  name: 'value',
  message: '注意文件已经下载，是否需要重新覆盖',
  choices: [
    {
      title: '否',
      description: '不执行覆盖',
      value: false,
    },
    { title: '是', value: true, description: '执行覆盖' },
  ],
  initial: 0,
};

const fetchSource = () => {
  process.stdout.clearLine();
  process.stdout.write(chalk.yellow('downloading...\n'));
  nodeFetch(sourceUrl)
    .then((res) => {
      const loadedPkg = fs.createWriteStream('create-lib.zip');
      res.body.pipe(loadedPkg);
      loadedPkg.on('finish', () => {
        decompress('create-lib.zip', process.cwd())
          .then((files) => {})
          .finally(() => {
            // 删除下载的文件
            fs.unlinkSync('create-lib.zip');
            // 删除无用的文件
            uselessFiles.forEach((j) => {
              const { type, path: filePath } = j;
              let commandArg;
              if (type === fileType) commandArg = '-f';
              if (type === directoryType) commandArg = '-rf';
              const fileToBeDeleted = path.join(
                process.cwd(),
                mainPath,
                filePath
              );
              childProcess.execSync(`rm ${commandArg} ${fileToBeDeleted}`);
            });

            const configPath = path.join(
              process.cwd(),
              mainPath,
              'package.json'
            );
            const configObj = require(configPath);
            // 删除无用的依赖
            uselessDepts.forEach((dept) => {
              delete configObj.devDependencies[dept];
            });
            // 删除无用的field
            uselessFields.forEach((uselessField) => {
              delete configObj[uselessField];
            });
            fs.unlinkSync(configPath);
            const configFileStream = fs.createWriteStream(configPath);
            configFileStream.end(JSON.stringify(configObj));

            configFileStream.on('finish', () => {
              // 将指定目录下所有dot文件移动到指定文件夹下
              childProcess.execSync(
                `mv ${path.join(process.cwd(), mainPath, '.[!.]*')} ${path.join(
                  process.cwd()
                )}`
              );
              // 非dot文件
              childProcess.execSync(
                `mv ${path.join(process.cwd(), mainPath, '*')} ${path.join(
                  process.cwd()
                )}`
              );
              // 移除temp文件夹
              childProcess.execSync(
                `rm -rf ${path.join(process.cwd(), mainPath)}`
              );
              process.stdout.write(chalk.green('done!\n'));
            });
          });
      });
    })
    .catch((e) => {
      process.stdout.write(
        `${chalk.yellow(
          'ops something errors,you may need to check your network'
        )}\n${chalk.red(e.message || e)}`
      );
    });
};

const excute = () => {
  if (!fs.existsSync(path.join(process.cwd(), 'package.json'))) {
    fetchSource();
  } else {
    prompts(selectObj).then((valObj) => {
      const { value } = valObj;
      if (value) {
        childProcess.execSync('rm -rf *');
        fetchSource();
      }
    });
  }
};

excute();
