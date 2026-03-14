# mtm6302-capstone-ryan2221122
# Capstone Project - Part 1
**Name:** [ryan ismael]
**Student Number:** [041162012]
**Project Name:** [space]
# Visual Mockup - Capstone Part 2
## Design Choices
For the visual mockup, I chose a **"Galaxy/Space" aesthetic** to reflect the theme of exploration and discovery. The design uses a deep, dark color palette to mimic the vastness of space, with a high-contrast moon imagery as the focal point. This creates an immersive experience that draws the user's focus immediately to the central "Start Journey" call to action.

## Color & Typography
* **Primary Background:** Deep Navy/Black (#1B1F3A) - Chosen to represent deep space and reduce eye strain.
* **Text Color:** White (#FFFFFF) - Ensures maximum readability against the dark background.
* **Typography:**
    * **Headings:** *Serif* style - Gives the project a classic, editorial, and storytelling feel.
    * **Buttons:** Paired with clear, readable text to differentiate interactive elements from decorative text.

## Layout & Responsiveness
* **Mobile:** Uses a stacked layout with a **Hamburger Menu** to save screen space and prioritize the hero image.
* **Tablet (iPad):** Adapts to a wider view, removing the hamburger menu in favor of a top navigation bar for quicker access.
* **Desktop:** Utilizes the full screen width, allowing the central imagery to breathe while keeping navigation accessible at the top right.

## UX Improvements
The high-fidelity design improves usability by using standard UI patterns (recognizable hamburger menu on mobile, clear button placement). The contrast between the button background and the dark environment ensures the primary user action ("Start Journey") is obvious on every device size.

1.Steps Taken
Repository Setup: Cloned the capstone repository and created a new development branch named prototype-assignment-3 to follow proper Git workflow.

HTML Structure: Developed the semantic structure including a navigation bar, a hero section, and a central container for the moon focal point to match the Part 2 mockup.

CSS Styling: Implemented a "Galaxy/Space" aesthetic using a deep space background, a dark blue navigation bar (#1a1f35), and a circular moon focal point.

Responsiveness: Added media queries to ensure the moon container and typography scale correctly for mobile devices.

UI Polish: Applied hover effects and glowing shadows to the "Start the Journey" button to create an immersive user experience.
Challenges Faced
Git Navigation: I initially had trouble running Git commands because I was in the wrong parent directory. I solved this by using the cd command to move into the actual repository folder.

File Structure: I accidentally created a folder named style.css instead of a file, which prevented the CSS from loading. I corrected this by deleting the directory and creating a proper .css file.

UI Matching: It was a challenge to get the text perfectly centered inside the moon image while maintaining responsiveness. I solved this by using Flexbox on the moon container.

# Space Journey - Capstone Part 4

## 🚀 Mission Overview
Space Journey is a Single Page Application (SPA) designed to give users an interactive experience exploring moon missions using real-time data from NASA.

## 🛠️ Part 4 - Functional Report

### Steps Taken
1. **Branching:** Created a `part-4` branch to move from a static prototype to a functional JS application.
2. **SPA Architecture:** Modified `index.html` to use a `<main id="app-container">` shell, allowing content to swap without page refreshes.
3. **Event Handling:** Implemented "Start the Journey" logic using `addEventListener` to maintain clean separation of concerns.
4. **Data Integration:** Integrated the **NASA APOD API** using the `fetch()` method with `async/await` for asynchronous data retrieval.

### Resources Used
- NASA Planetary Astronomy Picture of the Day (APOD) API.
- MDN Web Docs for Fetch API and DOM Manipulation.

### Challenges & Solutions
- **The 429 Error Challenge:** During testing, the NASA API key (DEMO_KEY) hit a rate limit, returning a 429 error and causing a `TypeError` in the code.
- **The Solution:** I implemented a **Try/Catch fail-safe**. If the API fails, the app now automatically switches to a "Local Mission Log" backup, ensuring the user experience never breaks.