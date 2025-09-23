const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const { exec } = require("child_process");

// Promisify exec for easier async handling
const execAsync = promisify(exec);

class ChangelogGenerator {
  constructor(options = {}) {
    this.targetDir = options.targetDir || "src/components/oxbow/";
    this.changelogFile = options.changelogFile || "CHANGELOG.md";
    this.configPath =
      options.configPath ||
      path.join(process.cwd(), "src", "config", "changelog.json");

    // Default blacklist of folders to exclude
    this.folderBlacklist = new Set(["__test__"]);

    // Allow custom blacklist to be passed in
    if (options.folderBlacklist) {
      options.folderBlacklist.forEach((folder) =>
        this.folderBlacklist.add(folder),
      );
    }
  }

  getMonthsLimit(defaultValue = 3) {
    const env = process.env.CHANGELOG_MONTHS;
    if (env && !isNaN(parseInt(env, 10))) return parseInt(env, 10);
    try {
      const raw = fs.readFileSync(this.configPath, "utf8");
      const cfg = JSON.parse(raw);
      if (cfg && typeof cfg.monthsLimit === "number") return cfg.monthsLimit;
    } catch {}
    return defaultValue;
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
   * @returns {Promise<Record<string, {added: Record<string, number>, modified: Record<string, number>, deleted: Record<string, number>, renamed: Record<string, number>}>>}
   */
  async getGitChanges() {
    try {
      // Fetch changes since configured months ago
      const sinceArg = `${this.getMonthsLimit()} months ago`;
      const { stdout } = await execAsync(
        `git log --since="${sinceArg}" --name-status --pretty=format:"%cd" --date=short`,
      );
      const lines = stdout.split("\n");
      const changes = {};
      let currentDate = null;
      for (const line of lines) {
        const dateMatch = line.trim().match(/^\d{4}-\d{2}-\d{2}$/);
        if (dateMatch) {
          currentDate = dateMatch[0];
          if (!changes[currentDate]) {
            changes[currentDate] = {
              added: {},
              modified: {},
              deleted: {},
              renamed: {},
            };
          }
          continue;
        }
        const match = line.match(/^([AMDR])\s+(.+)/);
        if (match && currentDate) {
          const [, type, filePath] = match;
          if (!filePath.startsWith(this.targetDir.replace(/^\.\//, "")))
            continue;
          if (this.isTestFile(filePath)) continue;
          const parts = this.extractPathParts(filePath);
          const slice = parts.slice(-3, -1);
          if (slice.length < 2) continue;
          const [section, subSection] = slice;
          const pathKey = `${section}/${subSection}`;
          if (this.isFolderBlacklisted(pathKey)) continue;
          const actionMap = {
            A: "added",
            M: "modified",
            D: "deleted",
            R: "renamed",
          };
          const key = actionMap[type];
          changes[currentDate][key][pathKey] =
            (changes[currentDate][key][pathKey] || 0) + 1;
        }
      }
      return changes;
    } catch (error) {
      console.error("Error retrieving git changes:", error);
      return {};
    }
  }

  extractExistingDates(content) {
    // Matches headings like:
    // ## 2025-08-14
    // ## **2025-08-14**
    const dateRegex = /##\s+\**(\d{4}-\d{2}-\d{2})\**/g;
    const dates = new Set();
    let match;
    while ((match = dateRegex.exec(content)) !== null) {
      dates.add(match[1]);
    }
    return dates;
  }
  /**
   * Read existing changelog file if present
   * @returns {string}
   */
  readExistingChangelog() {
    try {
      if (fs.existsSync(this.changelogFile)) {
        return fs.readFileSync(this.changelogFile, "utf8");
      }
    } catch {}
    return "";
  }

  generateChangelogMarkdown(changes) {
    // Safely read existing changelog
    const existingContent =
      typeof this.readExistingChangelog === "function"
        ? this.readExistingChangelog()
        : "";
    const existingDates = this.extractExistingDates(existingContent);
    // Always include today's changes so counts update
    const today = new Date().toISOString().split("T")[0];

    let markdown = "";

    if (!existingContent) {
      markdown = `# Changelog for Oxbow UI Components\n\n`;
    }

    const sortedDates = Object.keys(changes)
      .filter((date) => date === today || !existingDates.has(date))
      .sort((a, b) => new Date(b) - new Date(a));

    for (const date of sortedDates) {
      const dateChanges = changes[date];

      if (
        Object.values(dateChanges.added).length === 0 &&
        Object.values(dateChanges.modified).length === 0 &&
        Object.values(dateChanges.deleted).length === 0 &&
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
        for (const [path, count] of Object.entries(
          dateChanges.modified,
        ).sort()) {
          const [section, subSection] = path.split("/");
          markdown += `- ${subSection}: [${count} component${count > 1 ? "s" : ""}](https://oxbowui.com/playground/${section}/${subSection})\n`;
        }
        markdown += "\n";
      }

      if (Object.keys(dateChanges.deleted).length > 0) {
        markdown += "### Deleted\n";
        for (const [path, count] of Object.entries(
          dateChanges.deleted,
        ).sort()) {
          const [section, subSection] = path.split("/");
          markdown += `- ${subSection}: [${count} component${count > 1 ? "s" : ""}](https://oxbowui.com/playground/${section}/${subSection})\n`;
        }
        markdown += "\n";
      }

      if (Object.keys(dateChanges.renamed).length > 0) {
        markdown += "### Renamed\n";
        for (const [path, count] of Object.entries(
          dateChanges.renamed,
        ).sort()) {
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

  /**
   * Keep only entries from the latest N months.
   * @param {string} content
   * @param {number} limitMonths
   * @returns {string}
   */
  trimToRecentMonths(content, limitMonths = 3) {
    const lines = content.split("\n");
    const header = [];
    let i = 0;
    // Capture header until first H2
    while (i < lines.length && !lines[i].startsWith("## ")) {
      header.push(lines[i]);
      i++;
    }

    const headingRe = /^##\s+\**(\d{4})-(\d{2})-(\d{2})\**\s*$/;
    const entries = [];
    while (i < lines.length) {
      const line = lines[i];
      const m = line.match(headingRe);
      if (!m) {
        i++;
        continue;
      }
      const y = m[1],
        mo = m[2],
        d = m[3];
      const dateStr = `${y}-${mo}-${d}`;
      const monthKey = `${y}-${mo}`;
      const yyyymmdd = parseInt(`${y}${mo}${d}`, 10);
      const section = [line];
      i++;
      while (i < lines.length && !lines[i].startsWith("## ")) {
        section.push(lines[i]);
        i++;
      }
      entries.push({ dateStr, monthKey, yyyymmdd, section });
    }

    // Build unique months sorted by newest (descending)
    const uniqueMonths = Array.from(new Set(entries.map((e) => e.monthKey)));
    uniqueMonths.sort(
      (a, b) =>
        parseInt(b.replace("-", ""), 10) - parseInt(a.replace("-", ""), 10),
    );
    const allowedMonths = new Set(
      uniqueMonths.slice(0, Math.max(1, limitMonths)),
    );

    // Group entries by month and sort entries within each month by date desc
    const byMonth = new Map();
    for (const e of entries) {
      if (!allowedMonths.has(e.monthKey)) continue;
      if (!byMonth.has(e.monthKey)) byMonth.set(e.monthKey, []);
      byMonth.get(e.monthKey).push(e);
    }
    for (const arr of byMonth.values())
      arr.sort((a, b) => b.yyyymmdd - a.yyyymmdd);

    // Emit months in newest-first order
    const out = [...header];
    for (const m of uniqueMonths) {
      if (!allowedMonths.has(m)) continue;
      const list = byMonth.get(m) || [];
      for (const e of list) out.push(...e.section);
    }
    return out.join("\n");
  }

  async generate() {
    const isGitRepo = await this.isGitRepository();
    if (!isGitRepo) {
      process.exit(1);
    }

    const changes = await this.getGitChanges();
    const markdown = this.generateChangelogMarkdown(changes);
    const trimmed = this.trimToRecentMonths(markdown, this.getMonthsLimit(3));

    if (trimmed.trim()) {
      try {
        fs.writeFileSync(this.changelogFile, trimmed);
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
