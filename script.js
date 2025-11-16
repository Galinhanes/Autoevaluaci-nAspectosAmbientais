document.addEventListener('DOMContentLoaded', () => {
    // 1. Selección de elementos do DOM
    const dragItems = document.querySelectorAll('.drag-item');
    const dropZones = document.querySelectorAll('.drop-zone');
    const dropZoneContainer = document.getElementById('drop-zone-container');
    const dragItemsContainer = document.getElementById('drag-items-container');
    const feedbackMessage = document.getElementById('feedback-message');

    let draggedItem = null;
    let totalItems = dragItems.length;

    // 2. Función de comprobación de éxito
    const checkCompletion = () => {
        let correctCount = 0;
        
        // Iterar sobre todos os elementos arrastrábeis
        dragItems.forEach(item => {
            const parentZone = item.closest('.drop-zone');
            
            // Comprobar se está nunha zona de solta
            if (parentZone) {
                const itemType = item.dataset.type; // Ex: 'Aspecto'
                const zoneTarget = parentZone.dataset.target; // Ex: 'Aspecto'
                
                // Comprobar se a resposta é correcta
                if (itemType === zoneTarget) {
                    correctCount++;
                }
            }
        });

        // 3. Lóxica de Autoavaliación (Éxito)
        if (correctCount === totalItems && dragItemsContainer.children.length === 0) {
            // Se todo está correcto e non queda nada no contedor inicial
            
            // 3.1. Aplicar estilo de éxito a toda a táboa
            dropZones.forEach(zone => {
                zone.classList.add('success-mode');
            });
            
            // 3.2. Mostrar mensaxe de éxito
            feedbackMessage.textContent = '🥳 Parabéns! Clasificaches todos os aspectos e impactos correctamente.';
            feedbackMessage.className = 'feedback-success';
            feedbackMessage.style.display = 'block';
            
            // 3.3. Desactivar a posibilidade de seguir arrastrando
            dragItems.forEach(item => {
                item.draggable = false;
                item.style.cursor = 'default';
                item.style.borderColor = '#2e7d32'; // Engadir un toque verde individual
            });

        } else if (correctCount > 0) {
            // Poderíase engadir aquí unha lóxica para dar pistas se non están todos ben
        }
    };

    // 4. Implementación dos eventos de Drag and Drop

    // Eventos nos elementos arrastrábeis
    dragItems.forEach(item => {
        item.addEventListener('dragstart', (e) => {
            draggedItem = item;
            // Engadir unha clase para darlle un estilo visual mentres se arrastra
            setTimeout(() => item.classList.add('dragging'), 0);
        });

        item.addEventListener('dragend', () => {
            draggedItem.classList.remove('dragging');
            draggedItem = null;
            // Comprobar despois de cada solta
            checkCompletion();
        });
    });

    // Eventos nas zonas de solta
    dropZones.forEach(zone => {
        // Previr o comportamento por defecto para permitir a solta
        zone.addEventListener('dragover', (e) => {
            e.preventDefault();
            zone.classList.add('drop-zone-hover'); // Feedback visual
        });

        zone.addEventListener('dragleave', () => {
            zone.classList.remove('drop-zone-hover');
        });

        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.classList.remove('drop-zone-hover');

            if (draggedItem) {
                // Mover o elemento á nova zona de solta
                zone.appendChild(draggedItem);
                
                // Unha vez solto, comprobar a autoavaliación
                checkCompletion();
            }
        });
    });
    
    // Permitir arrastrar de novo os elementos cara o contedor inicial se se equivocan
    dragItemsContainer.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    dragItemsContainer.addEventListener('drop', (e) => {
        e.preventDefault();
        if (draggedItem) {
            dragItemsContainer.appendChild(draggedItem);
            checkCompletion();
        }
    });

    // Iniciar a comprobación ao cargar a páxina (por se houbera algún elemento xa no sitio por defecto)
    checkCompletion();
});