import { css } from '@emotion/react';

export const globalStyles = css`
  :root {
    --primary-color: #121212;
    --secondary-color: #808080;
    --accent-color: #9C7CF4;
    --background-color:rgb(5, 5, 5);
    --text-color: #E0E0E0;
    --font-primary: 'Helvetica Neue', Arial, sans-serif;
    --font-secondary: 'Georgia', serif;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  *::before,
  *::after {
    box-sizing: border-box;
  }

  body {
    font-family: var(--font-primary);
    color: var(--text-color);
    background-color: var(--background-color);
    line-height: 1.6;
    min-height: 100vh;
    overflow-x: hidden;
    width: 100%;
  }
  
  html {
    background-color: var(--background-color);
    overflow-x: hidden;
    width: 100%;
  }
  
  #root {
    width: 100%;
    overflow-x: hidden;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-secondary);
    font-weight: 700;
    margin-bottom: 1rem;
  }

  h1 {
    font-size: 2.5rem;
    line-height: 1.2;
  }

  h2 {
    font-size: 2rem;
    line-height: 1.3;
  }

  h3 {
    font-size: 1.75rem;
    line-height: 1.4;
  }

  p {
    margin-bottom: 1.5rem;
  }

  a {
    color: var(--accent-color);
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
      color: darken(var(--accent-color), 10%);
    }
  }

  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  button {
    font-family: var(--font-primary);
  }
`;
