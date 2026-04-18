
const fs = require("fs");
const path = require("path");

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        if(file.includes("node_modules") || file.includes(".next") || file.includes(".git")) return;
        const filePath = path.resolve(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(filePath));
        } else if (filePath.endsWith(".tsx") || filePath.endsWith(".ts")) {
            results.push(filePath);
        }
    });
    return results;
}

const files = walk(__dirname);

let changedFiles = 0;
files.forEach(file => {
    let content = fs.readFileSync(file, "utf8");
    let initial = content;

    // Replace $ followed by { (JSX text expression start)
    content = content.replace(/\$\{([^}]+)\}/g, (match, p1, offset, string) => {
        // If it is inside a template literal (backticks), the `$` might be part of `${...}`
        // We only want to replace `$` if there is a double `$$` or if it is literal in JSX
        // A safer way is to specifically target \$ followed by {price or {totalPrice or similar
        return match; 
    });

    // Alternatively, lets just specifically target the known patterns
    content = content.replace(/\$\{([^}]*price[^}]*)\}/gi, "₱{$1}");
    content = content.replace(/\$\{([^}]*totalPrice[^}]*)\}/gi, "₱{$1}");
    content = content.replace(/\$\{([^}]*amount[^}]*)\}/gi, "₱{$1}");
    
    // Also the template literals: `$${totalPrice.toFixed(0)}` -> `₱${totalPrice.toFixed(0)}`
    content = content.replace(/\$\$\{/g, "₱${");
    
    if (initial !== content) {
        fs.writeFileSync(file, content);
        changedFiles++;
        console.log("Updated: " + file);
    }
});
console.log("Done. Changed " + changedFiles + " files.");
