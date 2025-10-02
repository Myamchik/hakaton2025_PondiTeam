document.addEventListener('DOMContentLoaded', () => {
    const anchor = document.querySelector('#ar-anchor');
    const scene = document.querySelector('a-scene');
    const model = document.querySelector('#ar-model');

    let pinnedEntity = null;
    const lastPos = new THREE.Vector3();
    const lastQuat = new THREE.Quaternion();
    const lastScale = new THREE.Vector3();

    // Постоянно сохраняем позицию, пока маркер виден
    (function sampleLoop() {
        try {
            if (model && anchor && anchor.object3D && anchor.object3D.visible) {
                model.object3D.updateMatrixWorld(true);
                model.object3D.getWorldPosition(lastPos);
                model.object3D.getWorldQuaternion(lastQuat);
                model.object3D.getWorldScale(lastScale);
            }
        } catch (e) {
            console.warn('sampling error', e);
        }
        requestAnimationFrame(sampleLoop);
    })();

    anchor.addEventListener('targetFound', () => {
        console.log('marker found');
        const soundComponent = model.components.sound;
        if (soundComponent) {
        soundComponent.playSound(); // Запуск звука
    }
        if (pinnedEntity) { pinnedEntity.remove(); pinnedEntity = null; }
    });

    anchor.addEventListener('targetLost', () => {
        console.log('marker lost — создаём pinned clone');
        const soundComponent = model.components.sound;
        if (soundComponent) {
        soundComponent.pauseSound(); // Пауза
        }
        if (pinnedEntity) {
            console.log('already pinned — skip');
            return;
        }

        pinnedEntity = document.createElement('a-entity');
        const src = model.getAttribute('src') || model.getAttribute('gltf-model');
        if (src) pinnedEntity.setAttribute('gltf-model', src);
        pinnedEntity.setAttribute('scale', `${lastScale.x} ${lastScale.y} ${lastScale.z}`);

        pinnedEntity.addEventListener('model-loaded', () => {
            pinnedEntity.object3D.position.copy(lastPos);
            pinnedEntity.object3D.quaternion.copy(lastQuat);
            pinnedEntity.object3D.scale.copy(lastScale);
            pinnedEntity.object3D.updateMatrix();
            pinnedEntity.object3D.matrixWorldNeedsUpdate = true;
            console.log('pinned at', lastPos, lastQuat, lastScale);
        });

        scene.appendChild(pinnedEntity);
    });

    // --- ОБНОВЛЕННЫЙ КОД ДЛЯ ЗАХВАТА ФОТО ---
    const captureBtn = document.getElementById("captureBtn");
    captureBtn.addEventListener('click', () => {
        const webGLCanvas = scene.renderer.domElement;
        // MindAR обычно создает элемент <video> в корне <body>.
        const videoElement = document.querySelector('video');

        if (!videoElement) {
            console.error("Не удалось найти видеоэлемент камеры.");
            alert("Ошибка: не удалось найти видеопоток камеры!");
            return;
        }

        // Ждём кадр для корректного рендера 3D-сцены
        requestAnimationFrame(() => {
            try {
                // 1. Создаем временный 2D-канвас для объединения
                const tempCanvas = document.createElement('canvas');
                const width = webGLCanvas.width;
                const height = webGLCanvas.height;
                tempCanvas.width = width;
                tempCanvas.height = height;
                const ctx = tempCanvas.getContext('2d');

                // 2. Отрисовываем видеопоток на 2D-канвасе (фон)
                // Используем размеры WebGL-канваса, чтобы обеспечить правильное масштабирование
                ctx.drawImage(videoElement, 0, 0, width, height);

                // 3. Отрисовываем содержимое WebGL-канваса (3D-модель) поверх видео
                ctx.drawImage(webGLCanvas, 0, 0, width, height);

                // 4. Сохраняем результат
                const dataURL = tempCanvas.toDataURL("image/png");
                
                // Проверяем, что изображение не пустое
                if (dataURL.length < 50) {
                     throw new Error("Сгенерированное фото слишком маленькое. Проблема с канвасом/потоком.");
                }

                localStorage.setItem("capturedPhoto", dataURL);
                // Отправляем пользователя на страницу просмотра фото
                window.location.href = "photo.html"; 
            } catch (err) {
                console.error("Ошибка при сохранении скриншота:", err);
                alert("Не удалось сделать фото :(\n" + err.message);
            }
        });
    });
});