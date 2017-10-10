export default class Canvas {
  domElement: HTMLCanvasElement;
  context: CanvasRenderingContext2D;

  constructor(id: string) {
    this.domElement = <HTMLCanvasElement> document.getElementById(id);
    this.context = this.domElement.getContext("2d");
    this.resize();

    window.addEventListener("resize", () => {
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

  drawLine(journey: any): void {
    if(journey.start.penDown === true && journey.start.penDown === true) {
      this.context.beginPath();
      this.context.moveTo(journey.start.position.x, journey.start.position.y);
      this.context.lineTo(journey.end.position.x, journey.end.position.y);
      this.context.stroke();
    }
  }
}