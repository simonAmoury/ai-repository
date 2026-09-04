"use strict";

const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");
const childProcess = require("child_process");
const test = require("node:test");
const { RepositoryConfig } = require("../src/core/repository-config");
const { addLocalIgnores } = require("../src/core/git-exclude");
const { changedSkillFiles, installGitHooks } = require("../src/core/git-hooks");
const { generateHookMarkdown } = require("../src/core/hook-markdown");
const { updateManagedBlock } = require("../src/core/managed-block");
const { installSkills, MANIFEST } = require("../src/core/skill-installer");
const { ensureScaffold, status: memoryStatus, memoryRoot } = require("../src/core/memory-store");
const { ClaudeAdapter } = require("../src/adapters/claude-adapter");
const { CodexAdapter } = require("../src/adapters/codex-adapter");
const { KiroAdapter } = require("../src/adapters/kiro-adapter");

const repositoryRoot = path.resolve(__dirname, "..");

function workspace(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "ai-config-test-"));
  const home = path.join(root, "home");
  const project = path.join(root, "project");
  fs.mkdirSync(home, { recursive: true });
  fs.mkdirSync(project, { recursive: true });
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  return { root, home, project };
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
    localStateDir: path.join(home, "state"),
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
  assert.equal((second.match(/<!-- ai-repository:begin \(自动生成，请勿手动编辑此区块\) -->/g) || []).length, 1);
  assert.match(second, /## 项目手写规则\n保留我/);

  const skills = adapter.installSkills();
  assert.equal(skills.destination, path.join(home, ".agents", "skills"));
  assert.ok(fs.existsSync(path.join(skills.destination, "write-online-sop", "SKILL.md")));
});

