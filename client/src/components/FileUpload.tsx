import React, { useState } from "react";

const FileUpload = () => {
  const [file, setFile] = useState(null);

  // Function to trigger the file input click event (without any actual uploading)
  const triggerFileInput = () => {
    // File input click functionality can stay, but nothing happens here yet.
    alert("File input triggered (nothing happens yet).");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      {/* Hidden file input */}
      <input
        type="file"
        style={{ display: "none" }} // Hide the file input
      />
      
      {/* Select File Button */}
      <button onClick={triggerFileInput} style={{ marginRight: "10px" }}>
        Select File
      </button>

      {/* The rest of the UI elements can stay, but will be inactive */}
      <div>
        {/* These will not show any actual progress or URL for now */}
      </div>
    </div>
  );
};

export default FileUpload;
