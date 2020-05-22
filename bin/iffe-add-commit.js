#!/usr/bin/env node
"use strict";

const minimist = require("minimist");
const rawArgs = process.argv.slice(2);
const args = minimist(rawArgs);
const path = require("path");
const editJsonFile = require("edit-json-file");
const fs = require("fs");
var shell = require("shelljs");
const pkgUrl = `${process.cwd()}/package.json`;
let file = editJsonFile(pkgUrl);

const pakName = "@solidoc/iffe-cli";
const pakUrl = `node_modules/${pakName}`;

const setJson = (file, key, value) => {
  if (!file.get(key)) {
    file.set(key, value);
  }
};
// ===================================================
// 添加提交规范的配置文件
// 添加scripts脚本
console.log("添加packages.json配置");
setJson(file, "scripts.commit", "git add . && git-cz");
setJson(file, "scripts.push", "git push origin dev");
setJson(file, "scripts.pull", "git pull origin dev --rebase");

// 添加commitizen配置
setJson(file, "config.commitizen.path", "node_modules/cz-customizable");
setJson(
  file,
  "config.cz-customizable.config",
  `${pakUrl}/configs/cz-customizable.js`
);

// 添加husky配置
setJson(
  file,
  "husky.hooks.commit-msg",
  `commitlint --config ${pakUrl}/configs/commitlint.js --env HUSKY_GIT_PARAMS`
);

// ===================================================
// // 添加代码规范
// // 添加scripts脚本
setJson(file, "scripts.fix", "yarn fix:prettier && yarn fix:eslint");
setJson(file, "scripts.fix:eslint", "yarn lint:eslint --fix");
setJson(file, "scripts.fix:prettier", "yarn lint:prettier --write");
setJson(file, "scripts.lint", "yarn lint:eslint");
setJson(
  file,
  "scripts.lint:eslint",
  'eslint "./src/**/*.{js,jsx,ts,tsx}" -c ./configs/eslintrc.js'
);
setJson(
  file,
  "scripts.lint:prettier",
  'prettier --list-different "**/*.{css,md,js,jsx,json,ts,tsx}"'
);

// 添加配置
setJson(file, "prettier", "./configs/prettierrc.js");
setJson(file, "release.extends", "./configs/releaserc.json");
setJson(file, "lint-staged.src/**/*", "yarn fix");
setJson(file, "husky.hooks.pre-commit", "lint-staged");

// 拷贝文件
const copyFileList = ["eslintrc.js", "releaserc.json", "prettierrc.js"];
const copyDir = `${pakUrl}/configs`;
const copyToDir = `./configs`;
fs.mkdirSync(copyToDir, { recursive: true }, (err) => {
  if (err) throw err;
});
for (let i = 0; i < copyFileList.length; i++) {
  const fileName = copyFileList[i];
  const copyFilePath = `${copyDir}/${fileName}`;
  const copyToFilePath = `${copyToDir}/${fileName}`;
  const isExists = fs.existsSync(copyToFilePath);
  console.info("是否存在：", copyToFilePath, isExists);
  if (!isExists) {
    fs.copyFile(copyFilePath, copyToFilePath, (err) => {
      if (err) throw err;
      console.log("创建配置文件:", copyToFilePath);
    });
  }
}
file.save();

console.log("开始安装依赖");
const devDependencies = [
  "@typescript-eslint/parser",
  "@typescript-eslint/eslint-plugin",
  "@commitlint/config-conventional",
  "@commitlint/cli",
  "eslint",
  "eslint-config-prettier",
  "eslint-plugin-import",
  "eslint-plugin-jsx-a11y",
  "eslint-plugin-prettier",
  "eslint-plugin-react",
  "eslint-plugin-react-hooks",
  "husky",
  "lint-staged",
  "prettier",
  "typescript",
  "cz-customizable",
  "cz-conventional-changelog",
  "commitizen",
];
const pkgs = devDependencies.join(" ");
shell.exec(`yarn add ${pkgs} -D -W`, { async: true });
