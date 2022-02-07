import { types } from "./types.js";

const defineConfig = ({
  types,
  ...config
}: defineConfig.UserConfig = {}): defineConfig.Config => ({
  ...config,
  list: toList(types),
  types: toTypes(types),
});

export = defineConfig;

declare namespace defineConfig {
  type UserConfig = Partial<
    Readonly<
      Omit<Config, "types" | "list"> & {
        types: TypeDefs;
      }
    >
  >;

  type TypeDefs = {
    readonly [key: string]: {
      description: string;
      emoji: string;
    };
  };

  /**
   * A configuration for git-cz.
   *
   * @see {@link https://github.com/streamich/git-cz#custom-config} for documentation
   * @see {@link https://github.com/streamich/git-cz/blob/master/lib/defaults.js} for default configs.
   */
  type Config = {
    /**
     * default: false
     */
    disableEmoji?: boolean;
    /**
     * default: "{type}{scope}: {emoji}{subject}"
     */
    format?: string;
    list?: string[];
    maxMessageLength?: number;
    minMessageLength?: number;
    questions?: string[];
    scopes?: string[];
    types: {
      [K: string]: {
        description: string;
        emoji: string;
        value: string;
      };
    };
    /**
     * default: "🧨"
     */
    breakingChangePrefix?: string;
    /**
     * default: "✅"
     */
    closedIssuePrefix?: string;
  };
}

const toList = (customTypes: defineConfig.TypeDefs | undefined): string[] =>
  isObject(customTypes)
    ? Object.keys(customTypes)
    : types.map(({ type }) => type);

const toTypes = (
  customTypes: defineConfig.TypeDefs | undefined
): defineConfig.Config["types"] =>
  Object.fromEntries(
    isObject(customTypes)
      ? Object.entries(customTypes).map(([type, { description, emoji }]) => [
          type,
          { description, emoji, value: type },
        ])
      : types.map(({ type, description, emoji }) => [
          type,
          { description, emoji, value: type },
        ])
  );

const isObject = (value: any): value is object =>
  value !== null && typeof value === "object";
