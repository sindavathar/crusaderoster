Project Name: Warhammer 40k Unit Management App
Overview
This project is an Angular application designed to manage Warhammer 40k units, factions, and lists. It includes an admin panel for importing and managing factions and units, as well as a detailed view of individual units.

Features
Add, rename, and delete factions and units.
Import factions and units from Wahapedia.
View detailed information about each unit, including stats, weapons, abilities, and more.
Manage matched lists, including adding and removing units and calculating total points.
Prerequisites
Node.js (>=14.x)
npm (>=6.x)
Angular CLI (>=12.x)
Installation
Clone the repository:

sh
Copy code
git clone https://github.com/yourusername/warhammer40k-unit-management.git
cd warhammer40k-unit-management
Install the dependencies:

sh
Copy code
npm install
Running the Application
Start the development server:

sh
Copy code
ng serve
This will start the Angular development server and the application will be available at http://localhost:4200/.

Start the proxy server:

To handle CORS issues when fetching data from Wahapedia, you need to run a proxy server. You can use a simple Node.js proxy server for this purpose. Create a file named proxy-server.js in the root directory with the following content:

js
Copy code
const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/proxy', async (req, res) => {
  try {
    const url = req.query.url;
    const response = await axios.get(url);
    res.send(response.data);
  } catch (error) {
    res.status(500).send('Error fetching data from Wahapedia');
  }
});

app.listen(port, () => {
  console.log(`Proxy server running at http://localhost:${port}`);
});
Install the required dependencies:

sh
Copy code
npm install express axios

Then start the proxy server:

sh
Copy code
node proxy-server.js
This will start the proxy server on port 3000.

Project Structure
src/app/pages/admin: Contains the admin-related components for managing factions and units.
src/app/pages/matched-list: Contains components for managing matched lists.
src/app/services: Contains services for handling data related to factions, units, and unit details.
src/assets: Contains static assets such as images and stylesheets.
Key Components and Services
AdminComponent: Manages factions and units. Allows adding, renaming, and deleting factions and units, as well as importing data from Wahapedia.
UnitDetailComponent: Displays detailed information about a unit, including stats, weapons, abilities, and more.
MatchedListComponent: Manages matched lists, allowing users to add and remove units and view the total points.
StorageService: Handles data storage and retrieval for factions and units.
UnitDetailsService: Manages the fetching, parsing, and storing of detailed unit information from Wahapedia.
Adding a New Faction
Navigate to the admin panel.
Enter the new faction name in the input field and click "Add Faction".
Renaming a Faction
In the admin panel, click on the faction name you want to rename.
Click "Rename", enter the new name, and confirm.
Deleting a Faction
In the admin panel, click on the faction name you want to delete.
Click "Delete" and confirm the deletion.
Importing Factions and Units
In the admin panel, enter the URL for importing factions or units from Wahapedia.
Click "Import Factions" or "Import Units".
Viewing Unit Details
Navigate to the unit detail page by clicking on a unit name in the list.
The detailed information about the unit will be displayed, including stats, weapons, abilities, composition, rules, and keywords.
Managing Matched Lists
Navigate to the matched list page.
Add units to categories and view the total points for the list.
Remove units from categories as needed.
Contributions
Contributions are welcome! Please fork the repository and submit a pull request.

License
This project is licensed under the MIT License.



