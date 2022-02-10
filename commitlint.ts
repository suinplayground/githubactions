import type { UserConfig as CommitlintConfig } from "@commitlint/types";
import { cosmiconfigSync } from "cosmiconfig";
import type { Config as GitCzConfig } from "./gitcz.js";
import { types } from "./types.js";

const defineConfig = (config: CommitlintConfig = {}): CommitlintConfig => {
  const { list, scopes, minMessageLength, maxMessageLength } =
    loadGitCzConfig();
  const rules: CommitlintConfig["rules"] = {};
  rules["type-enum"] = [2, "always", list ?? types.map(({ type }) => type)];
  if (scopes && scopes.length > 0) {
    rules["scope-enum"] = [2, "always", scopes];
  }
  return {
    ...config,
    extends: ["@commitlint/config-conventional"],
    rules: {
      ...rules,
      "subject-min-length": [2, "always", minMessageLength ?? 3],
      "subject-max-length": [2, "always", maxMessageLength ?? 64],
      "body-max-length": [0], // disable to prevent error on release commits
      "body-max-line-length": [0], // disable to prevent error on release commits
      "footer-max-length": [0], // disable to prevent error on release commits
      "footer-max-line-length": [0], // disable to prevent error on release commits
      ...(config.rules ?? {}),
    },
  };
};

export = defineConfig;

const loadGitCzConfig = (): GitCzConfig => {
  const name = "changelog";
  const explorer = cosmiconfigSync(name, {
    searchPlaces: [
      ".git-cz.json",
      `${name}.config.js`,
      "changelog.config.json",
    ],
  });
  const result = explorer.search();
  if (result === null || result.isEmpty) {
    return require("./changelog.config");
  }
  return result.config;
};
