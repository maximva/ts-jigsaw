![npm badge](https://img.shields.io/npm/v/@nighthawks/ts-jigsaw?color=green)
![Unit test workflow](https://github.com/maximva/js-jigsaw/actions/workflows/run-tests.yml/badge.svg)

# ts-jigsaw

[@nighthawks/ts-jigsaw on NPM](https://www.npmjs.com/package/@nighthawks/ts-jigsaw)

Generates a set of puzzle pieces from any image.

![puzzle pieces](./resources/puzzle-pieces.png)

## Project Status
ts-jigsaw is a young project, and as such, there is room for improvement.
If you encounter any problems, feel free to create an issue, or create a pull-request.

## Documentation
The puzzle pieces are drawn with an HTML canvas and exported as an image.

The configuration is quit simple so the example below should be pretty self-explanatory.
You should however know that the image needs to originate from the same server
or that the server of origin needs to add the appropriate cors header. (https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image)

## Example

```javascript
  import {Puzzle} from '@nighthawks/ts-jigsaw'
  
  const getImage = async (url) => {
    return new Promise((resolve, reject) => {
      let img = new Image();
      img.setAttribute('crossorigin', 'anonymous');
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    })
  };
  
  const appendPuzzlePiecesToDrawer = () => {
    getImage("https://i.imgur.com/lBkmEFv.jpeg")
      .then(
        (img) => {
          const columns = 6;
          const rows = 4;
          const width = 600;
  
          const puzzle = new Puzzle(img, rows, columns, width, (width/3)*2);
          
          const puzzlePieceDrawer = document.getElementById('puzzle-piece-drawer');
  
          puzzle.getPuzzlePieces().forEach(puzzlePiece => {
            puzzlePieceDrawer.appendChild(puzzlePiece.image);
          })
        }
     )
  };
  
  window.addEventListener('DOMContentLoaded', appendPuzzlePiecesToDrawer);
```
