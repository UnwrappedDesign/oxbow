const fs = require('fs');
const { promisify } = require('util');
const { exec } = require('child_process');
const path = require('path');

// Promisify exec for easier async handling
const execAsync = promisify(exec);

class ChangelogGenerator {
    constructor(options = {}) {
        this.targetDir = options.targetDir || 'src/components/oxbow/';
        this.changelogFile = options.changelogFile || 'CHANGELOG.md';
        
        // Default blacklist of folders to exclude
        this.folderBlacklist = new Set([
            '__test__',
        ]);

        // Allow custom blacklist to be passed in
        if (options.folderBlacklist) {
            options.folderBlacklist.forEach(folder => 
                this.folderBlacklist.add(folder)
            );
        }
    }

    /**
     * Check if a folder is blacklisted
     * @param {string} folder - Folder name to check
     * @returns {boolean} - True if folder is blacklisted, false otherwise
     */
    isFolderBlacklisted(folder) {
        return this.folderBlacklist.has(folder);
    }

    /**
     * Check if the current directory is a git repository
     * @returns {Promise<boolean>}
     */
    async isGitRepository() {
        try {
            await execAsync('git rev-parse --is-inside-work-tree');
            return true;
        } catch (error) {
            console.error('Not a git repository');
            return false;
        }
    }