test("Kiro 适配生成项目 steering、项目 MCP 与用户级 Skills", (t) => {
  const { home, project } = workspace(t);
  const adapter = new KiroAdapter({
    repository: new RepositoryConfig(repositoryRoot),
    homeDir: home,
    output: silentOutput(),
  });

  adapter.installProject(project);
  const steeringFile = path.join(project, ".kiro", "steering", "ai-repository.md");
  const first = fs.readFileSync(steeringFile, "utf8");
  assert.match(first, /ai-repository:begin/);
  assert.match(first, /全部都用中文提问、回答我/);
  assert.match(first, /MySQL SQL Guard/);
  assert.ok(fs.existsSync(path.join(project, ".kiro", "settings", "mcp.json")));
  assert.ok(fs.existsSync(path.join(project, "sql-guard.json")));

  fs.appendFileSync(steeringFile, "\n## 项目手写规则\n保留我\n", "utf8");
  adapter.installProject(project);
  const second = fs.readFileSync(steeringFile, "utf8");
  assert.equal((second.match(/<!-- ai-repository:begin \(自动生成，请勿手动编辑此区块\) -->/g) || []).length, 1);
  assert.match(second, /## 项目手写规则\n保留我/);

  const skills = adapter.installSkills();
  assert.equal(skills.destination, path.join(home, ".kiro", "skills"));
  assert.ok(fs.existsSync(path.join(skills.destination, "write-online-sop", "SKILL.md")));
});

test("Kiro 不覆盖项目已有的 MCP 配置", (t) => {
  const { home, project } = workspace(t);
  const mcpFile = path.join(project, ".kiro", "settings", "mcp.json");
  fs.mkdirSync(path.dirname(mcpFile), { recursive: true });
  fs.writeFileSync(mcpFile, JSON.stringify({ mcpServers: { mysql: { command: "custom-mysql" } } }), "utf8");
  const adapter = new KiroAdapter({
    repository: new RepositoryConfig(repositoryRoot),
    homeDir: home,
    output: silentOutput(),
  });

  adapter.installProject(project);
  assert.equal(JSON.parse(fs.readFileSync(mcpFile, "utf8")).mcpServers.mysql.command, "custom-mysql");
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

function createMcpRepository(root, host) {
  const companyMcp = path.join(root, "company", "mcp");
  fs.mkdirSync(companyMcp, { recursive: true });
  fs.writeFileSync(path.join(companyMcp, "settings.json"), JSON.stringify({
    mcpServers: {
      demo: {
        type: "stdio",
        command: "demo-mcp",
        env: { DEMO_HOST: host },
      },
    },
  }, null, 2), "utf8");
}

test("Claude MCP 单项目同步会登记摘要并阻止覆盖手工修改", (t) => {
  const { root, home, project } = workspace(t);
  const source = path.join(root, "repository");
  const state = path.join(root, "state");
  createMcpRepository(source, "host-one");

  let adapter = new ClaudeAdapter({
    repository: new RepositoryConfig(source),
    homeDir: home,
    localStateDir: state,
    output: silentOutput(),
  });
  adapter.installProject(project);
  const mcpFile = path.join(project, ".mcp.json");
  assert.equal(JSON.parse(fs.readFileSync(mcpFile, "utf8")).mcpServers.demo.env.DEMO_HOST, "host-one");

  createMcpRepository(source, "host-two");
  adapter = new ClaudeAdapter({
    repository: new RepositoryConfig(source),
    homeDir: home,
    localStateDir: state,
    output: silentOutput(),
  });
  adapter.syncMcpProject(project);
  assert.equal(JSON.parse(fs.readFileSync(mcpFile, "utf8")).mcpServers.demo.env.DEMO_HOST, "host-two");

  fs.writeFileSync(mcpFile, JSON.stringify({ manuallyChanged: true }), "utf8");
  createMcpRepository(source, "host-three");
  adapter = new ClaudeAdapter({
    repository: new RepositoryConfig(source),
    homeDir: home,
    localStateDir: state,
    output: silentOutput(),
  });
  assert.throws(() => adapter.syncMcpProject(project), /已被手工修改/);
  assert.deepEqual(JSON.parse(fs.readFileSync(mcpFile, "utf8")), { manuallyChanged: true });

  adapter.syncMcpProject(project, { force: true });
  assert.equal(JSON.parse(fs.readFileSync(mcpFile, "utf8")).mcpServers.demo.env.DEMO_HOST, "host-three");
});

test("记忆库骨架幂等创建且项目级记忆被忽略", (t) => {
  const { root } = workspace(t);
  const repo = path.join(root, "repository");
  fs.mkdirSync(repo, { recursive: true });

  const first = ensureScaffold(repo);
  assert.equal(first.root, memoryRoot(repo));
  assert.ok(first.created.includes(".gitignore"));
  assert.ok(fs.existsSync(path.join(first.root, "global", "lessons.md")));
  assert.ok(fs.existsSync(path.join(first.root, "projects", ".gitkeep")));

  const gitignore = fs.readFileSync(path.join(first.root, ".gitignore"), "utf8");
  assert.match(gitignore, /\/projects\/\*/);
  assert.match(gitignore, /!\/projects\/\.gitkeep/);

  fs.writeFileSync(path.join(first.root, "global", "lessons.md"), "custom", "utf8");
  const second = ensureScaffold(repo);
  assert.deepEqual(second.created, []);
  assert.equal(fs.readFileSync(path.join(first.root, "global", "lessons.md"), "utf8"), "custom");
});

test("记忆库 status 统计教训条目与项目记忆", (t) => {
  const { root } = workspace(t);
  const repo = path.join(root, "repository");
  fs.mkdirSync(repo, { recursive: true });
  ensureScaffold(repo);
  const store = memoryRoot(repo);

  fs.writeFileSync(
    path.join(store, "global", "lessons.md"),
    "# 全局教训\n\n### L-001 甲\n\n### L-002 乙\n",
    "utf8",
  );
  const projectDir = path.join(store, "projects", "demo-project");
  fs.mkdirSync(projectDir, { recursive: true });
  fs.writeFileSync(path.join(projectDir, "feature-a.md"), "---\n---\n", "utf8");

  const result = memoryStatus(repo);
  assert.equal(result.exists, true);
  assert.equal(result.lessons, 2);
  assert.deepEqual(result.projects, [{ project: "demo-project", memories: ["feature-a.md"] }]);
});

test("Claude MCP --all 同步所有已登记项目", (t) => {
  const { root, home } = workspace(t);
  const source = path.join(root, "repository");
  const state = path.join(root, "state");
  const projectOne = path.join(root, "project-one");
  const projectTwo = path.join(root, "project-two");
  fs.mkdirSync(projectOne);
  fs.mkdirSync(projectTwo);
  createMcpRepository(source, "before");

  let adapter = new ClaudeAdapter({
    repository: new RepositoryConfig(source),
    homeDir: home,
    localStateDir: state,
    output: silentOutput(),
  });
  adapter.installProject(projectOne);
  adapter.installProject(projectTwo);

  createMcpRepository(source, "after");
  adapter = new ClaudeAdapter({
    repository: new RepositoryConfig(source),
    homeDir: home,
    localStateDir: state,
    output: silentOutput(),
  });
  const result = adapter.syncAllMcp();
  assert.equal(result.synced.length, 2);
  assert.equal(result.failed.length, 0);
  for (const project of [projectOne, projectTwo]) {
    const value = JSON.parse(fs.readFileSync(path.join(project, ".mcp.json"), "utf8"));
    assert.equal(value.mcpServers.demo.env.DEMO_HOST, "after");
  }
});

test("RepositoryConfig 保持配置选择、层级覆盖与稳定排序", (t) => {
  const { root } = workspace(t);
  const repositoryDir = path.join(root, "repository");
  for (const layer of ["personal", "company"]) {
    fs.mkdirSync(path.join(repositoryDir, layer, "rules", "steering"), { recursive: true });
    fs.mkdirSync(path.join(repositoryDir, layer, "rules", "hooks"), { recursive: true });
    fs.mkdirSync(path.join(repositoryDir, layer, "mcp"), { recursive: true });
    fs.mkdirSync(path.join(repositoryDir, layer, "skills"), { recursive: true });
  }

  fs.writeFileSync(path.join(repositoryDir, "personal", "rules", "steering", "z.md"), "personal-z", "utf8");
  fs.writeFileSync(path.join(repositoryDir, "personal", "rules", "steering", "a.md"), "personal-a", "utf8");
  fs.writeFileSync(path.join(repositoryDir, "company", "rules", "steering", "b.md"), "company-b", "utf8");
  fs.writeFileSync(path.join(repositoryDir, "personal", "mcp", "settings.template.json"), JSON.stringify({
    mcpServers: { shared: { command: "personal-template" }, personal: { command: "personal" } },
  }), "utf8");
  fs.writeFileSync(path.join(repositoryDir, "personal", "mcp", "settings.json"), JSON.stringify({
    mcpServers: { shared: { command: "personal-real" }, personal: { command: "personal" } },
  }), "utf8");
  fs.writeFileSync(path.join(repositoryDir, "company", "mcp", "settings.template.json"), JSON.stringify({
    mcpServers: { shared: { command: "company" }, company: { command: "company" } },
  }), "utf8");
  fs.mkdirSync(path.join(repositoryDir, "personal", "skills", "shared"));
  fs.mkdirSync(path.join(repositoryDir, "personal", "skills", "personal-only"));
  fs.mkdirSync(path.join(repositoryDir, "company", "skills", "shared"));
  fs.mkdirSync(path.join(repositoryDir, "company", "skills", "company-only"));
  const personalGuard = path.join(repositoryDir, "personal", "rules", "hooks", "sql-guard.template.json");
  const companyGuard = path.join(repositoryDir, "company", "rules", "hooks", "sql-guard.template.json");
  fs.writeFileSync(personalGuard, "{}", "utf8");
  fs.writeFileSync(companyGuard, "{}", "utf8");

  const repository = new RepositoryConfig(repositoryDir);
  assert.deepEqual(repository.steering().map((entry) => `${entry.layer}:${entry.name}`), [
    "personal:a.md",
    "personal:z.md",
    "company:b.md",
  ]);
  assert.deepEqual(repository.mcp(), {
    mcpServers: {
      shared: { command: "company" },
      personal: { command: "personal" },
      company: { command: "company" },
    },
  });
  assert.deepEqual(repository.skills().map((skill) => `${skill.name}:${skill.layer}`), [
    "company-only:company",
    "personal-only:personal",
    "shared:company",
  ]);
  assert.equal(repository.layers.personal.mcpFile, path.join(repositoryDir, "personal", "mcp", "settings.json"));
  assert.equal(repository.sqlGuardTemplate(), companyGuard);
});

test("托管区更新保持精确位置、手写内容与异常行为", () => {
  const start = "<!-- start -->";
  const end = "<!-- end -->";
  assert.equal(updateManagedBlock("", start, end, " body "), "<!-- start -->\nbody\n<!-- end -->\n");
  assert.equal(
    updateManagedBlock("手写\n", start, end, "body", "prepend"),
    "<!-- start -->\nbody\n<!-- end -->\n\n手写\n",
  );
  assert.equal(
    updateManagedBlock("前\n<!-- start -->\n旧\n<!-- end -->\n后\n", start, end, "新"),
    "前\n<!-- start -->\n新\n<!-- end -->\n后\n",
  );
  assert.throws(() => updateManagedBlock(`内容\n${start}\n`, start, end, "body"), /托管区标记不完整/);
});

test("Claude 用户级设置只覆盖托管键并保留本机密钥", (t) => {
  const { home } = workspace(t);
  const settingsFile = path.join(home, ".claude", "settings.json");
  fs.mkdirSync(path.dirname(settingsFile), { recursive: true });
  fs.writeFileSync(settingsFile, JSON.stringify({
    env: { ANTHROPIC_AUTH_TOKEN: "sk-secret", ANTHROPIC_BASE_URL: "https://proxy.example.com" },
    model: "opus[1m]",
    hooks: { SessionStart: [{ matcher: "startup" }] },
  }, null, 2), "utf8");

  const adapter = new ClaudeAdapter({
    repository: new RepositoryConfig(repositoryRoot),
    homeDir: home,
    localStateDir: path.join(home, "state"),
    output: silentOutput(),
  });
  const result = adapter.syncUserSettings();

  const value = JSON.parse(fs.readFileSync(settingsFile, "utf8"));
  assert.equal(value.env.ENABLE_TOOL_SEARCH, "true");
  assert.equal(value.env.ANTHROPIC_AUTH_TOKEN, "sk-secret");
  assert.equal(value.env.ANTHROPIC_BASE_URL, "https://proxy.example.com");
  assert.equal(value.model, "opus[1m]");
  assert.equal(value.hooks.SessionStart[0].matcher, "startup");
  assert.equal(result.changed, true);

  assert.equal(adapter.syncUserSettings().changed, false);
});

test("Claude 用户级设置在无文件时新建、在文件损坏时中止", (t) => {
  const { home } = workspace(t);
  const adapter = new ClaudeAdapter({
    repository: new RepositoryConfig(repositoryRoot),
    homeDir: home,
    localStateDir: path.join(home, "state"),
    output: silentOutput(),
  });

  adapter.syncUserSettings();
  const settingsFile = path.join(home, ".claude", "settings.json");
  assert.equal(JSON.parse(fs.readFileSync(settingsFile, "utf8")).env.ENABLE_TOOL_SEARCH, "true");

  fs.writeFileSync(settingsFile, "{ broken json", "utf8");
  assert.throws(() => adapter.syncUserSettings(), /无法解析/);
  assert.equal(fs.readFileSync(settingsFile, "utf8"), "{ broken json");
});

test("Hook Markdown 保持过滤、分组和格式化规则", () => {
  const entries = [
    { value: { name: "禁用", enabled: false } },
    { value: { name: "后置", enabled: true, when: { type: "postToolUse", toolTypes: ["SQL"] }, then: { prompt: "步骤 1 执行\n1a. 子项" } } },
    { value: { name: "前置", enabled: true, when: { type: "preToolUse", toolTypes: ["Bash"] }, then: { prompt: "Step 1 Check\n普通规则\n{\"ok\":true}" } } },
  ];
  const markdown = generateHookMarkdown(entries, "generator.js");
  assert.equal(markdown, [
    "# Hook 规则（自动生成）",
    "",
    "> 由 `generator.js` 从 `.rule.json` 自动转换，请勿手动编辑。",
    "",
    "## 工具使用前规则",
    "",
    "### 前置",
    "",
    "**触发时机:** 使用 `Bash` 类型工具之前",
    "",
    "**必须遵守以下规则:**",
    "",
    "**Step 1 Check**",
    "- 普通规则",
    "  ```",
    "  {\"ok\":true}",
    "  ```",
    "",
    "## 工具使用后规则",
    "",
    "### 后置",
    "",
    "**触发时机:** 使用 `SQL` 类型工具之后",
    "",
    "**必须执行以下操作:**",
    "",
    "**步骤 1 执行**",
    "  - 1a. 子项",
  ].join("\n"));
  assert.equal(generateHookMarkdown([{ value: { enabled: false } }]), null);
});

test("Git 本地排除规则幂等追加且不修改项目 gitignore", (t) => {
  const { project } = workspace(t);
  assert.equal(addLocalIgnores(project, [".mcp.json"]), false);
  git(project, "init");
  const gitignore = path.join(project, ".gitignore");
  fs.writeFileSync(gitignore, "node_modules/\n", "utf8");

  assert.equal(addLocalIgnores(project, [".mcp.json", "sql-guard.json"]), true);
  assert.equal(addLocalIgnores(project, [".mcp.json", "sql-guard.json"]), true);
  const excludeFile = git(project, "rev-parse", "--path-format=absolute", "--git-path", "info/exclude");
  const exclude = fs.readFileSync(excludeFile, "utf8");
  assert.equal((exclude.match(/# ai-repository 本地生成文件/g) || []).length, 1);
  assert.equal((exclude.match(/^\.mcp\.json$/gm) || []).length, 1);
  assert.equal((exclude.match(/^sql-guard\.json$/gm) || []).length, 1);
  assert.equal(fs.readFileSync(gitignore, "utf8"), "node_modules/\n");
});

test("CLI 保持帮助与错误出口契约", () => {
  const script = path.join(repositoryRoot, "scripts", "ai-config.js");
  const help = childProcess.spawnSync(process.execPath, [script, "--help"], { encoding: "utf8" });
  assert.equal(help.status, 0);
  assert.match(help.stdout, /AI 配置手动接入脚本/);
  assert.equal(help.stderr, "");

  const unsupported = childProcess.spawnSync(process.execPath, [script, "unknown", "install"], { encoding: "utf8" });
  assert.equal(unsupported.status, 1);
  assert.equal(unsupported.stdout, "");
  assert.match(unsupported.stderr, /^\[ERROR\] 不支持的 Agent: unknown/);
});
