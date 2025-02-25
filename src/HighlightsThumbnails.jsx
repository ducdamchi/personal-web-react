import React from 'react'
import { useState, useRef, useEffect } from 'react'
import './App.css'

export default function HighlightsThumbnails( {carouselIndex, isEdgeTransition, imageWidthPercent, imagesPerSlide}) {

  /*************** STATES AND VARS **************/
  const [clonesLeft, setClonesLeft] = useState([]);    /* slide shows up when slide left on first page. */
  const [clonesRight, setClonesRight] = useState([]);   /* slide shows up when slide right on last page. */

  /*************** CSS **************/
  const CAROUSEL_STYLE = {
    '--slider-index': carouselIndex, // to be modified with useState()
    display: 'flex',
    width: 'calc(100% - 2 * var(--slider-padding))', // check App.css root for --slider-padding
    transform: 'translateX(calc(var(--slider-index) * -100%))',

    /* If EdgeTransition flag is set, transform from clone slide to real 
    slide without any effects. If flag not set, use transform transition.*/
    transition: isEdgeTransition? 'none' : 'transform 750ms ease-in-out',
  }

  const THUMBNAIL_DIV_STYLE = {
    flex: 'none',
    display: 'flex',
    maxWidth: imageWidthPercent, 
    alignContent: 'center',
    justifyContent: 'center',
  }

  /*************** CLASSES **************/
  class Image {
    constructor(src, description) {
      this.src = src;
      this.description = description;
    }
  }

  class Album {
    /* 
    imgList: a list of Image objects
    thumbnail: Image object
    */
    constructor(imgList, thumbnail, description, isHighlight) {
      this.imgList = imgList;
      this.thumbnail = thumbnail;
      this.description = description;
      this.isHighlight = isHighlight;
    }
  }


  /*************** HOOKS **************/
  /* Make clones of first and last page of carousel */
  const thumbnails = useRef(null);
  useEffect(() => {

    /* Make sure thumbnails useRef object not null */
    if (thumbnails.current) {

      /* Select all thumbnail imgs, extract first three and last three */
      const allThumbnails = thumbnails.current.querySelectorAll('.thumbnail-img');
      const firstPage = [...allThumbnails].slice(0, imagesPerSlide);
      const lastPage = [...allThumbnails].slice(-imagesPerSlide);

      /* Make clones of those two 'slides', will call clonesLeft/Right in HTML */
      setClonesLeft(lastPage.map((thumbnail) => thumbnail.src));
      setClonesRight(firstPage.map((thumbnail) => thumbnail.src));
    }
  }, []);

  return (
    <div ref={thumbnails} style={CAROUSEL_STYLE}>

      {clonesLeft.map((src, index) => (
        <div key={`cloneLeft-${index}`} className="thumbnail-div" style={THUMBNAIL_DIV_STYLE}>
          <img className="thumbnail-img-clone" src={src}/>
        </div>
      ))}

      <div className="thumbnail-div" style={THUMBNAIL_DIV_STYLE}>
        <img className="thumbnail-img" src="./photography/ex1/img5.jpg"/>
      </div>
      <div className="thumbnail-div" style={THUMBNAIL_DIV_STYLE}>
        <img className="thumbnail-img" src="./photography/ex2/img9.jpg"/>
      </div>
      <div className="thumbnail-div" style={THUMBNAIL_DIV_STYLE}>
        <img className="thumbnail-img" src="./photography/ex3/img1.JPG"/>
      </div>
      <div className="thumbnail-div" style={THUMBNAIL_DIV_STYLE}>
        <img className="thumbnail-img" src="./photography/ex4/img1.jpg"/>
      </div>
      <div className="thumbnail-div" style={THUMBNAIL_DIV_STYLE}>
        <img className="thumbnail-img" src="./photography/ex5/img1.png"/>
      </div>
      <div className="thumbnail-div" style={THUMBNAIL_DIV_STYLE}>
        <img className="thumbnail-img" src="./photography/ex6/img1.jpg"/>
      </div>
      <div className="thumbnail-div" style={THUMBNAIL_DIV_STYLE}>
        <img className="thumbnail-img" src="./photography/ex7/img1.jpg"/>
      </div>
      <div className="thumbnail-div" style={THUMBNAIL_DIV_STYLE}>
        <img className="thumbnail-img" src="./photography/ex8/img1.JPG"/>
      </div>
      <div className="thumbnail-div" style={THUMBNAIL_DIV_STYLE}>
        <img className="thumbnail-img" src="./photography/ex9/img1.jpg"/>
      </div>

      {clonesRight.map((src, index) => (
        <div key={`cloneRight-${index}`} className="thumbnail-div" style={THUMBNAIL_DIV_STYLE}>
          <img className="thumbnail-img-clone" src={src}/>
        </div>
      ))}

    </div>
  )
}
