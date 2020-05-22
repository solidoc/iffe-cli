#!/usr/bin/env node
"use strict";

const minimist = require("minimist");
const rawArgs = process.argv.slice(2);
const args = minimist(rawArgs);
const path = require("path");
const fs = require("fs-extra");
const editJsonFile = require("edit-json-file");

const pkgUrl = `${process.cwd()}/package.json`;
let file = editJsonFile(pkgUrl);
const pakName = "iffe-commit";

// ===================================================
// 添加提交规范的配置文件
// 添加scripts脚本
file.set("scripts.commit", "git add . && git-cz");
file.set("scripts.push", "git push origin dev");
file.set("scripts.pull", "git pull origin dev --rebase");

// 添加commitizen配置
file.set("config.commitizen.path", "node_modules/cz-customizable");
file.set(
  "config.cz-customizable.config",
  `node_modules/${pakName}/cz-config.js`
);

// 添加husky配置
file.set(
  "husky.hooks.commit-msg",
  `commitlint --config node_modules/${pakName}/commitlint.config.js -E HUSKY_GIT_PARAMS`
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
  'eslint "./src/**/*.{js,jsx,ts,tsx}" -c ./config/.eslintrc.js'
);
file.set(
  "scripts.lint:prettier",
  'prettier --list-different "**/*.{css,md,js,jsx,json,ts,tsx}"'
);

// 添加配置
file.set("prettier", "./config/.prettierrc.js");
file.set("release.extends", "./config/.releaserc.json");
file.set("lint-staged.src/**/*", "yarn fix");
file.set("husky.hooks.pre-commit", "lint-staged");

// 拷贝文件
const configDir = `node_modules/${pakName}/config/`;
fs.copy(configDir, "./config")
  .then(() => console.log("success!"))
  .catch((err) => console.error(err));

file.save();
