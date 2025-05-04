const fs = require("fs");
const { promisify } = require("util");
const { exec } = require("child_process");

// Promisify exec for easier async handling
const execAsync = promisify(exec);

class ChangelogGenerator {
  constructor(options = {}) {
    this.targetDir = options.targetDir || "src/components/oxbow/";
    this.changelogFile = options.changelogFile || "CHANGELOG.md";

    // Default blacklist of folders to exclude
    this.folderBlacklist = new Set(["__test__"]);

    // Allow custom blacklist to be passed in
    if (options.folderBlacklist) {
      options.folderBlacklist.forEach((folder) =>
        this.folderBlacklist.add(folder)
      );
    }
  }

  /**
   * Check if a folder is blacklisted
   * @param {string} folder - Folder name to check
   * @returns {boolean}
   */
  isFolderBlacklisted(folder) {
    return this.folderBlacklist.has(folder);
  }

  /**
   * Check if a file is a test file by naming convention
   * @param {string} filePath
   * @returns {boolean}
   */
  isTestFile(filePath) {
    return /(\.|\/)(test|spec)\.(js|ts|jsx|tsx)$/.test(filePath);
  }

  /**
   * Check if current directory is a git repository
   * @returns {Promise<boolean>}
   */
  async isGitRepository() {
    try {
      await execAsync("git rev-parse --is-inside-work-tree");
      return true;
    } catch {
      console.error("Not a git repository");
      return false;
    }
  }

  /**
   * Extract relative path parts
   * @param {string} filePath
   * @returns {string[]}
   */
  extractPathParts(filePath) {
    const relativePath = filePath
      .replace(new RegExp(`^${this.targetDir}`), "")
      .replace(/^\//, "");
    return relativePath.split("/");
  }

  /**
   * Get git changes for components
   * @returns {Promise<Object>}
   */
  async getGitChanges() {
    const changes = {};

    try {
      const { stdout } = await execAsync(
        `git log --date=short --pretty=format:"%ad" --name-status --diff-filter=ADM -- "${this.targetDir}"`
      );

      const lines = stdout.split("\n");
      let currentDate = null;

      for (const line of lines) {
        if (/^\d{4}-\d{2}-\d{2}$/.test(line)) {
          currentDate = line;
          if (!changes[currentDate]) {
            changes[currentDate] = {
              added: {},
              modified: {},
              renamed: {},
            };
          }
          continue;
        }

        if (currentDate) {
          const match = line.match(/^([AMDR])\s+(.+)/);
          if (match) {
            const [, changeType, filePath] = match;

            if (filePath.startsWith(this.targetDir.replace(/^\.\//, ""))) {
              // Skip test files
              if (this.isTestFile(filePath)) continue;

              const [section, subSection] = this.extractPathParts(filePath).slice(-3, -1);
              const pathKey = `${section}/${subSection}`;

              if (this.isFolderBlacklisted(pathKey)) continue;

              switch (changeType) {
                case "A":
                  changes[currentDate].added[pathKey] =
                    (changes[currentDate].added[pathKey] || 0) + 1;
                  break;
                case "M":
                  changes[currentDate].modified[pathKey] =
                    (changes[currentDate].modified[pathKey] || 0) + 1;
                  break;
                case "R":
                  changes[currentDate].renamed[pathKey] =
                    (changes[currentDate].renamed[pathKey] || 0) + 1;
                  break;
              }
            }
          }
        }
      }

      return changes;
    } catch (error) {
      console.error("Error retrieving git changes:", error);
      return {};
    }
  }

  readExistingChangelog() {
    try {
      return fs.readFileSync(this.changelogFile, "utf8");
    } catch (error) {
      return error.code === "ENOENT" ? "" : (() => { throw error })();
    }
  }

  extractExistingDates(content) {
    const dateRegex = /## (\d{4}-\d{2}-\d{2})/g;
    const dates = new Set();
    let match;
    while ((match = dateRegex.exec(content)) !== null) {
      dates.add(match[1]);
    }
    return dates;
  }

  generateChangelogMarkdown(changes) {
    const existingContent = this.readExistingChangelog();
    const existingDates = this.extractExistingDates(existingContent);

    let markdown = "";

    if (!existingContent) {
      markdown = `# Changelog for Oxbow UI Components\n\n`;
    }

    const sortedDates = Object.keys(changes)
      .filter((date) => !existingDates.has(date))
      .sort((a, b) => new Date(b) - new Date(a));

    for (const date of sortedDates) {
      const dateChanges = changes[date];

      if (
        Object.values(dateChanges.added).length === 0 &&
        Object.values(dateChanges.modified).length === 0 &&
        Object.values(dateChanges.renamed).length === 0
      ) {
        continue;
      }

      markdown += `## **${date}**\n\n`;

      if (Object.keys(dateChanges.added).length > 0) {
        markdown += "### Added\n";
        for (const [path, count] of Object.entries(dateChanges.added).sort()) {
          const [section, subSection] = path.split("/");
          markdown += `- ${subSection}: [${count} component${count > 1 ? "s" : ""}](https://oxbowui.com/playground/${section}/${subSection})\n`;
        }
        markdown += "\n";
      }

      if (Object.keys(dateChanges.modified).length > 0) {
        markdown += "### Modified\n";
        for (const [path, count] of Object.entries(dateChanges.modified).sort()) {
          const [section, subSection] = path.split("/");
          markdown += `- ${subSection}: [${count} component${count > 1 ? "s" : ""}](https://oxbowui.com/playground/${section}/${subSection})\n`;
        }
        markdown += "\n";
      }

      if (Object.keys(dateChanges.renamed).length > 0) {
        markdown += "### Renamed\n";
        for (const [path, count] of Object.entries(dateChanges.renamed).sort()) {
          const [section, subSection] = path.split("/");
          markdown += `- ${subSection}: [${count} component${count > 1 ? "s" : ""}](https://oxbowui.com/playground/${section}/${subSection})\n`;
        }
        markdown += "\n";
      }
    }

    if (existingContent) {
      const headerEndPos = existingContent.indexOf("\n\n");
      if (headerEndPos !== -1) {
        return (
          existingContent.slice(0, headerEndPos + 2) +
          markdown +
          existingContent.slice(headerEndPos + 2)
        );
      }
    }

    return markdown;
  }

  async generate() {
    const isGitRepo = await this.isGitRepository();
    if (!isGitRepo) {
      process.exit(1);
    }

    const changes = await this.getGitChanges();
    const markdown = this.generateChangelogMarkdown(changes);

    if (markdown.trim()) {
      try {
        fs.writeFileSync(this.changelogFile, markdown);
        console.log(`Changelog updated: ${this.changelogFile}`);
      } catch (error) {
        console.error("Error writing changelog:", error);
      }
    } else {
      console.log("No new changes to add to changelog");
    }
  }
}

// CLI support
if (require.main === module) {
  const generator = new ChangelogGenerator();
  generator.generate().catch(console.error);
}

module.exports = ChangelogGenerator;
