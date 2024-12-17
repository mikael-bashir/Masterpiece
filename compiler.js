// // Function to track the state of a dragged div
// function trackDivState(event) {
//     const div = event.target;  // The div that was dragged
//     const id = div.getAttribute('id');  // Unique identifier of the div
//     const state = {
//         x: parseFloat(div.style.left) || 0,  // Track horizontal position
//         y: parseFloat(div.style.top) || 0,   // Track vertical position
//         rotation: parseFloat(getComputedStyle(div).transform.split(',')[1]) || 0  // Track rotation
//     };

//     console.log(`Tracking state for div: ${id}`);
//     console.log(`Position: x = ${state.x}, y = ${state.y}`);
//     console.log(`Rotation: ${state.rotation}`);

//     // Update the state of the div in the dictionary
//     divStates1[id] = state;
//     console.log(`Updated divStates1:`, divStates1);
// }

// // Function to generate keyframes for a single div based on its states
// function generateKeyframes(divId, divStates) {
//     console.log(`Generating keyframes for div: ${divId}`);
//     let keyframes = `@keyframes ${divId}-animation {\n`;

//     // Loop over all the provided divStates and generate keyframes
//     Object.keys(divStates).forEach((stateDict, index) => {
//         if (stateDict[divId]) {
//             const state = stateDict[divId];
//             const percentage = ((index + 1) / Object.keys(divStates).length) * 100;  // Spread keyframes evenly
//             console.log(`Keyframe at ${percentage}%: x = ${state.x}, y = ${state.y}, rotation = ${state.rotation}`);
//             keyframes += `
//                 ${percentage}% {
//                     transform: translate(${state.x}px, ${state.y}px) rotate(${state.rotation}deg);
//                 }\n`;
//         }
//     });

//     keyframes += `}`;
//     console.log(`Generated keyframes for ${divId}:`, keyframes);
//     return keyframes;
// }

// // Helper function to extract integer part from divId (treeDetail{n})
// function extractIdFromDiv(divId) {
//     const matches = divId.match(/\d+/);  // Extract numbers from the id
//     console.log(`Extracting id from divId: ${divId}`);
//     return matches ? matches[0] : '';  // Return the first match (the number part)
// }

// // Generate and inject all keyframes based on passed divStates
// function generateAllKeyframes(divStates) {
//     console.log("Generating all keyframes...");
//     let css = "";

//     // Iterate through all divs in all provided divState dictionaries
//     Object.keys(divStates[0]).forEach(divId => {
//         console.log(`Generating keyframes for div: ${divId}`);
//         css += generateKeyframes(divId, divStates);  // Generate keyframes for each div
//     });

//     console.log("Generated CSS for all keyframes:", css);
//     return css;
// }

// // Inject generated keyframes into the document
// function injectKeyframesToDocument(divStates) {
//     console.log("Injecting keyframes into the document...");
//     const css = generateAllKeyframes(divStates);
//     const styleSheet = document.createElement("style");
//     styleSheet.type = "text/css";
//     styleSheet.innerText = css;
//     document.head.appendChild(styleSheet);
//     console.log("Keyframes injected successfully.");
// }

// // Apply the animations to all draggable divs
// function applyAnimationsToDivs() {
//     console.log("Applying animations to all draggable divs...");
//     const allDivs = document.querySelectorAll('.draggable');
//     allDivs.forEach(div => {
//         const divId = div.getAttribute('id');  // Get the unique id
//         const animationName = `dance${extractIdFromDiv(divId)}`;
//         console.log(`Applying animation: ${animationName} to div: ${divId}`);
//         div.style.animation = `${animationName} 3s infinite`;  // Apply animation with correct name
//     });
//     console.log("Animations applied to all divs.");
// }

// // Function to manually pass your hardcoded dictionaries (e.g., divState1, divState2, ...)
// function handleManualStates() {
//     console.log("Handling manual div states...");

//     // Example of manually passed divState dictionaries
//     let divState1 = { 'div1': { x: 10, y: 20, rotation: 45 } };
//     let divState2 = { 'div1': { x: 30, y: 40, rotation: 90 } };
//     // Continue adding your divStateN dictionaries here as needed
    
//     let divStates = [divState1, divState2];  // Combine all your divStates into an array

//     console.log("Generated div states:", divStates);

//     // Now, inject keyframes based on the manual divStates
//     // injectKeyframesToDocument(divStates);
//     // applyAnimationsToDivs();  // Apply the animations to all divs
// }

// // Call this function when you're done manually updating your divState dictionaries
// // handleManualStates();  // Call this to handle div states manually, creates divStates
