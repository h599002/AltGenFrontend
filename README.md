# AltGen Frontend

A Vue.js frontend for the AltGen project, providing an accessible interface for generating alt text for images using various AI models.

## Dependencies

- Vue 3
- Pinia (State Management)
- Axios (HTTP Client)
- TailwindCSS (Styling)
- TypeScript

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
Run the following command to install all required packages: \
Navigate into *AltGenFrontend* and *AltGen-vue-app*
```sh
cd AltGenFrontEnd
cd AltGen-vue-app
```
Then install required packages:
``` sh
npm install
npm install Pinia
npm install -D tailwindcss postcss autoprefixer @tailwindcss/postcss
```
## **4️⃣ Run the Development Server**
Start the local development server:
``` sh
npm run dev
```
After running this command, the console will display a local server URL http://localhost:5173/ 
Open it in your browser.

## **5️⃣ Project Structure**
```
AltGen-vue-app/
├── src/
│   ├── components/
│   │   ├── Settings.vue           # Settings panel component for model selection and parameters
│   │   └── HelloWorld.vue         # Example component (can be removed)
│   ├── stores/
│   │   └── settings.ts            # Pinia store for managing application settings
│   ├── services/
│   │   └── api.ts                 # API service layer for backend communication
│   ├── App.vue                    # Main application component
│   └── style.css                  # Global styles
├── public/                        # Static assets
└── package.json                   # Project dependencies and scripts
```

## Component Documentation

### App.vue
Main application component that handles:
- Image upload and preview
- Drag and drop functionality
- Image analysis requests
- Results display
- WCAG-compliant UI elements

Key features:
- Accessible file upload with keyboard support
- Image preview with downscaling
- Loading states with ARIA announcements
- Error handling with accessible messages
- Results display with semantic HTML

### Settings.vue
Settings panel component that manages:
- Model selection
- Temperature control
- Prompt template selection
- Use cognitive layer
- Custom prompt input

Features:
- Slide-in panel design
- Accessible form controls
- Real-time parameter updates
- Model selection dropdown
- Temperature slider with visual feedback

### settings.ts (Pinia Store)
State management for application settings:
- Temperature control (0-2)
- Model selection
- Prompt templates
- Cognitive layer toggle
- State persistence

### api.ts
API service layer that handles:
- Backend communication
- Request/response types
- Error handling
- API endpoint configuration

## Accessibility Features

The application implements WCAG 2.1 guidelines with:
- ARIA labels and roles
- Keyboard navigation
- Focus management
- Screen reader support
- High contrast mode
- Error handling
- Loading states
- Semantic HTML structure


## **6️⃣ Additional Commands**
| Command           | Description                      |
|-------------------|----------------------------------|
| `npm install`     | Install dependencies             |
| `npm run dev`     | Start the local dev server       |
| `npm run build`   | Build the project for production |
| `npm run preview` | Preview production build locally |
| `npm run lint`    | Run linter to check code quality |

