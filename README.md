# AltGen frontend repository

## Technology
*This project is using vue to make frontend and connect to our .NET API* /n
At this instant it is only running on localhost, but as a proof of concept and a prototype it works

# 🚀 Running the Project Locally

Follow these steps to set up and run the **AltGenFrontend** project on your local machine.

---

## **1️⃣ Prerequisites**
Before starting, ensure you have the following installed:

- [Node.js (LTS version)](https://nodejs.org/) (includes npm)
- Git (for cloning the repository)

Check your installations:
```sh
node -v  # Check Node.js version
npm -v   # Check npm version
git --version  # Check Git version
```
## **2️⃣ Clone the Repository**
Clone the project from GitHub:
``` sh
git clone https://github.com/h599002/AltGenFrontend.git
cd AltGenFrontend
```
## **3️⃣ Install Dependencies**
Run the following command to install all required packages: /n
Navigate into *AltGenFrontend* and *AltGen-vue-app*
```sh
cd AltGenFrontEnd
cd AltGen-vue-app
```
Then install required packages:
``` sh
npm install
```
## **4️⃣ Run the Development Server**
Start the local development server:
``` sh
npm run dev
```
After running this command, the console will display a local server URL (hopefully http://localhost:5173/, if not, our REST API wont accept it per feb 25). /n
Open it in your browser.

## **5️⃣ Project Structure**
```text
AltGenFrontend/
AltGen-vue-app/
│── src/                 # Source code
│   ├── components/      # Vue components
│   ├── views/           # Application views/pages
│   ├── assets/          # Static assets
│── public/              # Public static files
│── package.json         # Project dependencies & scripts
│── vite.config.js       # Vite configuration
│── README.md            # Project documentation
```

## **6️⃣ Additional Commands**
| Command           | Description                      |
|-------------------|----------------------------------|
| `npm install`     | Install dependencies             |
| `npm run dev`     | Start the local dev server       |
| `npm run build`   | Build the project for production |
| `npm run preview` | Preview production build locally |
| `npm run lint`    | Run linter to check code quality |

