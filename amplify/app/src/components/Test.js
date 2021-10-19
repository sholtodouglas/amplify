import React, { useState } from 'react';
import { Document, Page } from 'react-pdf';

import amplify from '../assets/images/amp.pdf'


export default function Test() {


  const [file, setFile] = useState(amplify);
  const [numPages, setNumPages] = useState(null);

  function onFileChange(event) {
    setFile(event.target.files[0]);
  }

  function onDocumentLoadSuccess({ numPages: nextNumPages }) {
    setNumPages(nextNumPages);
  }



  return (
  <div className="Example">
  <header>
  </header>
  <div className="Example__container">
    <div className="Example__container__document">
      <Document
        file={amplify}
        onLoadSuccess={onDocumentLoadSuccess}
        options={{ workerSrc: "/pdf.worker.js" }}
      >
        {
          Array.from(
            new Array(numPages),
            (el, index) => (
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                scale={1.8}
              />
            ),
          )
        }
      </Document>
  </div>
</div>
</div>


  );
}