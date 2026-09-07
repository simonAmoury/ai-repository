"use strict";

const path = require("path");
const { copyIfMissing } = require("./files");
const { addLocalIgnores } = require("./git-exclude");

function installProjectSupportFiles(repository, project, generatedFiles) {
  const guardFile = path.join(project, "sql-guard.json");
  copyIfMissing(repository.sqlGuardTemplate(), guardFile);
  const generatedPatterns = generatedFiles.map((file) => path.relative(project, file).split(path.sep).join("/"));
  addLocalIgnores(project, [...generatedPatterns, "sql-guard.json"]);
  return guardFile;
}

module.exports = { installProjectSupportFiles };
