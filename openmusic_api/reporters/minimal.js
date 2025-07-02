const chalk = require('chalk');

class MinimalReporter {
  onTestResult(test, result) {
    result.testResults.forEach(t => {
      const [rootDescribe, ...rest] = t.ancestorTitles;
      const subDescribe = rest.join(' - ');
      const fullTitle = [rootDescribe, subDescribe, t.title]
        .filter(Boolean)
        .join(' - ');

      const status = t.status === 'passed'
        ? chalk.green('✔')
        : chalk.red('✖');

      const duration = t.duration ? ` (${t.duration} ms)` : '';
      console.log(`${status} ${fullTitle}${duration}`);

      if (t.status === 'failed') {
        const message = t.failureMessages?.[0];
        if (message) {
          console.log(chalk.red(message));
        }
      }
    });
  }

  onRunComplete(_, results) {
    const passed = chalk.green(`${results.numPassedTests} tests passed`);
    const failed = results.numFailedTests > 0
      ? chalk.red(`${results.numFailedTests} tests failed`)
      : '';

    console.log(`\n${passed}`);
    if (failed) console.log(failed);
  }
}

module.exports = MinimalReporter;
