# Newton Blake Website - React Version

A React-based frontend for the Newton Blake portfolio website that integrates with the WordPress backend.

## Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Multi-Page Navigation**: Home, Portfolio, Design, and About pages
- **Comments System**: Users can leave comments on any page (using localStorage)
- **Modern UI**: Clean, professional design with smooth animations
- **React-based**: Built with React using CDN-based distribution for compatibility

## Structure

- `index.html` - Main HTML entry point
- `app.jsx` - React application and components
- `style.css` - Styling for all pages
- `package.json` - Project metadata

## Running the Project

Since this project uses React from CDN, you can run it directly without a build step:

### Option 1: Using Python HTTP Server
```bash
cd c:\xampp\htdocs\NewtonBlakeWebsiteReact
python -m http.server 8080
```

Then visit: `http://localhost:8080/`

### Option 2: Using PHP Built-in Server
```bash
cd c:\xampp\htdocs\NewtonBlakeWebsiteReact
php -S localhost:8080
```

### Option 3: Using XAMPP
If you want to access it as `http://localhost/NewtonBlakeWebsiteReact/design`, ensure it's in the htdocs folder (it already is) and access it through your XAMPP server.

## Pages

### Home
- Welcome message
- Call-to-action buttons
- Comments section

### Portfolio
- Grid of portfolio items
- Showcases projects with emoji placeholders
- Comments section

### Design
- Design philosophy explanation
- Four design principle cards
- Comments section

### About
- Personal biography
- Journey in design
- Skills and expertise
- Philosophy
- Comments section

## Comments System

Comments are stored locally using the browser's localStorage. Each page has its own comments section:
- `comments-home`
- `comments-portfolio`
- `comments-design`
- `comments-about`

To integrate with the WordPress backend, uncomment the `postComment()` function call in the `CommentsSection` component and ensure your WordPress REST API is properly configured.

## Integration with WordPress Backend

The application is designed to work with the existing WordPress backend at `http://localhost/NewtonBlakeWebsite/`. To enable WordPress integration:

1. Ensure the WordPress site is running on the same local server
2. Uncomment the WordPress comment posting code in `app.jsx`
3. Configure your WordPress REST API to accept CORS requests from the React frontend

## Customization

- **Colors**: Modify the color values in `style.css`
- **Portfolio Items**: Edit the `portfolioItems` array in `PortfolioPage` component
- **Design Principles**: Update the design items in `DesignPage` component
- **About Content**: Modify the text in `AboutPage` component

## Browser Support

Works in all modern browsers that support ES6 and React 19:
- Chrome/Edge
- Firefox
- Safari

## Notes

- The project uses Babel standalone for JSX compilation in the browser
- Comments persist in localStorage (survives page refreshes but not browser cache clear)
- Images/emojis are used as placeholders for portfolio items
