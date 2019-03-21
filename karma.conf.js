const browsers = process.platform === "win32"
    ? ['ChromeHeadless', 'FirefoxHeadless', 'IE']
    : ['ChromeHeadless', 'FirefoxHeadless'];

module.exports = function (config) {
    config.set({
        frameworks: ["mocha", "karma-typescript"],

        files: ["index.ts",
            {
                pattern: "lib/**/*.ts"
            },
            {
                pattern: "test/**/*.ts"
            }
        ],

        preprocessors: {
            "**/*.ts": ["karma-typescript"]
        },

        karmaTypescriptConfig: {
            tsconfig: "tsconfig.json",
            include: [
                "./index.ts",
                "./lib/**/*.ts",
                "./test/**/*.ts"
            ]
        },
    
        reporters: ["dots", "karma-typescript"],

        browsers,

        singleRun: true
    });
};