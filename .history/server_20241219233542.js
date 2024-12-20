import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

//
// CHANGE WHENEVER ON A NEW FRAME
//
const filename = 'frame11.js';
//
//
//

app.use(express.static(path.resolve(__dirname)));

// Endpoint to create a file called frame1
app.get('/create-frame', (req, res) => {
    const filePath = path.resolve(__dirname, filename); // Specify the file name and extension
    const fileContent = '';

    try {
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, fileContent, 'utf8');
            console.log(`File created: ${filePath}`);
            res.status(200).send(`File ${filename} created successfully!`);
        } else {
            console.log(`File already exists: ${filePath}`);
            res.status(200).send(`File ${filename} already exists.`);
        }
    } catch (error) {
        console.error(`Error creating file: ${error.message}`);
        res.status(500).send('Failed to create the file.');
    }
});

async function reconstructDivState() {
    try {
        const filePath = path.resolve(__dirname, filename);
        // Dynamically import the file
        const module = await import(filePath);
        const divState = module.default; // Access the default export

        console.log('Reconstructed divState:', divState);

        // Now you can use `divState` as needed
    } catch (error) {
        console.error('Error reconstructing divState:', error.message);
    }
}

// reconstructDivState();

// Endpoint to save a div state to a file
app.post('/save-div-state', (req, res) => {
    const { divState } = req.body;
    const fileName = filename;

    if (!fileName || !divState) {
        return res.status(400).send('Missing fileName or divState in the request.');
    }

    try {
        const divStateString = JSON.stringify(divState).replace(/"([^\"]+)":/g, '$1:');
        const fileContent = `const data=${divStateString};\nexport default data;`;
        fs.writeFileSync(fileName, fileContent, 'utf8');

        res.status(200).send(`File saved successfully: ${fileName}`);
    } catch (error) {
        console.error(`Error saving file "${fileName}": ${error.message}`);
        res.status(500).send(`Error saving file: ${error.message}`);
    }
});

// Endpoint to read a single div state from a file
app.get('/read-div-state/:fileName', (req, res) => {
    const { fileName } = req.params;

    try {
        const filePath = path.resolve(__dirname, fileName);
        if (!fs.existsSync(filePath)) {
            return res.status(404).send(`File not found: ${fileName}`);
        }

        import(filePath).then((data) => {
            res.status(200).json(data.default);
        }).catch((error) => {
            console.error(`Error reading file "${fileName}": ${error.message}`);
            res.status(500).send(`Error reading file: ${error.message}`);
        });
    } catch (error) {
        console.error(`Error reading file "${fileName}": ${error.message}`);
        res.status(500).send(`Error reading file: ${error.message}`);
    }
});

// Endpoint to read multiple div states from a list of files
app.post('/read-multiple-div-states', (req, res) => {
    const { fileNames } = req.body;

    if (!Array.isArray(fileNames)) {
        return res.status(400).send('fileNames must be an array.');
    }

    const divStates = [];

    Promise.all(fileNames.map(async (fileName) => {
        const filePath = path.resolve(__dirname, fileName);
        if (fs.existsSync(filePath)) {
            try {
                const data = await import(filePath);
                divStates.push(data.default);
            } catch (error) {
                console.warn(`Error loading file "${fileName}": ${error.message}`);
            }
        } else {
            console.warn(`File not found: ${fileName}`);
        }
    })).then(() => {
        res.status(200).json(divStates);
    }).catch((error) => {
        console.error(`Error reading multiple files: ${error.message}`);
        res.status(500).send(`Error reading files: ${error.message}`);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
