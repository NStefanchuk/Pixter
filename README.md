# Pixter

Pixter is a social network for photographers to share photos, get feedback, and grow together.

[![React](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=black&style=for-the-badge)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?logo=typescript&logoColor=white&style=for-the-badge)](https://www.typescriptlang.org/)
[![MUI](https://img.shields.io/badge/-MUI-007FFF?logo=mui&logoColor=white&style=for-the-badge)](https://mui.com/)
[![React Router](https://img.shields.io/badge/-React%20Router-CA4245?logo=react-router&logoColor=white&style=for-the-badge)](https://reactrouter.com/)
[![Redux Toolkit](https://img.shields.io/badge/-Redux%20Toolkit-764ABC?logo=redux&logoColor=white&style=for-the-badge)](https://redux-toolkit.js.org/)
[![React Icons](https://img.shields.io/badge/-React%20Icons-6AD1E3?logo=react&logoColor=black&style=for-the-badge)](https://react-icons.github.io/react-icons/)
[![react-hot-toast](https://img.shields.io/badge/-react--hot--toast-EC5A4F?logo=react&logoColor=white&style=for-the-badge)](https://react-hot-toast.com/)
[![Node.js](https://img.shields.io/badge/-Node.js-339933?logo=node.js&logoColor=white&style=for-the-badge)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/-Express-000000?logo=express&logoColor=white&style=for-the-badge)](https://expressjs.com/)

## Features

- Authentication: sign up / sign in.
- Profile: avatar, bio, stats (posts, followers, following).
- Feed: responsive cards with author, date, location, and photo.
- Post modal: image preview and comments.
- Comments: list, add comment (client-side integration).
- Create post: add image URL and description.
- Light/Dark mode: persistent toggle with CSS variables and Header switch.

## Tech Stack (Client)

- React + TypeScript
- MUI (Material UI)
- React Router
- Redux Toolkit (global user state)
- React Icons
- react-hot-toast

Backend (API)

- Node.js + Express (production is comming)


## Getting Started

Prerequisites:

- Node.js 18+

Install and run client:

- cd client
- npm install
- npm run dev

Backend:

- Ensure an API with endpoints:
  - POST /users/register
  - POST /users/login
  - GET /users/me
  - GET /posts, POST /posts
  - GET /comments, POST /comments

## Project Structure (client)

- src/components: reusable UI (Header, PostTile, Comments, Modal, Auth forms)
- src/pages: route pages (Welcome, Authorization, Main, Profile)
- src/utils: API helpers and shared types
- src/assets: static assets (SVG, icons)
