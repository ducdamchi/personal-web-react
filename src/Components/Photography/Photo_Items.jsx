import React from 'react'
import { useState, useRef, useEffect, useLayoutEffect } from 'react'
import '../../App.css'
import './Photography.css'
import Modal from './Photo_Modal';

export default function Carousel_Items( {albumsData, carouselIndex, slidesOffset, isEdgeTransition, albumsPerSlide, carouselBtnLeft, carouselBtnRight, screenWidth}) {
  /*************** STATES AND VARS **************/
  /* store which album was clicked on */
  const [openModalId, setOpenModalId] = useState(null); 
  /* store which thumbnail is being hovered on */
  const [hoverId, setHoverId] = useState(null);
  /* store clone slides */
  const [clonesLeft, setClonesLeft] = useState([]);    
  const [clonesRight, setClonesRight] = useState([]);
  const [imgWidth, setImgWidth] = useState(null);
  const thumbnails = useRef(null);
  const box = useRef(null);

  
  /*************** CSS **************/
  const THUMBNAIL_FLEX_CONTAINER = {
    display: 'flex',
    alignItems: 'flex-start',
    position: 'relative',
    top: '0%',
    width: 'calc(100% - 2 * var(--slider-padding))',
    transform: `translateX(calc((${carouselIndex} + ${slidesOffset}) * -100%))`,
    transition: isEdgeTransition? 'none' : 'transform 750ms ease-in-out',
  }

  const THUMBNAIL_FLEX_ITEM = {
    width: `${100 / albumsPerSlide}%`, 
    borderWidth: '3px',
    borderStyle: 'solid',
    borderColor: 'red'
  }

  const THUMBNAIL_TITLE = {
    fontSize: `${imgWidth * 0.05}px`
  }

  const THUMBNAIL_YEAR = {
    fontSize: `${imgWidth * 0.04}px`
  }

  /*************** HOOKS & FUNCTIONS **************/
  function handleThumbnailInteraction(albumId, isMouseEnter) {
    if (isMouseEnter) {
      setHoverId(albumId);
      carouselBtnLeft.current.style.opacity = '0';
      carouselBtnRight.current.style.opacity = '0';
    } else {
      setHoverId(null);
      carouselBtnLeft.current.style.opacity = '1';
      carouselBtnRight.current.style.opacity = '1';
    }
  }
  
  /* Make clones of first and last page of carousel */
  useEffect(() => {

    /* Make sure thumbnails useRef object not null */
    if (thumbnails.current) {

      /* Select all thumbnail imgs, extract first three and last three */
      const images = thumbnails.current.querySelectorAll('.thumbnail-img');
      const titles = thumbnails.current.querySelectorAll('.thumbnail-title');
      const years = thumbnails.current.querySelectorAll('.thumbnail-year')

      const firstImgs = [...images].slice(0, albumsPerSlide);
      const lastImgs = [...images].slice(-albumsPerSlide);
      const firstTitles = [...titles].slice(0, albumsPerSlide);
      const lastTitles = [...titles].slice(-albumsPerSlide);
      const firstYears = [...years].slice(0, albumsPerSlide);
      const lastYears = [...years].slice(-albumsPerSlide);

      /* Make clones of those two 'slides' to reference in HTML */
      let clonesLeftLst = [];
      for (let i=0; i < albumsPerSlide; i++) {
        let clone_info = [];        
        clone_info.push(lastImgs[i].src);
        clone_info.push(lastTitles[i].innerHTML);
        clone_info.push(lastYears[i].innerHTML);
        clonesLeftLst.push(clone_info)
      }

      let clonesRightLst = [];
      for (let i=0; i < albumsPerSlide; i++) {
        let clone_info = [];        
        clone_info.push(firstImgs[i].src);
        clone_info.push(firstTitles[i].innerHTML);
        clone_info.push(firstYears[i].innerHTML);
        clonesRightLst.push(clone_info)
      }
    
      // console.log("clones Left:", clonesLeftLst);
      // console.log("clones Right:", clonesRightLst);

      setClonesLeft(clonesLeftLst);
      setClonesRight(clonesRightLst);
    }
  }, [albumsPerSlide]);

  /* Pick background color for thumbnail description that matches the image dominant color */
  useEffect(() => {
    if (hoverId != null) {
      const img = document.getElementById(`thumbnail-img-${hoverId}`);
      const thumbnail_description = document.getElementById(`thumbnail-description-${hoverId}`);
      const colorThief = new ColorThief();
      const domColor = colorThief.getColor(img);

      /* Check brightness of dominant color to ensure readability 
      Formula: https://www.nbdtech.com/Blog/archive/2008/04/27/Calculating-the-Perceived-Brightness-of-a-Color.aspx */
      const brightness = Math.round(Math.sqrt(domColor[0]*domColor[0]*0.241 + domColor[1]*domColor[1]*0.691 + domColor[2]*domColor[2]*0.068))
      // console.log(brightness);

      /* If bg dark enough, font can be white */
      if (brightness < 130) {
        thumbnail_description.style.backgroundColor = `rgb(${domColor[0]}, ${domColor[1]}, ${domColor[2]})`;
      /* If bg a little light, reduce each rgb value by 25% */
      } else if (130 <= brightness < 194){
        thumbnail_description.style.backgroundColor = `rgb(${domColor[0]*0.75}, ${domColor[1]*0.75}, ${domColor[2]*0.75})`;
      /* If bg too light, reduce each rgb value by 50% */
      } else {
        thumbnail_description.style.backgroundColor = `rgb(${domColor[0]*0.5}, ${domColor[1]*0.5}, ${domColor[2]*0.5})`;
      }

    }
  }, [hoverId])
 
  useEffect(() => {
    if (box.current) {
      console.log(box.current);
      setImgWidth(box.current.clientWidth);
    }
  }, [])

  return (
    <div ref={thumbnails} style={THUMBNAIL_FLEX_CONTAINER}>
      
      {/* Clones on left side */}
      {clonesLeft.map((cloneInfo, index) => (
        <div 
            key={`cloneLeft-${index}`} 
            className="thumbnail-flex-item" 
            style={THUMBNAIL_FLEX_ITEM}>

            <div className="thumbnail-box">
              <div className="thumbnail-info-container-clone relative">
                <img 
                  className="thumbnail-img-clone" 
                  src={cloneInfo[0]}/>

                <div className='thumbnail-title-year-container'>
                  <div
                    className="thumbnail-title-year ">
                    <div
                      className="thumbnail-title">
                      {cloneInfo[1]}
                    </div>
                    <div
                      className="thumbnail-year">
                      {cloneInfo[2]}
                    </div>
                  </div>
                </div>

              </div>
            </div>
        </div>
      ))}
      
      {/* Real slides: Iterate through each album and present its info */}
      {albumsData
        .filter((album) => album.isHighlight === true)
        .map((album) => (
        <div 
          className="thumbnail-flex-item"
          key={album.id} 
          style={THUMBNAIL_FLEX_ITEM}>
            
            <div 
              className="thumbnail-box"
              onMouseEnter={() => handleThumbnailInteraction(album.id, true)}
              onMouseLeave={() => handleThumbnailInteraction(album.id, false)}>

              <div className="thumbnail-info-container relative">
                <img 
                  className="thumbnail-img"
                  id={`thumbnail-img-${album.id}`} 
                  src={album.thumbnail.src} 
                  onClick={() => {
                    setOpenModalId(album.id);}}/>

                <div 
                  ref={album.id === 0 ? box : null}
                  className='thumbnail-title-year flex flex-col justify-center items-start'>
                    <div className='thumbnail-title border-2 border-green-500 text-left' style={THUMBNAIL_TITLE} >THIS IS A SUPER DUPER LONG EXAMPLE TITLE NAME <br/>
                    <span className="thumbnail-year" style={THUMBNAIL_YEAR}>{album.year}</span></div>
                </div>
              </div>
          
                
              {(album.id === hoverId) && 
              <div
                id={`thumbnail-description-${album.id}`}
                className="thumbnail-description text-lg font-thin">
                {album.description}
              </div>}
            </div>   


            {/* Modal Viewer, hidden until thumbnail is clicked on, 
            then rendered on portal different from root */}
            {(album.id === openModalId) && 
              <Modal
                album={album} 
                openModalId={openModalId} 
                closeModal={() => {
                  setOpenModalId(null);
                  console.log('closing modal');
                }}/>}

        </div>
      ))}

      {/* Clones on right side */}
      {clonesRight.map((cloneInfo, index) => (
        <div 
          key={`cloneRight-${index}`} 
          className="thumbnail-flex-item" 
          style={THUMBNAIL_FLEX_ITEM}>

            <div className="thumbnail-box">
              <div className="thumbnail-info-container-clone relative">
                <img 
                  className="thumbnail-img-clone" 
                  src={cloneInfo[0]}/>

                <div className='thumbnail-title-year-container'>
                  <div
                    className="thumbnail-title-year">
                    <div
                      className="thumbnail-title">
                      {cloneInfo[1]}
                    </div>
                    <div
                      className="thumbnail-year">
                      {cloneInfo[2]}
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </div>
      ))}

    </div>
  )
}