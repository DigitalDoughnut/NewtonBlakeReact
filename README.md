# Newton Blake Website - React Version

A React-based frontend for the Newton Blake portfolio website that integrates with the WordPress backend.

## Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Multi-Page Navigation**: Home, Design, Lifestyle, Travel, and About pages
- **Comments System**: Users can leave comments on any page via WordPress REST API
- **Modern UI**: Clean, professional design with smooth animations
- **React-based**: Built with React using CDN-based distribution
- **Hash-based Routing**: URL updates with page navigation (e.g., `/#/design`)

## Quick Start

1. Place this folder in your web server's public directory (e.g., `htdocs`)
2. Ensure WordPress is running at `http://localhost/wordpress`
3. Open `http://localhost/NewtonBlakeWebsiteReact/` in your browser

## File Structure

- `index.html` - Main HTML file with embedded React application
- `style.css` - Complete styling for all pages and components
- `README.md` - This file

## How It Works

The application:
1. Fetches page content from the WordPress REST API at `http://localhost/wordpress/wp-json/wp/v2/pages`
2. Displays pages with featured images, author information, and metadata
3. Allows users to post comments directly to WordPress
4. Uses hash-based routing for navigation (`/#/home`, `/#/design`, etc.)

## Pages

- **Home** - Welcome page with site introduction
- **Design** - Design philosophy and portfolio
- **Lifestyle** - Lifestyle content and photography
- **Travel** - Travel photography and experiences
- **About** - Biography and background information

## Comments System

Comments are fetched from and posted to the WordPress REST API. The comments section is collapsible on each page for a clean user experience.

## Browser Support

Works in all modern browsers that support ES6 and React 18:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Customization

To customize content or styling:
- Edit page content in WordPress (pages with slugs: home, design, lifestyle, travel, about)
- Modify colors and styles in `style.css`
- Update React components directly in the `<script type="text/babel">` section of `index.html`

## Technologies Used

- React 18 (via CDN)
- Babel Standalone (for JSX transpilation)
- WordPress REST API
- CSS3 with custom properties
