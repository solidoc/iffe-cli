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

// ===================================================
// 添加提交规范的配置文件
// 添加scripts脚本
console.log("添加packages.json配置");
file.set("scripts.commit", "git add . && git-cz");
file.set("scripts.push", "git push origin dev");
file.set("scripts.pull", "git pull origin dev --rebase");

// 添加commitizen配置
file.set("config.commitizen.path", "node_modules/cz-customizable");
file.set(
  "config.cz-customizable.config",
  `${pakUrl}/configs/cz-customizable.js`
);

// 添加husky配置
file.set(
  "husky.hooks.commit-msg",
  `commitlint --config ${pakUrl}/configs/commitlint.js --env HUSKY_GIT_PARAMS`
);

// ===================================================
// // 添加代码规范
// // 添加scripts脚本
file.set("scripts.fix", "yarn fix:prettier && yarn fix:eslint");
file.set("scripts.fix:eslint", "yarn lint:eslint --fix");
file.set("scripts.fix:prettier", "yarn lint:prettier --write");
file.set("scripts.lint", "yarn lint:eslint");
file.set(
  "scripts.lint:eslint",
  'eslint "./src/**/*.{js,jsx,ts,tsx}" -c ./configs/eslintrc.js'
);
file.set(
  "scripts.lint:prettier",
  'prettier --list-different "**/*.{css,md,js,jsx,json,ts,tsx}"'
);

// 添加配置
file.set("prettier", "./configs/prettierrc.js");
file.set("release.extends", "./configs/releaserc.json");
file.set("lint-staged.src/**/*", "yarn fix");
file.set("husky.hooks.pre-commit", "lint-staged");

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
  fs.copyFile(copyFilePath, copyToFilePath, (err) => {
    if (err) throw err;
    console.log("创建配置文件:", copyToFilePath);
  });
}
file.save();

// fs.copy(configDir, "./configs")
//   .then(() => console.log("success!"))
//   .catch((err) => console.error(err));

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
