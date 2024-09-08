// Apply drag, resize, and rotate functionality to existing divs with class 'draggable'
interact('.draggable')
  .draggable({
    listeners: {
      move(event) {
        const target = event.target;
        const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
        const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

        target.style.transform = `translate(${x}px, ${y}px)`;
        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
      }
    },
    inertia: true
  })
  .resizable({
    edges: { left: true, right: true, bottom: true, top: true },
    listeners: {
      move(event) {
        let { x, y } = event.target.dataset;
        event.target.style.width = `${event.rect.width}px`;
        event.target.style.height = `${event.rect.height}px`;

        x = (parseFloat(x) || 0) + event.deltaRect.left;
        y = (parseFloat(y) || 0) + event.deltaRect.top;

        event.target.style.transform = `translate(${x}px, ${y}px)`;
        event.target.dataset.x = x;
        event.target.dataset.y = y;
      }
    },
    inertia: true
  })
  .gesturable({
    listeners: {
      start(event) {
        const target = event.target;
        target.dataset.rotation = parseFloat(target.dataset.rotation) || 0;
      },
      move(event) {
        const target = event.target;
        const rotation = (parseFloat(target.dataset.rotation) || 0) + event.da;
        target.style.transform = `rotate(${rotation}deg)`;
        target.dataset.rotation = rotation;
      }
    }
  });
