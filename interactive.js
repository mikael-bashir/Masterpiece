
// const fs = require('fs');

// function save(fileName, dictionary) {
//     try {
//         // Convert the dictionary to a compact string
//         const dictionaryString = JSON.stringify(dictionary)
//             .replace(/"([^"]+)":/g, '$1:'); // Remove quotes around keys
//         // Create the JavaScript file content
//         const fileContent = `const data=${dictionaryString};\nexport default data;`;
//         // Write the file
//         fs.writeFileSync(fileName, fileContent, 'utf8');
//         console.log(`File saved successfully: ${fileName}`);
//     } catch (error) {
//         console.error(`Error saving file: ${error.message}`);
//     }
// }

//
// CHANGE WHENEVER ON A NEW FRAME
//
let divStates2 = {};
//
//
//

document.querySelectorAll('.draggable').forEach((element) => {
  console.log(`Found draggable element:`, element);  // Log the found element

  let offsetX, offsetY;

  element.addEventListener('mousedown', (e) => {
      // console.log(`Mouse down on element: ${element.getAttribute('id')}`);
      // console.log(`Initial mouse position: clientX = ${e.clientX}, clientY = ${e.clientY}`);
      // console.log(`Element initial position: offsetLeft = ${element.offsetLeft}, offsetTop = ${element.offsetTop}`);
      
      // Get the initial mouse position relative to the element
      offsetX = e.clientX - element.offsetLeft;
      offsetY = e.clientY - element.offsetTop;
      // console.log(`Calculated offsets: offsetX = ${offsetX}, offsetY = ${offsetY}`);

      // Add mousemove event listener to move the element
      const onMouseMove = (e) => {
          const x = e.clientX - offsetX;
          const y = e.clientY - offsetY;
          // console.log(`Mouse move: clientX = ${e.clientX}, clientY = ${e.clientY}`);
          // console.log(`Element position updated: x = ${x}, y = ${y}`);

          // Move the element to the new position
          element.style.left = `${x}px`;
          element.style.top = `${y}px`;
      };

      // Remove the move event listener when mouse button is released
      const onMouseUp = () => {
          console.log(1);
          console.log(`Mouse up on element: ${element.getAttribute('id')}`);

          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);

          // Track the div state after drag ends
          console.log(`Tracking div state for element: ${element.getAttribute('id')}`);
          trackDivStateFromCustomDrag(element);
          // save('myDictionary.js', myDict);

      };

      // Add event listeners for mouse move and mouse up
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
  });
});

function trackDivStateFromCustomDrag(div) {
  console.log(2);
  const id = div.getAttribute('id');  // Unique identifier of the div
  console.log(`Tracking state for div: ${id}`);

  const state = {
      x: parseFloat(div.style.left) || 0,  // Track horizontal position
      y: parseFloat(div.style.top) || 0,   // Track vertical position
      rotation: parseFloat(getComputedStyle(div).transform.split(',')[1]) * (180/Math.PI) || 0  // Track rotation
  };

  console.log(`State tracked for div ${id}: x = ${state.x}, y = ${state.y}, rotation = ${state.rotation}`);

  // Update the state of the div in the global dictionary (divStates1)
  divStates1[id] = state;
  console.log(`Updated divStates1:`, divStates1);
}

// Function to track the state of a dragged div
// function trackDivState(event) {
//   const div = event.target;  // The div that was dragged
//   const id = div.getAttribute('id');  // Unique identifier of the div
//   const state = {
//       x: parseFloat(div.style.left) || 0,  // Track horizontal position
//       y: parseFloat(div.style.top) || 0,   // Track vertical position
//       rotation: parseFloat(getComputedStyle(div).transform.split(',')[1]) * (180/Math.PI) || 0  // Track rotation
//   };

//   console.log(`Tracking state for div: ${id}`);
//   console.log(`Position: x = ${state.x}, y = ${state.y}`);
//   console.log(`Rotation: ${state.rotation}`);

//   // Update the state of the div in the dictionary
//   divStates1[id] = state;
//   console.log(`Updated divStates1:`, divStates1);
// }

