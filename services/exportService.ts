
// Helper function to convert array of objects to CSV string
function convertToCSV(objArray: any[]): string {
    if (!objArray || objArray.length === 0) {
        return '';
    }
    const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
    let str = '';
    let header = '';

    // Get headers
    for (const index in array[0]) {
        if (header !== '') header += ',';
        header += `"${index.replace(/"/g, '""')}"`; // Escape double quotes in header
    }
    str += header + '\r\n';

    // Get data rows
    for (let i = 0; i < array.length; i++) {
        let line = '';
        for (const index in array[i]) {
            if (line !== '') line += ',';
            
            let value = array[i][index];
            if (typeof value === 'string') {
                value = `"${value.replace(/"/g, '""')}"`; // Escape double quotes in string values
            } else if (value === null || value === undefined) {
                value = '""'; // Represent null/undefined as empty quoted string
            } else {
                 value = `"${String(value).replace(/"/g, '""')}"`; // Convert others to string and escape
            }
            line += value;
        }
        str += line + '\r\n';
    }
    return str;
}

// Function to trigger CSV download
export function exportToCSV(data: any[], filename: string): void {
    const csvData = convertToCSV(data);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    if (link.download !== undefined) { // feature detection
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    } else {
        // For older browsers that don't support download attribute
        // You might want to use a library or a server-side solution here
        alert("CSV export is not fully supported in your browser. Please try a modern browser.");
    }
}
