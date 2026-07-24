"use strict";

const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");
const childProcess = require("child_process");
const test = require("node:test");
const { RepositoryConfig } = require("../src/core/repository-config");
const { changedSkillFiles, installGitHooks } = require("../src/core/git-hooks");
const { installSkills, MANIFEST } = require("../src/core/skill-installer");
const { ClaudeAdapter } = require("../src/adapters/claude-adapter");
const { CodexAdapter } = require("../src/adapters/codex-adapter");

const repositoryRoot = path.resolve(__dirname, "..");

function workspace(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "ai-config-test-"));
  const home = path.join(root, "home");
  const project = path.join(root, "project");
  fs.mkdirSync(home, { recursive: true });
  fs.mkdirSync(project, { recursive: true });
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  return { home, project };
}

function silentOutput() {
  return { log() {}, warn() {} };
}

function git(repo, ...args) {
  return childProcess.execFileSync(
    "git",
    ["-C", repo, ...args],
    { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
  ).trim();
}

test("统一配置按公司优先合并 MCP 与 Skill", () => {
  const repository = new RepositoryConfig(repositoryRoot);
  const mcp = repository.mcp().mcpServers;
  const skills = repository.skills();
  assert.ok(mcp.mysql);
  assert.ok(mcp.codegraph);
  assert.ok(skills.some((skill) => skill.name === "write-online-sop" && skill.layer === "company"));
  assert.ok(skills.some((skill) => skill.name === "terminal-title" && skill.layer === "personal"));
});

test("Claude 适配保持原入口、用户级 Skills 与项目生成物", (t) => {
  const { home, project } = workspace(t);
  const adapter = new ClaudeAdapter({
    repository: new RepositoryConfig(repositoryRoot),
    homeDir: home,
    output: silentOutput(),
  });

  adapter.installProject(project);
  const claudeFile = path.join(project, "CLAUDE.md");
  const first = fs.readFileSync(claudeFile, "utf8");
  assert.match(first, /ai-repo-imports:start/);
  assert.match(first, /personal\/rules\/steering\/language\.md/);
  assert.ok(fs.existsSync(path.join(project, ".claude", "hooks-rules.md")));
  assert.ok(fs.existsSync(path.join(project, ".mcp.json")));
  assert.ok(fs.existsSync(path.join(project, "sql-guard.json")));

  fs.appendFileSync(claudeFile, "\n## 手写规则\n保留我\n", "utf8");
  adapter.installProject(project);
  const second = fs.readFileSync(claudeFile, "utf8");
  assert.equal((second.match(/ai-repo-imports:start/g) || []).length, 1);
  assert.match(second, /## 手写规则\n保留我/);

  const skills = adapter.installSkills();
  assert.equal(skills.destination, path.join(home, ".claude", "skills"));
  assert.ok(fs.existsSync(path.join(skills.destination, "terminal-title", "SKILL.md")));
});

test("Codex 适配生成 AGENTS.md、项目 MCP 与用户级 Skills", (t) => {
  const { home, project } = workspace(t);
  const adapter = new CodexAdapter({
    repository: new RepositoryConfig(repositoryRoot),
    homeDir: home,
    output: silentOutput(),
  });

  adapter.installProject(project);
  const agentsFile = path.join(project, "AGENTS.md");
  const configFile = path.join(project, ".codex", "config.toml");
  const first = fs.readFileSync(agentsFile, "utf8");
  assert.match(first, /ai-repository:begin/);
  assert.match(first, /全部都用中文提问、回答我/);
  assert.match(first, /MySQL SQL Guard/);
  assert.match(fs.readFileSync(configFile, "utf8"), /\[mcp_servers\.mysql\]/);

  fs.appendFileSync(agentsFile, "\n## 项目手写规则\n保留我\n", "utf8");
  adapter.installProject(project);
  const second = fs.readFileSync(agentsFile, "utf8");
  assert.equal((second.match(/ai-repository:begin/g) || []).length, 1);
  assert.match(second, /## 项目手写规则\n保留我/);

  const skills = adapter.installSkills();
  assert.equal(skills.destination, path.join(home, ".agents", "skills"));
  assert.ok(fs.existsSync(path.join(skills.destination, "write-online-sop", "SKILL.md")));
});

test("Codex 不覆盖项目手写的同名 MCP", (t) => {
  const { home, project } = workspace(t);
  const codexDir = path.join(project, ".codex");
  fs.mkdirSync(codexDir, { recursive: true });
  fs.writeFileSync(
    path.join(codexDir, "config.toml"),
    "[mcp_servers.mysql]\ncommand = \"custom-mysql\"\n",
    "utf8",
  );
  const adapter = new CodexAdapter({
    repository: new RepositoryConfig(repositoryRoot),
    homeDir: home,
    output: silentOutput(),
  });
  const result = adapter.installProject(project);
  const config = fs.readFileSync(path.join(codexDir, "config.toml"), "utf8");
  assert.deepEqual(result.skippedMcp, ["mysql"]);
  assert.equal((config.match(/\[mcp_servers\.mysql\]/g) || []).length, 1);
  assert.match(config, /command = "custom-mysql"/);
  assert.match(config, /\[mcp_servers\.codegraph\]/);
});

test("受管的复制 Skill 可刷新并删除已下架 Skill", (t) => {
  const { home } = workspace(t);
  const source = path.join(home, "source");
  const destination = path.join(home, "skills");
  const sourceSkill = path.join(source, "demo");
  fs.mkdirSync(sourceSkill, { recursive: true });
  fs.mkdirSync(path.join(destination, "demo"), { recursive: true });
  fs.mkdirSync(path.join(destination, "removed"), { recursive: true });
  fs.writeFileSync(path.join(sourceSkill, "SKILL.md"), "new", "utf8");
  fs.writeFileSync(path.join(destination, "demo", "SKILL.md"), "old", "utf8");
  fs.writeFileSync(path.join(destination, "removed", "SKILL.md"), "old", "utf8");
  fs.writeFileSync(path.join(destination, MANIFEST), JSON.stringify({
    version: 1,
    skills: {
      demo: { mode: "copy", source: sourceSkill },
      removed: { mode: "copy", source: path.join(source, "removed") },
    },
  }), "utf8");

  const result = installSkills([{ name: "demo", dir: sourceSkill }], destination);
  assert.equal(fs.readFileSync(path.join(destination, "demo", "SKILL.md"), "utf8"), "new");
  assert.deepEqual(result.removed, ["removed"]);
  assert.equal(fs.existsSync(path.join(destination, "removed")), false);
});

test("Git Hook 只识别 Skill 路径变化并可安全安装", (t) => {
  const { project } = workspace(t);
  git(project, "init");
  git(project, "config", "user.name", "Codex Test");
  git(project, "config", "user.email", "codex@example.invalid");
  fs.mkdirSync(path.join(project, ".githooks"), { recursive: true });
  fs.writeFileSync(path.join(project, "README.md"), "one\n", "utf8");
  git(project, "add", ".");
  git(project, "commit", "-m", "init");
  const first = git(project, "rev-parse", "HEAD");

  fs.writeFileSync(path.join(project, "README.md"), "two\n", "utf8");
  git(project, "add", ".");
  git(project, "commit", "-m", "docs");
  const second = git(project, "rev-parse", "HEAD");
  assert.deepEqual(changedSkillFiles(project, first, second), []);

  const skillDir = path.join(project, "personal", "skills", "demo");
  fs.mkdirSync(skillDir, { recursive: true });
  fs.writeFileSync(path.join(skillDir, "SKILL.md"), "demo\n", "utf8");
  git(project, "add", ".");
  git(project, "commit", "-m", "skill");
  const third = git(project, "rev-parse", "HEAD");
  assert.deepEqual(changedSkillFiles(project, second, third), ["personal/skills/demo/SKILL.md"]);

  const installed = installGitHooks(project);
  assert.equal(installed.hooksPath, ".githooks");
  assert.equal(git(project, "config", "--local", "--get", "core.hooksPath"), ".githooks");
});
