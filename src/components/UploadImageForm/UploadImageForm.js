import './UploadImageForm.scss';
import {useState} from "react";

const UploadImageForm = ({addImg, imgURL, setImgURL}) => {
  
  const [enableSubmit, setEnableSubmit] = useState(false);
  
  const isValidWebUrl = (url) => {
    let regEx = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_.~#?&//=]*)$/gm;
    return regEx.test(url);
  }
  
  const handleUploadFormLink = (url) => {
    //Verify url is valid
    const isUrl = isValidWebUrl(url);
    //Verify url is an image link
    const isImage = url.match(/\.(jpeg|jpg|gif|png)$/) != null;
    const valid = isUrl && isImage;
    //if everything is right then the button is clickable now
    setEnableSubmit(valid);
    setImgURL(url);
  }
  
  const handleUploadFormFile = (e) => {
    //work with an image file
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = function (f) {
      let data = f.target.result;
      addImg(e, data);
    };
    reader.readAsDataURL(file);
  }
  
  return (
    <div className="upload__form--block">
      <form onSubmit={e => addImg(e, imgURL)} className="upload__form">
        <input
          type="text"
          value={imgURL}
          onChange={(e) => handleUploadFormLink(e.target.value)}
          className="upload__form--input-link"
          placeholder="Link to image"
        />
        <div className="upload__form--buttons">
          <div className="upload__form--input-group">
            <input type="file" name="file" id="file"
                   className="upload__form--input-file" onChange={handleUploadFormFile}/>
            <label htmlFor="file" className="btn btn-tertiary js-labelFile">
              <span className="js-fileName">Upload image file</span>
            </label>
          </div>
          <button type="submit" className="upload__form--btn" disabled={!enableSubmit}>Upload image</button>
        </div>
      </form>
    </div>
  );
};

export default UploadImageForm;
