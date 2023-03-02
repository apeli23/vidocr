# How to Extract Text(s) from Videos with Javascript.

## Introduction

Optical Character Recognition (OCR) is a technology that enables computers to read and convert images containing printed text into machine-encoded text. In this article, we'll build a simple optical character recognition app using React, HTML Canvas, and Tesseract.js. The application will allow users to choose a video containing printed text and then capture a frame from that video to use Tesseract's OCR engine to extract the text from the image. The extracted text will appear on the screen for them to view.

## Demo
View the final demo of this project [here](https://vidocr.vercel.app/).

## Source Code
You can also check out my Github source code [here](https://github.com/apeli23/vidocr.git)

## Prerequisites
To follow along with this tutorial, you will need to be familiar with React and JavaScript. You should also have Node.js and npm installed on your machine.

## Creating a New React Project
First, we'll create a new React project using Create React App. Open your terminal and run the following command:
```
npx create-react-app ocr-app
cd ocr-app
```

Next, we need to install the dependencies required by this project. To do this, run the following command:

```
npm install --save html2canvas
```

This installs the html2canvas library, which we will use to capture the video frame as an image.

We will also install tailwind, a popular utility-first CSS framework. Tailwind makes it easier to style our application without writing custom CSS. Use the code below in your terminal to install tailwind

```
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Next, we will configure Tailwind with Next.js. To do this, create a new configuration file called tailwind.config.js in the root directory of our project and add the following content:

```
// tailwind.config.js
module.exports = {
  mode: "jit",
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
```

Next, in the `styles/global.css` directory, add the following code:
```
/* styles/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## The Layout component
I will start by building a layout component which I find to be a recommendable practice in react. The layout component helps you provide a consistent look and feel across your web pages. It can contain common elements such as a header, footer, and navigation menu, which are reused across multiple pages. Using a layout component makes it easier to manage your application's styling and layout by defining the layout in one place. It also allows you to customize the layout for different pages by passing props to child components. In summary, using a layout component can help you provide a consistent user experience and simplify the management of styling and layout while ensuring that common elements are kept consistent across different pages. Here is the code for my layout component:

```
import Head from 'next/head';
import Link from 'next/link';
import React from 'react';

export default function Layout({ title, children }) {
    return (
        <>
            <Head>
                <title>{title ? title + ' - videoOCR' : 'videoOCR'}</title>
                <meta name="description" content="Online-videoOCR Website" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="flex min-h-screen flex-col justify-between">
                <header>
                    <nav
                        className="flex h-16 items-center px-4 justify-between shadow-md"
                    >
                        <Link href="/" legacyBehavior>
                            <a className="text-lg font-bold">videoOCR</a>
                        </Link>
                        <div>
                            <Link href="/cart" legacyBehavior>
                                <a className="p-2">Documenation</a>
                            </Link>
                            <button className="bg-emerald-500 hover:bg-emerald-700 text-white font-bold py-1 px-4 rounded">
                                Blog
                            </button>
                        </div>
                    </nav>
                </header>
                <main className="container m-auto mt-4 px-4 h-80">{children}</main>
                <footer className="flex h-10 justify-center items-center shadow-inner ">
                    <p>Copyright © 2023 by Apeli Brian</p>
                </footer>
            </div>
        </>
    );
}
```
We use Layout components to help build out the layout of our sites. The layout component takes two props: title, which is used to set the HTML title tag, and children, which is used to render the child components within the Layout component. We use Tailwind CSS classes to style each HTML element as well as some helper classes that ensure that the main content is centered vertically between the header and footer sections.
## Building the Video OCR App
Let us now build the OCR application one step at a time.

### 1. Add the necessary imports to the top of the index.js file.
```
import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import Layout from './components/Layout';
```
Here, we import React, useState, useRef, and Layout from our components folder.

### 2. Define the initial state of our application.

```
function OCR() {
  const videoRef = useRef(null);
  const inputRef = useRef(null);
  const resultRef = useRef(null);

  const [video, setVideo] = useState(null);
  const [textpreview, setTextPreview] = useState(false);

```
We define the following state variables using the useState hook:

- `video`: Stores the selected video file
- `textpreview`: Stores the extracted text from the image

We also define the following refs using the useRef hook:
- `videoRef`: References the video element
- `inputRef`: References the file input element
- `resultRef`: References the text preview element

### 3. Implement the chooseVideo function.

```
const chooseVideo = (e) => {
  const file = e.target?.files?.[0];
  setVideo(file);
};
```
The `chooseVideo` function is called when the user selects a video file. It extracts the file object from the input event, sets it as the value of the video state variable and returns its value.

## 4. Implement the captureText function.

const captureText = async () => {
  const video = videoRef.current;
  const canvas = await html2canvas(video);
  handleOCR(canvas.toDataURL());
};
The `captureText` function is called when the user clicks the "Capture Text" button. It uses the html2canvas library to capture a frame from the video and convert it to a data URL. It then calls the `handleOCR` function with the data URL as an argument.

## 5. Implement the handleOCR function.
```
const handleOCR = async (preview) => {
  try {
    const response = await fetch('/api/tesseract', {
      method: 'POST',
      body: JSON.stringify({ data: preview }),
      headers: { 'Content-Type': 'application/json' },
    });
    if (response.status === 200) {
      const data = await response.json();
      textHandler(data.message);
    }
  } catch (error) {
    console.error(error);
  }
};
```
This function is defined to make an HTTP POST request to an API endpoint that performs OCR. The `handleOCR` function will send the screenshot data to the server and receive the OCR result. If the response status is 200, it calls a `textHandler` function with the text result.

### 6. Implement the `textHandler` function
```
const textHandler = (txt) => {
  if (txt) {
    const cleaned_Text = txt.replace(/[^a-zA-Z ]/g, '');
    setTextPreview(cleaned_Text);
  }
};
```

The `textHandler` function is defined to handle the text result by removing any non-alphabetic characters and setting the `textpreview` state variable. It removes any non-alphabetic characters from the text result using a regular expression.

### 7. The return statement.
Finally, implement your return statement. The video component will contain two conditional blocks that render based on the state of `video`. If `video` is truthy, we display a video player and a button to capture text; if it's false, the video and text are deactivated. Remember to surround the return statement with `Layout` component.

```
...
  return (
    <Layout>
      {video ? (
        <div className="grid grid-cols-2 gap-10">
          <div className="text-center">
            <h3>Selected video: </h3>
            <video autoPlay loop muted controls ref={videoRef}>
              <source src={URL.createObjectURL(video)} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <button
              className="mt-3 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
              onClick={captureText}
            >
              Capture Text
            </button>
          </div>
          <div ref={resultRef} className="text-center">
            {textpreview ? <p>{textpreview}</p> : <h3>Retrieved text shows here...</h3>}
          </div>
        </div>
      ) : (
        <div className="grid h-screen place-items-center">
          <button
            className="w-3/4 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
            onClick={() => inputRef.current.click()}
          >
            Choose Another Video
          </button>
          <input ref={inputRef} type="file" hidden onChange={chooseVideo} />
        </div>
      )}
    </Layout>
  );
```

## Conclusion
This OCR (optical character recognition) application was built using React and Tesseract.js. It allows the user to choose a video file and capture text from it, which is then processed using Tesseract.js and displayed on the screen. This code can serve as a starting point for building more complex OCR applications. 