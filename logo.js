    const logo = document.querySelector('.enter-logo');
    const map = new Image();

    map.onload = function () {
      const canvas = document.createElement('canvas');
      canvas.width = 100;
      canvas.height = 100;
      canvas.className = 'enter-logo';

      const ctx = canvas.getContext('2d');
      ctx.drawImage(map, 0, 0);
      const normals = ctx.getImageData(0, 0, 100, 100).data;
      const output = ctx.createImageData(100, 100);

      function draw(lightX, lightY) {
        for (let i = 0; i < 10000; i++) {
          const x = i % 100;
          const y = Math.floor(i / 100);
          const nx = normals[i * 4] / 127.5 - 1;
          const ny = normals[i * 4 + 1] / 127.5 - 1;
          const nz = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny));
          const type = normals[i * 4 + 2];

          const dx = lightX - x;
          const dy = lightY - y;
          const light = (nx * dx + ny * dy + nz * 30) / Math.hypot(dx, dy, 30);

          let shade = 0;
          if (type > 0 && light > 0.65) shade = 255;
          else if (type === 255 || (type > 0 && light > 0.55)) shade = 127;

          output.data.fill(shade, i * 4, i * 4 + 3);
          output.data[i * 4 + 3] = 255;
        }
        ctx.putImageData(output, 0, 0);
      }

      draw(50, -80);
      logo.replaceWith(canvas);

      window.addEventListener('pointermove', function (event) {
        const box = canvas.getBoundingClientRect();
        draw(
          (event.clientX - box.left) / box.width * 100,
          (event.clientY - box.top) / box.height * 100
        );
      });
    };

    map.src = 'images/homelogo-normals.png';
