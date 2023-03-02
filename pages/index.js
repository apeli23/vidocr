import React, { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import Layout from '../components/Layout';

function OCR() {
  const videoRef = useRef(null);
  const inputRef = useRef(null);
  const resultRef = useRef(null);

  const [video, setVideo] = useState(null);
  const [textpreview, setTextPreview] = useState(false);

  const chooseVideo = (e) => {
    const file = e.target?.files?.[0];
    setVideo(file);
  };

  const captureText = async () => {
    const video = videoRef.current;
    const canvas = await html2canvas(video);
    handleOCR(canvas.toDataURL());
  };

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

  const textHandler = (txt) => {
    if (txt) {
      const cleaned_Text = txt.replace(/[^a-zA-Z ]/g, '');
      setTextPreview(cleaned_Text);
    }
  };

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
        <>
          <h2 className='text-center text-3xl font-black'>Extract Text(s) from Video</h2>
          <p className='text-center text-3sm'>#nextjs #tailwind #tesseractjs</p>
        
        <div className="grid h-screen place-items-center">
          <button
            className="w-3/4 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
            onClick={() => inputRef.current.click()}
          >
            Choose Another Video
          </button>
          <input ref={inputRef} type="file" hidden onChange={chooseVideo} />
        </div>
        </>
      )}
    </Layout>
  );
}

export default OCR;
