import "tsx-dom";

import App from './App';

document.getElementById("font")!.innerText = `@font-face {
    font-family: 'Circular Std';
    src: url('/public/font/Black.woff2') format('woff2');
    font-weight: black;
    font-style: normal;
    font-display: swap
}

@font-face {
    font-family: 'Circular Std';
    src: url('/public/font/BlackItalic.woff2') format('woff2');
    font-weight: black;
    font-style: italic;
    font-display: swap
}

@font-face {
    font-family: 'Circular Std';
    src: url('/public/font/Bold.woff2') format('woff2');
    font-weight: bold;
    font-style: normal;
    font-display: swap
}

@font-face {
    font-family: 'Circular Std';
    src: url('/public/font/BoldItalic.woff2') format('woff2');
    font-weight: bold;
    font-style: italic;
    font-display: swap
}

@font-face {
    font-family: 'Circular Std';
    src: url('/public/font/Book.woff2') format('woff2');
    font-weight: normal;
    font-style: normal;
    font-display: swap
}

@font-face {
    font-family: 'Circular Std';
    src: url('/public/font/BookItalic.woff2') format('woff2');
    font-weight: normal;
    font-style: italic;
    font-display: swap
}

@font-face {
    font-family: 'Circular Std';
    src: url('/public/font/Medium.woff2') format('woff2');
    font-weight: 500;
    font-style: normal;
    font-display: swap
}

@font-face {
    font-family: 'Circular Std';
    src: url('/public/font/MediumItalic.woff2') format('woff2');
    font-weight: 500;
    font-style: italic;
    font-display: swap
}`

document.body.appendChild(<App />);

// You're garbage, let me collect you.
fetch("/api/gc")