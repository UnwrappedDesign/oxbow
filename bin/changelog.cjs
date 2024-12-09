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
     * @returns {string} Most specific folder name
     */
    extractMostSpecificFolder(filePath) {
        // Remove target directory prefix
        const relativePath = filePath.replace(new RegExp(`^${this.targetDir}`), '').replace(/^\//, '');
        
        // Split path into components
        const pathParts = relativePath.split('/');
        
        // If no path parts, return 'root'
        if (pathParts.length === 0) return 'root';
        
        // If file is directly in target directory, use filename without extension
        if (pathParts.length === 1) {
            return path.basename(pathParts[0], path.extname(pathParts[0]));
        }
        
        // Return the folder just before the filename
        return pathParts[pathParts.length - 2];
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
                            // Extract most specific folder name
                            const folderName = this.extractMostSpecificFolder(filePath);

                            // Skip blacklisted folders
                            if (this.isFolderBlacklisted(folderName)) {
                                continue;
                            }

                            switch (changeType) {
                                case 'A':
                                    changes[currentDate].added[folderName] = 
                                        (changes[currentDate].added[folderName] || 0) + 1;
                                    break;
                                case 'M':
                                    changes[currentDate].modified[folderName] = 
                                        (changes[currentDate].modified[folderName] || 0) + 1;
                                    break;
                                case 'R':
                                    changes[currentDate].renamed[folderName] = 
                                        (changes[currentDate].renamed[folderName] || 0) + 1;
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
     * Generate changelog markdown
     * @param {Object} changes - Git changes to document
     */
    generateChangelogMarkdown(changes) {
        let markdown = `# Changelog for Oxbow Components\n\n`;

        // Sort dates in descending order
        const sortedDates = Object.keys(changes).sort((a, b) => new Date(b) - new Date(a));

        for (const date of sortedDates) {
            const dateChanges = changes[date];
            
            // Skip dates with no changes
            if (Object.values(dateChanges.added).length === 0 &&
                Object.values(dateChanges.modified).length === 0 &&
                Object.values(dateChanges.renamed).length === 0) {
                continue;
            }

            markdown += `## ${date}\n\n`;

            if (Object.keys(dateChanges.added).length > 0) {
                markdown += '### Added\n';
                for (const [folder, count] of Object.entries(dateChanges.added).sort()) {
                    markdown += `- ${folder}: ${count} component${count > 1 ? 's' : ''}\n`;
                }
                markdown += '\n';
            }

            if (Object.keys(dateChanges.modified).length > 0) {
                markdown += '### Modified\n';
                for (const [folder, count] of Object.entries(dateChanges.modified).sort()) {
                    markdown += `- ${folder}: ${count} component${count > 1 ? 's' : ''}\n`;
                }
                markdown += '\n';
            }

            if (Object.keys(dateChanges.renamed).length > 0) {
                markdown += '### Renamed\n';
                for (const [folder, count] of Object.entries(dateChanges.renamed).sort()) {
                    markdown += `- ${folder}: ${count} component${count > 1 ? 's' : ''}\n`;
                }
                markdown += '\n';
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

        // Write to changelog file
        try {
            fs.writeFileSync(this.changelogFile, markdown);
            console.log(`Changelog generated: ${this.changelogFile}`);
        } catch (error) {
            console.error('Error writing changelog:', error);
        }
    }
}

// CLI support
if (require.main === module) {
    const generator = new ChangelogGenerator();
    generator.generate().catch(console.error);
}

module.exports = ChangelogGenerator;