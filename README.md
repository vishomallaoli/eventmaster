# Event Master
<p align="center"> <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js"/> <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React"/> <img src="https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS"/> <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/> <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=white" alt="Firebase"/> <img src="https://img.shields.io/badge/Zod-3178C6?style=for-the-badge&logoColor=white" alt="Zod"/> <img src="https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white" alt="GitHub Actions"/> </p>
**Event Master** is a full-stack web application designed to help users manage events, create accounts, and log in seamlessly. This app integrates modern technologies to deliver a clean, responsive, and scalable solution for event management.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Folder Structure](#folder-structure)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features

- User Authentication (Sign Up, Sign In)
- Social Sign-In (Google, Facebook, GitHub)
- Clean and responsive design using Tailwind CSS
- Built using Next.js (App Router)
- Form validation powered by Zod and react-hook-form
- Event management features (Upcoming)
- Dark mode support (Upcoming)

## Technologies Used

- **Next.js** (13+) – React framework for server-side rendering and file-based routing
- **React** – Component-based UI library
- **Tailwind CSS** – Utility-first CSS framework for styling
- **Zod** – TypeScript-first schema validation for form validation
- **React Hook Form** – Form handling and validation
- **Firebase** (Optional) – Authentication and database management (for scaling)
- **Icons** – React-icons (Google, GitHub, Facebook)

## Getting Started

### Prerequisites

To run this project locally, ensure you have the following installed on your machine:

- **Node.js** (v14+)
- **npm** or **yarn**
- **Git** for version control
- **A GitHub Account** for OAuth (if using social sign-in)

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/vishomallaoli/event-master.git
   cd event-master
   ```

2. **Install dependencies**:

   Using npm:
   ```bash
   npm install
   ```

   Using yarn:
   ```bash
   yarn install
   ```

3. **Set up environment variables**:

   Create a `.env.local` file in the root directory of your project to configure environment variables (e.g., for API keys like Google OAuth or Firebase configuration).

   Example `.env.local`:
   ```bash
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=<your-google-client-id>
   NEXT_PUBLIC_FACEBOOK_CLIENT_ID=<your-facebook-client-id>
   NEXT_PUBLIC_GITHUB_CLIENT_ID=<your-github-client-id>
   ```

4. **Start the development server**:

   Using npm:
   ```bash
   npm run dev
   ```

   Using yarn:
   ```bash
   yarn dev
   ```

   The app should now be running at `http://localhost:3000`.

## Usage

### User Sign-In/Sign-Up

- Users can create an account by signing up with their email and password.
- Social sign-in options include Google, Facebook, and GitHub.

### Event Management (Upcoming Features)

- Users will be able to create, edit, and manage events.
- Admins can view all events and track attendees.

## Folder Structure

Here’s an overview of the folder structure of the project:

```
event-master/
├── app/
│   ├── auth/
│   │   ├── signin/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── signup/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   └── (more pages…)
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── form.tsx
│   │   └── input.tsx
├── public/
├── styles/
│   ├── globals.css
├── .env.local
├── tailwind.config.js
├── tsconfig.json
├── next.config.js
└── README.md
```

- `app/`: Contains all your pages, including `signin` and `signup` under the `auth` folder.
- `components/`: Reusable UI components like buttons, forms, and inputs.
- `styles/`: Contains your global and custom styles (e.g., Tailwind).
- `public/`: Static assets like images, icons, etc.

## Contributing

Contributions are welcome! If you'd like to contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature (`git checkout -b feature-name`).
3. Make the necessary changes and commit them (`git commit -m "Added feature"`).
4. Push the changes to your branch (`git push origin feature-name`).
5. Open a pull request on GitHub.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

If you have any questions or suggestions, feel free to contact me:

**Visho Malla Oli**

- GitHub: [@vishomallaoli](https://github.com/vishomallaoli)
- Email: [vishomallaoli1@gmail.com](mailto:vishomallaoli1@gmail.com)

---

### Additional Notes:
1. **Optional Features**: If you plan to add more features like event creation or Firebase integration, you can mention those in the "Upcoming Features" section or add them as separate sections when implemented.
2. **License**: Update the license section if you haven't decided on a license yet.

This README will give users or collaborators a clear understanding of the project, how to set it up, and how they can contribute. Let me know if you'd like any other details added!