    /**
     * Extract the most specific (bottom-level) folder from a file path
     * @param {string} filePath - Full file path
     * @returns {string[]} Array of path parts
     */
    extractPathParts(filePath) {
        // Remove target directory prefix
        const relativePath = filePath.replace(new RegExp(`^${this.targetDir}`), '').replace(/^\//, '');
        
        // Split path into components
        const pathParts = relativePath.split('/');
        
        return pathParts;
    }

    /**
     * Retrieve git changes for the specified directory
     * @returns {Promise<Object>}
     */
    async getGitChanges() {
        const changes = {};

        try {
            // Retrieve git log with detailed changes
            const { stdout } = await execAsync(
                `git log --date=short --pretty=format:"%ad" --name-status --diff-filter=ADM -- "${this.targetDir}"`
            );

            const lines = stdout.split('\n');
            let currentDate = null;

            for (const line of lines) {
                // Check if line is a date
                if (/^\d{4}-\d{2}-\d{2}$/.test(line)) {
                    currentDate = line;
                    if (!changes[currentDate]) {
                        changes[currentDate] = {
                            added: {},
                            modified: {},
                            renamed: {}
                        };
                    }
                    continue;
                }

                // Process file changes
                if (currentDate) {
                    const match = line.match(/^([AMDR])\s+(.+)/);
                    if (match) {
                        const [, changeType, filePath] = match;
                        
                        // Ensure file is within target directory
                        if (filePath.startsWith(this.targetDir.replace(/^\.\//, ''))) {
                            const [section, subSection, _componentName] = this.extractPathParts(filePath).slice(-3);

                            const path = `${section}/${subSection}`;

                            // Skip blacklisted folders
                            if (this.isFolderBlacklisted(path)) {
                                continue;
                            }

                            switch (changeType) {
                                case 'A':
                                    changes[currentDate].added[path] = 
                                        (changes[currentDate].added[path] || 0) + 1;
                                    break;
                                case 'M':
                                    changes[currentDate].modified[path] = 
                                        (changes[currentDate].modified[path] || 0) + 1;
                                    break;
                                case 'R':
                                    changes[currentDate].renamed[path] = 
                                        (changes[currentDate].renamed[path] || 0) + 1;
                                    break;
                            }
                        }
                    }
                }
            }

            return changes;
        } catch (error) {
            console.error('Error retrieving git changes:', error);
            return {};
        }
    }

    /**
     * Read existing changelog content
     * @returns {string} Existing changelog content or empty string if file doesn't exist
     */
    readExistingChangelog() {
        try {
            return fs.readFileSync(this.changelogFile, 'utf8');
        } catch (error) {
            // If file doesn't exist, return empty string
            if (error.code === 'ENOENT') {
                return '';
            }
            throw error;
        }
    }

    /**
     * Extract dates from existing changelog
     * @param {string} content - Existing changelog content
     * @returns {Set<string>} Set of dates in YYYY-MM-DD format
     */
    extractExistingDates(content) {
        const dateRegex = /## (\d{4}-\d{2}-\d{2})/g;
        const dates = new Set();
        let match;
        while ((match = dateRegex.exec(content)) !== null) {
            dates.add(match[1]);
        }
        return dates;
    }

    /**
     * Generate changelog markdown
     * @param {Object} changes - Git changes to document
     */
    generateChangelogMarkdown(changes) {
        const existingContent = this.readExistingChangelog();
        const existingDates = this.extractExistingDates(existingContent);

        let markdown = '';
        
        // If no existing content, add the header
        if (!existingContent) {
            markdown = `# Changelog for Oxbow UI Components\n\n`;
        }

        // Sort dates in descending order
        const sortedDates = Object.keys(changes)
            .filter(date => !existingDates.has(date)) // Only process new dates
            .sort((a, b) => new Date(b) - new Date(a));

        for (const date of sortedDates) {
            const dateChanges = changes[date];
            
            // Skip dates with no changes
            if (Object.values(dateChanges.added).length === 0 &&
                Object.values(dateChanges.modified).length === 0 &&
                Object.values(dateChanges.renamed).length === 0) {
                continue;
            }

            markdown += `## **${date}**\n\n`;

            if (Object.keys(dateChanges.added).length > 0) {
                markdown += '### Added\n';
                for (const [path, count] of Object.entries(dateChanges.added).sort()) {
                    const [section, subSection] = path.split('/');
                    markdown += `- ${subSection}: [${count} component${count > 1 ? 's' : ''}](https://oxbowui.com/playground/${section}/${subSection})\n`;
                }
                markdown += '\n';
            }

            if (Object.keys(dateChanges.modified).length > 0) {
                markdown += '### Modified\n';
                for (const [path, count] of Object.entries(dateChanges.modified).sort()) {
                    const [section, subSection] = path.split('/');
                    markdown += `- ${subSection}: [${count} component${count > 1 ? 's' : ''}](https://oxbowui.com/playground/${section}/${subSection})\n`;
                }
                markdown += '\n';
            }

            if (Object.keys(dateChanges.renamed).length > 0) {
                markdown += '### Renamed\n';
                for (const [path, count] of Object.entries(dateChanges.renamed).sort()) {
                    const [section, subSection] = path.split('/');
                    markdown += `- ${subSection}: [${count} component${count > 1 ? 's' : ''}](https://oxbowui.com/playground/${section}/${subSection})\n`;
                }
                markdown += '\n';
            }
        }

        // Combine new entries with existing content
        if (existingContent) {
            // Find the position after the header
            const headerEndPos = existingContent.indexOf('\n\n');
            if (headerEndPos !== -1) {
                // Insert new content after the header
                return existingContent.slice(0, headerEndPos + 2) + 
                       markdown + 
                       existingContent.slice(headerEndPos + 2);
            }
        }

        return markdown;
    }

    /**
     * Main method to generate changelog
     */
    async generate() {
        // Validate git repository
        const isGitRepo = await this.isGitRepository();
        if (!isGitRepo) {
            process.exit(1);
        }

        // Retrieve changes
        const changes = await this.getGitChanges();

        // Generate markdown
        const markdown = this.generateChangelogMarkdown(changes);

        // Only write if there are actual changes to write
        if (markdown.trim()) {
            try {
                fs.writeFileSync(this.changelogFile, markdown);
                console.log(`Changelog updated: ${this.changelogFile}`);
            } catch (error) {
                console.error('Error writing changelog:', error);
            }
        } else {
            console.log('No new changes to add to changelog');
        }
    }
}

// CLI support
if (require.main === module) {
    const generator = new ChangelogGenerator();
    generator.generate().catch(console.error);
}

module.exports = ChangelogGenerator;