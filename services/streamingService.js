const fs = require('fs');
const express = require('express');

const router = express.Router();

const segmentsPath = './services/streaming'; // Ruta completa al directorio que contiene los segmentos de video
let nextSegmentIndex = 0; // Iniciar con el primer segmento
let initialLoad = true;

router.get('/livestream', (req, res) => {
  const playlistPath = `./services/streaming/segment.m3u8`; // Ruta al archivo m3u8 de la lista de reproducción
  const segmentDuration = 10; // Duración de cada segmento en segundos
  let playlistContent = fs.readFileSync(playlistPath, 'utf8');

  // En la primera carga, agregar 3 segmentos, luego solo agregar uno
  const segmentsToAdd = initialLoad ? 3 : 1;
  initialLoad = false;

  for(let i = 0; i < segmentsToAdd; i++) {
    playlistContent = updatePlaylist(playlistContent, './services/streaming', segmentDuration);
  }

  // Escribir la lista de reproducción actualizada de vuelta en el sistema de archivos
  fs.writeFileSync(playlistPath, playlistContent);

  res.set('Content-Type', 'application/vnd.apple.mpegurl');
  res.send(playlistContent);
});

function updatePlaylist(playlistContent, segmentsPath, segmentDuration) {
  const lines = playlistContent.split('\n');
  const sequenceIndexLine = lines.findIndex(line => line.startsWith('#EXT-X-MEDIA-SEQUENCE:'));
  const sequenceIndex = parseInt(lines[sequenceIndexLine].split(':')[1]);
  const targetDurationLine = lines.find(line => line.startsWith('#EXT-X-TARGETDURATION:'));
  const targetDuration = parseInt(targetDurationLine.split(':')[1]);

  // Si no es la primera carga, eliminar el primer segmento de la lista
  if(nextSegmentIndex >= 3) {
    lines.splice(lines.findIndex(line => line.includes('.ts')), 2);
  }

  // Agregar un nuevo segmento al final de la lista
  const nextSegmentPath = `/services/streaming/segment${nextSegmentIndex % 64}.ts`; // Rotar a través de los segmentos
  const segmentLine = `#EXTINF:${segmentDuration.toFixed(6)},\n${nextSegmentPath}`;
  lines.push(segmentLine);

  // Actualizar el valor de EXT-X-MEDIA-SEQUENCE
  lines[sequenceIndexLine] = `#EXT-X-MEDIA-SEQUENCE:${sequenceIndex + 1}`;

  // Incrementar nextSegmentIndex para la siguiente vez
  nextSegmentIndex++;

  // Actualizar el contenido de la lista de reproducción
  const updatedPlaylistContent = lines.join('\n');

  return updatedPlaylistContent;
}

module.exports = router;
