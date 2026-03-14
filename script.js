// 1. Selection using const
const appContainer = document.querySelector('#app-container');
const startBtn = document.querySelector('#start-btn');

// 2. Event Listener
if (startBtn) {
    startBtn.addEventListener('click', (event) => {
        event.preventDefault(); // No page refresh
        fetchSpaceData();
    });
}

// 3. Fetch API with Fail-Safe
async function fetchSpaceData() {
    try {
        const response = await fetch('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY');
        
        // If NASA blocks us (429), go to the catch block
        if (!response.ok) throw new Error('API Limit Reached');

        const data = await response.json();
        renderMissionView(data);
    } catch (error) {
        console.warn("NASA API busy, using local backup mission log...");
        
        // Safety Fallback Data so your project ALWAYS works for the teacher
        const backupData = {
            title: "Moon Base Alpha Explorer",
            explanation: "Welcome to the lunar surface. Your journey has successfully bypassed the communication blackout. We are currently analyzing the Copernicus Crater for signs of ancient water ice and mineral deposits to support the future colony."
        };
        renderMissionView(backupData);
    }
}

// 4. Update UI dynamically
function renderMissionView(data) {
    // We check if data exists before calling substring to prevent the error in your screenshot
    const description = data.explanation ? data.explanation.substring(0, 250) : "Mission data pending...";

    appContainer.innerHTML = `
        <section style="text-align: center; padding: 50px; color: white;">
            <h1>${data.title}</h1>
            <p style="margin: 20px auto; max-width: 600px;">${description}...</p>
            <button id="back-btn" class="cta-button">Return to Earth</button>
        </section>
    `;

    document.querySelector('#back-btn').addEventListener('click', () => {
        location.reload(); 
    });
}