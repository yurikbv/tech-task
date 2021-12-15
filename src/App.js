import {useState} from "react";
import {fabric} from "fabric";
import UploadImageForm from "./components/UploadImageForm/UploadImageForm";
import './App.css';

let canvas;
let image = null;
let userClipPath;
let nowClip = {
  x: 0,
  y: 0
}

function App() {
  
  const [imgURL, setImgURL] = useState('');
  const [showActionButtons, setShowActionButtons] = useState(false);
  const [isCropMode, setIsCropMode] = useState(false);
  const [ dimensions, setDimensions ] = useState({width: 0, height: 0});
  
  const renderMainCanvas = async (url) => {
    // Add our image to canvas
    await new fabric.Image.fromURL(url, img => {
      //set offset 16px to see controls
      canvas.setHeight(img.height + 16);
      canvas.setWidth(img.width + 16);
      //set up an image
      img.set({
        angle: 0,
        centeredScaling: true,
        lockRotation: true,
        cornerColor: 'dodgerblue',
        originX: 'center',
        originY: 'center',
        top: canvas.height / 2,
        left: canvas.width / 2,
        globalCompositeOperation: 'destination-over'
      })
      // After a fail with keep aspect ratio I removed these controls
      img.setControlsVisibility({
        mb: false,
        ml: false,
        mr: false,
        mt: false,
        mtr: false
      })
      image = img;
      // save an image for further actions
      setDimensions({width: img.width, height: img.height})
      canvas.add(img);
      setImgURL('');
      }
    )
  }

  const addImg = async (e, url) => {
    e.preventDefault();
    // reset nowClip after recent crop
    nowClip = {x: 0, y: 0}
    // trigger to show action buttons
    setShowActionButtons(true);
    canvas = new fabric.Canvas('canvas');
    // set canvas to allow us to choose image layer and crop layer
    canvas.set({
      controlsAboveOverlay: true,
      preserveObjectStacking: true
    })
    // add our image to canvas
    await renderMainCanvas(url);
  }
  
  const createCropArea = async () => {
    // trigger to show the  crop button
    setIsCropMode(true);
    // create rect canvas object to choose crop area and set this object
    userClipPath = new fabric.Rect({
      top: 8,
      left: 8,
      width: image.width,
      height: image.height,
      transparentCorners: false,
      fill: 'rgb(178, 178, 178, 0.4)',
      cornerColor: 'rgb(178, 178, 178, 0.8)',
      strokeWidth: 1,
      cornerStrokeColor: '#1E28E6FF',
      borderColor: 'black',
      borderDashArray: [5, 5],
      cornerStyle: 'circle',
      selectable: true,
    });
    // crop area over the image object
    canvas.set({
      globalCompositeOperation: 'destination-over'
    })
    // disable angle control
    userClipPath.setControlVisible('mtr', false);
    // add a crop area to canvas
    canvas.add(userClipPath);
    // and render an image object and crop object together
    canvas.renderAll();
  }
  
  const handleClearCanvas = () => {
    // clear canvas and hide unnecessary buttons
    canvas.clear();
    setShowActionButtons(false);
    setIsCropMode(false);
  }
  
  const handleCropImage = () => {
    // show the action buttons
    setIsCropMode(true);
    // our offset
    const totalShiftOfInCanvas = 16;
    // get left, top, width, height of crop area
    const newImgCrop = userClipPath.getBoundingRect();
    // get left, top of image
    const imageShift = image.getBoundingRect();
    // new canvas dimensions
    canvas.setWidth(newImgCrop.width + totalShiftOfInCanvas);
    canvas.setHeight(newImgCrop.height + totalShiftOfInCanvas);
    // crop an image via known variables and set new ones
    image.set({
      cropX: (newImgCrop.left - imageShift.left) + nowClip.x,
      cropY: (newImgCrop.top - imageShift.top) + nowClip.y,
      width: newImgCrop.width,
      height: newImgCrop.height,
      originX: 'center',
      originY: 'center',
      top: canvas.height / 2,
      left: canvas.width / 2,
    })
    nowClip.x += newImgCrop.left;
    nowClip.y += newImgCrop.top;
    userClipPath.set({
      left: totalShiftOfInCanvas/2,
      top: totalShiftOfInCanvas/2
    })
    userClipPath.setCoords();
    canvas.renderAll();
  }
  
/*  const watchCanvasImage = () => {
    // watch if the image size is changing with only one side
    const {scaleX, scaleY} = image;
    const {width, height} = image.getBoundingRect();
    // if the width is changing
    if (width !== dimensions.width) {
      setDimensions({...dimensions, width})
      // but the height is not
      if (height === dimensions.height) {
        // the height must have the same scale
        image.set({scaleY: scaleX});
        image.add(image);
        image.renderAll();
        // NOT WORKING, IT WAS THE LAST ATTEMPT TO KEEP ASPECT RATIO. NO ONES WERE WORKING
        // I can't believe that fabric' authors could not make this method. Maybe I just didn't find
      }
    } else if (height !== dimensions.height) {
      setDimensions({...dimensions, height})
    }
  }*/
  
  return (
    <div className="upload__image">
      {showActionButtons &&
      <>
        <div className="upload__buttons--action">
          <button type="button" className="action__clear" onClick={handleClearCanvas}>Clear</button>
          {isCropMode
          && <button type="button" className="action__crop" onClick={handleCropImage}>Crop</button>}
        </div>
        <div onDoubleClick={() => {if (!isCropMode) createCropArea()}}>
          <canvas id="canvas"/>
        </div>
      </>
      }
      <UploadImageForm addImg={addImg} imgURL={imgURL} setImgURL={setImgURL}/>
    </div>
  );
}

export default App;