// Function to generate keyframes for a single div based on its states
function generateKeyframes(divId, divStates) {
  console.log(3);
  console.log(`Generating keyframes for div: ${divId}`);
  let keyframes = `@keyframes ${divId}-animation {\n`;

  // Loop over all the provided divStates and generate keyframes
  Object.keys(divStates).forEach((stateDict, index) => {
      if (stateDict[divId]) {
          const state = stateDict[divId];
          const percentage = ((index + 1) / Object.keys(divStates).length) * 100;  // Spread keyframes evenly
          console.log(`Keyframe at ${percentage}%: x = ${state.x}, y = ${state.y}, rotation = ${state.rotation}`);
          keyframes += `
              ${percentage}% {
                  transform: translate(${state.x}px, ${state.y}px) rotate(${state.rotation}deg);
              }\n`;
      }
  });

  keyframes += `}`;
  console.log(`Generated keyframes for ${divId}:`, keyframes);
  return keyframes;
}

// Helper function to extract integer part from divId (treeDetail{n})
function extractIdFromDiv(divId) {
  const matches = divId.match(/\d+/);  // Extract numbers from the id
  console.log(`Extracting id from divId: ${divId}`);
  return matches ? matches[0] : '';  // Return the first match (the number part)
}

// Generate and inject all keyframes based on passed divStates
function generateAllKeyframes(divStates) {
  console.log("Generating all keyframes...");
  let css = "";

  // Iterate through all divs in all provided divState dictionaries
  Object.keys(divStates[0]).forEach(divId => {
      console.log(`Generating keyframes for div: ${divId}`);
      css += generateKeyframes(divId, divStates);  // Generate keyframes for each div
  });

  console.log("Generated CSS for all keyframes:", css);
  return css;
}

// Inject generated keyframes into the document
function injectKeyframesToDocument(divStates) {
  console.log("Injecting keyframes into the document...");
  const css = generateAllKeyframes(divStates);
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = css;
  document.head.appendChild(styleSheet);
  console.log("Keyframes injected successfully.");
}

// Apply the animations to all draggable divs
function applyAnimationsToDivs() {
  console.log("Applying animations to all draggable divs...");
  const allDivs = document.querySelectorAll('.draggable');
  allDivs.forEach(div => {
      const divId = div.getAttribute('id');  // Get the unique id
      const animationName = `dance${extractIdFromDiv(divId)}`;
      console.log(`Applying animation: ${animationName} to div: ${divId}`);
      div.style.animation = `${animationName} 3s infinite`;  // Apply animation with correct name
  });
  console.log("Animations applied to all divs.");
}

// Function to manually pass your hardcoded dictionaries (e.g., divState1, divState2, ...)
function handleManualStates() {
  console.log("Handling manual div states...");

  // Example of manually passed divState dictionaries
  let divState1 = { 'div1': { x: 10, y: 20, rotation: 45 } };
  let divState2 = { 'div1': { x: 30, y: 40, rotation: 90 } };
  // Continue adding your divStateN dictionaries here as needed
  
  let divStates = [divState1, divState2];  // Combine all your divStates into an array

  console.log("Generated div states:", divStates);

  // Now, inject keyframes based on the manual divStates
  // injectKeyframesToDocument(divStates);
  // applyAnimationsToDivs();  // Apply the animations to all divs
}

// Call this function when you're done manually updating your divState dictionaries
// handleManualStates();  // Call this to handle div states manually, creates divStates



// make sure handleManualStates gets all the divStates
// make files to store copy and pastable forms of div (programatically save the contents of divStates)
// call generateAllKeyFrames with the array of the 16 divStates, either by programatically reading the 
// respective files and creating such an array, or manually copy and paste.
// debug faulty rotation property

const callCreateFrameEndpoint = async () => {
  try {
      const response = await fetch('http://localhost:3000/create-frame');
      if (response.ok) {
          const data = await response.text(); // Endpoint returns a plain text message
          console.log(data); // Logs "File 'frame1' created successfully!" if successful
      } else {
          console.error(`Failed to call the endpoint. Status: ${response.status}`);
      }
  } catch (error) {
      console.error('Error calling the endpoint:', error.message);
  }
};

document.querySelector('.saveButton').addEventListener('click', () => {

  fetch('/save-div-state', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          divState: divStates1,
      }),
  })
  .then((response) => {
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.text();
  })
  .then((data) => console.log(data)) // Logs success message
  .catch((error) => console.error('Error:', error)); // Logs error if any
});