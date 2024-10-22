const fs = require('fs');
const path = require('path');

const htmlPath = 'dist/reports/coverage/lcov-report/index.html';
const css1Path = 'dist/reports/coverage/lcov-report/base.css';
const css2Path = 'dist/reports/coverage/lcov-report/prettify.css';

try {
    // Read HTML file
    const htmlContent = fs.readFileSync(htmlPath, 'utf-8');

    // Read CSS files
    const css1Content = fs.readFileSync(css1Path, 'utf-8');
    const css2Content = fs.readFileSync(css2Path, 'utf-8');

    // Combine CSS content
    const combinedCss = `<style>${css1Content}\n${css2Content}</style>`;

    // Insert combined CSS into HTML
    const finalHtmlContent = htmlContent.replace(/<\/head>/, `${combinedCss}\n</head>`);

    // Write the combined HTML to a new file
    const outputPath = path.join('dist/reports/coverage/lcov-report', 'coverage-report.html');
    fs.writeFileSync(outputPath, finalHtmlContent, 'utf-8');

    console.log('HTML and CSS combined successfully!');
} catch (error) {
    console.error('An error occurred while combining HTML and CSS:');
    console.error(error.message);
    
    if (error.code === 'ENOENT') {
        console.error('File not found. Please check the file paths and try again.');
    } else if (error.code === 'EACCES') {
        console.error('Permission denied. Please check your file permissions.');
    } else {
        console.error('Unexpected error:', error);
    }
}
