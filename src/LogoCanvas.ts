interface Position {
  x: number;
  y: number;
  angle: number;
}

interface Waypoint {
  position: Position;
  penDown: boolean;
  colour: string;
}

interface DrawData {
  start: Waypoint;
  end: Waypoint;
}

export default class LogoCanvas {
  domElement: HTMLCanvasElement;
  context: CanvasRenderingContext2D;

  constructor(id: string) {
    this.domElement = <HTMLCanvasElement> document.getElementById(id);
    this.context = this.domElement.getContext('2d');
    this.resize();

    window.addEventListener('resize', () => {
      this.resize();
    });
  }

  clear(): void {
    this.context.clearRect(0, 0, this.domElement.width, this.domElement.height);
  }

  resize(): void {
    this.domElement.width = this.domElement.clientWidth;
    this.domElement.height = this.domElement.clientHeight;
  }

  reduceJourney(journey: Waypoint[]): DrawData[] {
    return journey.reduce((accumulator: DrawData[], currentValue: Waypoint, index: number, array: Waypoint[]) => {
      if(index !== array.length - 1) {
        accumulator.push({
          start: currentValue,
          end: array[index + 1]
        });
      }
      return accumulator;
    }, [])
    .filter((drawData: DrawData) => {
      return (
        drawData.start.penDown === true && 
        drawData.end.penDown === true && 
        (drawData.start.colour === drawData.end.colour)
      )
    });
  } 

  drawJourney(journey: Waypoint[]): void {
    this.reduceJourney(journey).forEach(this.drawLine);
  }

  drawLine(drawData: DrawData): void {
    this.context.strokeStyle = drawData.start.colour;

    this.context.beginPath();
    this.context.moveTo(drawData.start.position.x, drawData.start.position.y);
    this.context.lineTo(drawData.end.position.x, drawData.end.position.y);
    this.context.stroke();
  }
}