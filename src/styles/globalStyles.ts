import { css } from '@emotion/react';

export const globalStyles = css`
  :root {
    --primary-color: #1a1a1a;
    --secondary-color: #666666;
    --accent-color:rgba(118, 87, 202, 0.61);
    --background-color: #ffffff;
    --text-color: #333333;
    --font-primary: 'Helvetica Neue', Arial, sans-serif;
    --font-secondary: 'Georgia', serif;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: var(--font-primary);
    color: var(--text-color);
    background-color: var(--background-color);
    line-height: 1.6;
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
