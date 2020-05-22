"use strict";

module.exports = {
  types: [
    { value: "feat", name: "feat:     新增了功能" },
    { value: "fix", name: "fix:      修复了BUG" },
    { value: "docs", name: "docs:     修改了文档" },
    {
      value: "style",
      name: "style:    不会影响代码含义更改（如空格，格式，分号等等）",
    },
    {
      value: "refactor",
      name: "refactor: 代码进行了重构，但不影响功能",
    },
    {
      value: "perf",
      name: "perf:     性能改善",
    },
    { value: "test", name: "test:     添加测试代码" },
    {
      value: "build",
      name:
        "build:    变更项目构建或外部依赖（例如scopes: webpack、gulp、npm等）",
    },
    {
      value: "ci",
      name: "ci:       更改持续集成相关的的配置文件和package中的scripts命令等",
    },
    {
      value: "chore",
      name: "chore:    变更构建流程或辅助工具",
    },
    { value: "revert", name: "revert:   代码回退" },
  ],

  scopes: [
    // { name: "accounts" },
    // { name: "admin" },
    // { name: "exampleScope" },
    // { name: "changeMe" },
  ],

  allowTicketNumber: false,
  isTicketNumberRequired: false,
  ticketNumberPrefix: "TICKET-",
  ticketNumberRegExp: "\\d{1,5}",

  // it needs to match the value for field type. Eg.: 'fix'
  /*
    scopeOverrides: {
      fix: [
        {name: 'merge'},
        {name: 'style'},
        {name: 'e2eTest'},
        {name: 'unitTest'}
      ]
    },
    */
  // override the messages, defaults are as follows
  messages: {
    type: "提交类型:",
    scope: "本次提交影响的范围(回车跳过):",
    customScope: "本次提交影响的范围(回车跳过):",
    subject: "简短的变更描述:",
    body: "编写更加详细的描述 (回车跳过):",
    breaking: "列出与上一个版本不兼容的变更 (回车跳过):",
    footer: "列出本次变更后需要关闭的问题（ISSUES）例如: #31, #34.(回车跳过):",
    confirmCommit: "确定提交吗?",
  },

  allowCustomScopes: true,
  allowBreakingChanges: ["feat", "fix"],
  // skip any questions you want
  //   skipQuestions: ["body"],

  // limit subject length
  subjectLimit: 100,
  // breaklineChar: '|', // It is supported for fields body and footer.
  // footerPrefix : 'ISSUES CLOSED:'
  // askForBreakingChangeFirst : true, // default is false
};
