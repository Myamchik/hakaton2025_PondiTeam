document.addEventListener('DOMContentLoaded',  async  ()  =>  {
    const  scene  =  document.querySelector('a-scene');
    const  captureBtn  =  document.getElementById('captureBtn');
    const  cameraFeed  =  document.getElementById('cameraFeed');
    let  portal  =  null;

    // Запуск  камеры 
    try  {
        const  stream  =  await  navigator.mediaDevices.getUserMedia({  video:  {  facingMode:  'environment'  }  });
        cameraFeed.srcObject  =  stream;
    }  catch  (err)  {
        alert('Ошибка  доступа  к  камере:  '  +  err.message);
        return;
    }

    //  Создание  портала 
    scene.addEventListener('click',  ()  =>  {
        if  (portal)  return;

        portal  =  document.createElement('a-entity');

        const  frame  =  document.createElement('a-plane');
        frame.setAttribute('src',  '#portal-frame');
        frame.setAttribute('height',  '2.5');
        frame.setAttribute('width',  '1.2');
        frame.setAttribute('material',  'transparent:true;  side:double;');
        portal.appendChild(frame);

        const  model  =  document.createElement('a-gltf-model');
        model.setAttribute('src',  '#character-model');
        model.setAttribute('scale',  '0.7 0.7 0.7');
        model.setAttribute('position',  '-0.1  -1  0.1');
        model.setAttribute('animation-mixer',  'clip:*;loop:repeat;');
        portal.appendChild(model);

        portal.setAttribute('position',  '0  0  -4');
        portal.setAttribute(
            'animation__scale',
            'property:scale;from:0 0 0;to:2 2 2;dur:800;easing:easeOutElastic;'
        );

        scene.appendChild(portal);

        // сообщение скрывается при появлении волка
        const touchMsg = document.getElementById('touchMessage');
        const swipeMsg = document.getElementById('swipeMessage');
        if (touchMsg) {
            touchMsg.style.display = 'none';
        }
        if (swipeMsg) {
            swipeMsg.style.display = 'block';
            setTimeout(() => swipeMsg.style.display = 'none', 3000);
        }
    });

    //  Фото
    captureBtn.addEventListener('click',  ()  =>  {
        const  webGLCanvas  =  scene.renderer.domElement;
        requestAnimationFrame(()  =>  {
            const  tempCanvas  =  document.createElement('canvas');
            const  width  =  webGLCanvas.width;
            const  height  =  webGLCanvas.height;
            tempCanvas.width  =  width;
            tempCanvas.height  =  height;
            const  ctx  =  tempCanvas.getContext('2d');
            ctx.drawImage(cameraFeed,  0,  0,  width,  height);
            ctx.drawImage(webGLCanvas,  0,  0,  width,  height);
            const  dataURL  =  tempCanvas.toDataURL('image/png');
            localStorage.setItem('capturedPhoto',  dataURL);
            window.location.href  =  'photo.html';
        });
    });
});
