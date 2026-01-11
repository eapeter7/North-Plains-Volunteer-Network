
import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'screens', 'Volunteer.tsx');
const content = fs.readFileSync(filePath, 'utf8');

const searchStr = 'const ContactStaffModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {';
const firstIndex = content.indexOf(searchStr);
const secondIndex = content.indexOf(searchStr, firstIndex + 1);

if (secondIndex !== -1) {
    // Find matching closing brace for the component block
    let depth = 0;
    let endIndex = -1;
    for (let i = secondIndex; i < content.length; i++) {
        if (content[i] === '{') depth++;
        if (content[i] === '}') {
            depth--;
            if (depth === 0) {
                endIndex = i;
                break;
            }
        }
    }

    if (endIndex !== -1) {
        // Include the semicolon if present
        if (content[endIndex + 1] === ';') endIndex++;

        const newContent = content.slice(0, secondIndex) + content.slice(endIndex + 1);
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log('Duplicate removed successfully.');
    } else {
        console.log('Could not find end of block.');
        process.exit(1);
    }
} else {
    console.log('No duplicate found.');
}
